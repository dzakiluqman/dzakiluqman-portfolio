import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ExternalLink,
  Github,
  AlertCircle,
  CheckCircle2,
  FolderGit2,
  Image as ImageIcon,
  Layers,
  Sparkles,
  X
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ProjectFormModal from '../../components/admin/ProjectFormModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'

export const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success', description = '') => {
    setNotification({ message, type, description })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchProjects = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('dzaki_demo_projects')
      if (stored) {
        try {
          setProjects(JSON.parse(stored))
        } catch {
          setProjects([])
        }
      } else {
        setProjects([])
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      showNotification('Failed to load projects: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  // --- CRUD: CREATE / UPDATE PROJECT ---
  const handleSaveProject = async (formData) => {
    setIsSaving(true)

    // Normalize images and cover
    const imagesArray = Array.isArray(formData.images) ? formData.images : []
    const primaryCoverUrl = imagesArray.length > 0 ? imagesArray[0] : (formData.thumbnail_url || '')

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      description: formData.description,
      content: formData.content || '',
      tech_stack: Array.isArray(formData.tech_stack) ? formData.tech_stack : [],
      github_url: formData.github_url || null,
      demo_url: formData.demo_url || null,
      images: imagesArray,
      thumbnail_url: primaryCoverUrl,
      is_featured: Boolean(formData.is_featured),
      is_published: formData.is_published !== undefined ? Boolean(formData.is_published) : true,
      sort_order: parseInt(formData.sort_order, 10) || 0
    }

    try {
      // 1. DEMO MODE (Local Storage)
      if (!isSupabaseConfigured) {
        let updatedList
        if (editingProject) {
          updatedList = projects.map((p) =>
            p.id === editingProject.id
              ? { ...p, ...payload, updated_at: new Date().toISOString() }
              : p
          )
        } else {
          const newProject = {
            ...payload,
            id: `demo-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          updatedList = [newProject, ...projects]
        }
        setProjects(updatedList)
        localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
        setIsModalOpen(false)
        showNotification(
          editingProject ? 'Project updated!' : 'Project created!',
          'success',
          `Saved locally with ${imagesArray.length} gallery image(s) (Demo Mode)`
        )
        return
      }

      // 2. LIVE SUPABASE DATABASE
      if (editingProject) {
        let { error } = await supabase
          .from('projects')
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id)

        // Resilient fallback if Supabase table has not run images migration yet
        if (error && (error.message?.includes('images') || error.code === 'PGRST204')) {
          console.warn('Retrying project update without images column:', error)
          const { images: _omitted, ...safePayload } = payload
          const retry = await supabase
            .from('projects')
            .update({
              ...safePayload,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingProject.id)
          if (retry.error) throw retry.error
          showNotification(
            'Project updated (thumbnail saved)',
            'success',
            'Note: run the latest SQL migration to enable the images array column.'
          )
        } else if (error) {
          throw error
        } else {
          showNotification('Project updated successfully!', 'success', `${imagesArray.length} showcase images synced`)
        }
      } else {
        let { error } = await supabase
          .from('projects')
          .insert([payload])

        if (error && (error.message?.includes('images') || error.code === 'PGRST204')) {
          console.warn('Retrying project insert without images column:', error)
          const { images: _omitted, ...safePayload } = payload
          const retry = await supabase
            .from('projects')
            .insert([safePayload])
          if (retry.error) throw retry.error
          showNotification(
            'Project created!',
            'success',
            'Note: run the latest SQL migration to enable the images array column.'
          )
        } else if (error) {
          throw error
        } else {
          showNotification('Project created successfully!', 'success', `Saved with ${imagesArray.length} showcase image(s)`)
        }
      }

      setIsModalOpen(false)
      await fetchProjects()
    } catch (err) {
      console.error('Error saving project:', err)
      showNotification(err.message || 'Error saving project', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // --- TOGGLE PUBLISHED ---
  const handleTogglePublished = async (project) => {
    const updatedValue = !project.is_published

    if (!isSupabaseConfigured) {
      const updatedList = projects.map((p) =>
        p.id === project.id ? { ...p, is_published: updatedValue } : p
      )
      setProjects(updatedList)
      localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
      showNotification(`Project ${updatedValue ? 'published' : 'hidden'}`)
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_published: updatedValue })
        .eq('id', project.id)

      if (error) throw error
      setProjects(projects.map((p) => (p.id === project.id ? { ...p, is_published: updatedValue } : p)))
      showNotification(`Visibility: ${updatedValue ? 'Published on portfolio' : 'Hidden from public'}`)
    } catch (err) {
      showNotification('Failed to update status: ' + err.message, 'error')
    }
  }

  // --- TOGGLE FEATURED ---
  const handleToggleFeatured = async (project) => {
    const updatedValue = !project.is_featured

    if (!isSupabaseConfigured) {
      const updatedList = projects.map((p) =>
        p.id === project.id ? { ...p, is_featured: updatedValue } : p
      )
      setProjects(updatedList)
      localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
      showNotification(`Featured state updated`)
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: updatedValue })
        .eq('id', project.id)

      if (error) throw error
      setProjects(projects.map((p) => (p.id === project.id ? { ...p, is_featured: updatedValue } : p)))
      showNotification(`Featured showcase ${updatedValue ? 'enabled' : 'disabled'}`)
    } catch (err) {
      showNotification('Failed to update featured flag: ' + err.message, 'error')
    }
  }

  // --- DELETE PROJECT ---
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return
    }

    if (!isSupabaseConfigured) {
      const updatedList = projects.filter((p) => p.id !== id)
      setProjects(updatedList)
      localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
      showNotification(`Project deleted (Demo Mode)`)
      return
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects(projects.filter((p) => p.id !== id))
      showNotification('Project deleted permanently from database')
    } catch (err) {
      showNotification('Failed to delete project: ' + err.message, 'error')
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]

  const publishedCount = projects.filter((p) => p.is_published).length
  const featuredCount = projects.filter((p) => p.is_featured).length

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col md:flex-row text-zinc-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Project Management"
          subtitle="Manage portfolio showcase projects, Supabase Storage image galleries, tech stacks & URLs"
          action={
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-sm transition-all cursor-pointer font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          }
        />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Floating Toast Notification */}
          {notification && (
            <div
              className={`p-4 rounded-2xl flex items-start justify-between gap-3 text-xs border backdrop-blur-md shadow-2xl transition-all ${notification.type === 'error'
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                }`}
            >
              <div className="flex items-start gap-3">
                {notification.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-white text-sm">{notification.message}</p>
                  {notification.description && (
                    <p className="text-xs text-zinc-400 mt-0.5">{notification.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Total Projects</p>
                <p className="text-2xl font-bold text-white mt-1">{projects.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                <FolderGit2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Published</p>
                <p className="text-2xl font-bold text-white mt-1">{publishedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Featured on Home</p>
                <p className="text-2xl font-bold text-white mt-1">{featuredCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search title, tech stack, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-mono text-zinc-500 shrink-0">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${selectedCategory === cat
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Table */}
          {loading ? (
            <LoadingSpinner text="Retrieving portfolio projects database..." />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/10 space-y-3">
              <FolderGit2 className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No projects found</h3>
              <p className="text-xs text-zinc-400">Click "Add Project" above to create your first portfolio entry.</p>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-zinc-400 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-4 px-4">Project & Showcase Cover</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Tech Stack</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-center">Featured</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProjects.map((project) => {
                      // Primary cover image is strictly images[0] or thumbnail_url
                      const imageList = Array.isArray(project.images) ? project.images : []
                      const coverImage = (imageList.length > 0 ? imageList[0] : null) || project.thumbnail_url || FALLBACK_IMAGE
                      const imageCount = imageList.length

                      return (
                        <tr key={project.id} className="hover:bg-white/[0.03] transition-colors">
                          {/* Title, Thumbnail Cover & Photo Counter */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0 group">
                                <img
                                  src={coverImage}
                                  alt={project.title}
                                  className="w-full h-full object-cover object-center"
                                  onError={(e) => {
                                    e.target.src = FALLBACK_IMAGE
                                  }}
                                />
                                {imageCount > 1 && (
                                  <div className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[9px] font-mono text-zinc-300 rounded-tl">
                                    {imageCount}📷
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white text-sm truncate max-w-xs">{project.title}</p>
                                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                                  <span>/{project.slug}</span>
                                  {imageCount > 0 && (
                                    <span className="text-[10px] text-zinc-400 font-sans">
                                      • {imageCount} photo{imageCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4 text-zinc-300 font-medium">
                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-xs">
                              {project.category || 'Fullstack'}
                            </span>
                          </td>

                          {/* Tech Stack */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {project.tech_stack?.slice(0, 3).map((t, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/10 text-[10px] font-mono">
                                  {t}
                                </span>
                              ))}
                              {project.tech_stack?.length > 3 && (
                                <span className="text-[10px] text-zinc-500 font-mono self-center">
                                  +{project.tech_stack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Published Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublished(project)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${project.is_published
                                  ? 'bg-white/[0.08] text-white border border-white/20'
                                  : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                                }`}
                              title="Toggle Visibility on Public Portfolio"
                            >
                              {project.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{project.is_published ? 'Published' : 'Hidden'}</span>
                            </button>
                          </td>

                          {/* Featured Star Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeatured(project)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${project.is_featured
                                  ? 'text-white hover:bg-white/10'
                                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04]'
                                }`}
                              title="Toggle Featured Project"
                            >
                              <Star className={`w-4 h-4 ${project.is_featured ? 'fill-white' : ''}`} />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View public project page */}
                              <Link
                                to={`/projects/${project.id || project.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                title="View Live Showcase Page"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>

                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                  title="View GitHub Repository"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {project.demo_url && (
                                <a
                                  href={project.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                  title="Open Live Deployment"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                onClick={() => handleOpenEditModal(project)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                                title="Edit Project & Images"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteProject(project.id, project.title)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Form Modal with Multi-Image Uploader */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
        isSaving={isSaving}
      />
    </div>
  )
}

export default AdminProjects
