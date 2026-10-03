import React, { useState, useEffect } from 'react'
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
  FolderGit2
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockProjects } from '../../lib/mockData'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ProjectFormModal from '../../components/admin/ProjectFormModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const fetchProjects = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('dzaki_demo_projects')
      if (stored) {
        setProjects(JSON.parse(stored))
      } else {
        setProjects(mockProjects)
        localStorage.setItem('dzaki_demo_projects', JSON.stringify(mockProjects))
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
      showNotification('Failed to load projects from Supabase: ' + err.message, 'error')
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

  const handleSaveProject = async (formData) => {
    setIsSaving(true)

    try {
      if (!isSupabaseConfigured) {
        // Save locally for demo preview
        let updatedList
        if (editingProject) {
          updatedList = projects.map((p) =>
            p.id === editingProject.id ? { ...p, ...formData, updated_at: new Date().toISOString() } : p
          )
        } else {
          const newProject = {
            ...formData,
            id: `demo-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          updatedList = [newProject, ...projects]
        }
        setProjects(updatedList)
        localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
        setIsModalOpen(false)
        showNotification(editingProject ? 'Project updated (Demo Mode)' : 'Project created (Demo Mode)')
        return
      }

      // Live Supabase Mutation
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id)

        if (error) throw error
        showNotification('Project updated successfully!')
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData])

        if (error) throw error
        showNotification('Project created successfully!')
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

  const handleTogglePublished = async (project) => {
    const updatedValue = !project.is_published

    if (!isSupabaseConfigured) {
      const updatedList = projects.map((p) =>
        p.id === project.id ? { ...p, is_published: updatedValue } : p
      )
      setProjects(updatedList)
      localStorage.setItem('dzaki_demo_projects', JSON.stringify(updatedList))
      showNotification(`Project ${updatedValue ? 'published' : 'unpublished'}`)
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_published: updatedValue })
        .eq('id', project.id)

      if (error) throw error
      setProjects(projects.map((p) => (p.id === project.id ? { ...p, is_published: updatedValue } : p)))
      showNotification(`Project status updated: ${updatedValue ? 'Published' : 'Hidden'}`)
    } catch (err) {
      showNotification('Failed to update status: ' + err.message, 'error')
    }
  }

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
      showNotification(`Featured status toggled`)
    } catch (err) {
      showNotification('Failed to update featured flag: ' + err.message, 'error')
    }
  }

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
      (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Project Management"
          subtitle="Manage published showcase, tech stacks, repository and demo URLs"
          action={
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          }
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Notification Alert */}
          {notification && (
            <div
              className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-medium ${
                notification.type === 'error'
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{notification.message}</span>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects or stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-mono text-slate-500 shrink-0">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Table / Card List */}
          {loading ? (
            <LoadingSpinner text="Retrieving project database..." />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-dark-900 rounded-2xl border border-slate-800 space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No projects found</h3>
              <p className="text-xs text-slate-400">Click "Add Project" above to create your first portfolio entry.</p>
            </div>
          ) : (
            <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dark-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Tech Stack</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={project.thumbnail_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80'}
                              alt={project.title}
                              className="w-12 h-9 rounded-lg object-cover bg-dark-950 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate max-w-xs">{project.title}</p>
                              <p className="text-[11px] font-mono text-slate-500">/{project.slug}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 text-slate-300 font-medium">
                          {project.category || 'General'}
                        </td>

                        {/* Tech Stack */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.tech_stack?.slice(0, 3).map((t, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-dark-950 text-slate-400 border border-slate-800 text-[10px] font-mono">
                                {t}
                              </span>
                            ))}
                            {project.tech_stack?.length > 3 && (
                              <span className="text-[10px] text-slate-500 font-mono">+{project.tech_stack.length - 3}</span>
                            )}
                          </div>
                        </td>

                        {/* Published Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublished(project)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                              project.is_published
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                            title="Toggle Visibility"
                          >
                            {project.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{project.is_published ? 'Published' : 'Hidden'}</span>
                          </button>
                        </td>

                        {/* Featured Star Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(project)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              project.is_featured
                                ? 'text-amber-400 hover:bg-amber-500/10'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                            title="Toggle Featured Project"
                          >
                            <Star className={`w-4 h-4 ${project.is_featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                title="Open GitHub"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                title="Open Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleOpenEditModal(project)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                              title="Edit Project"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id, project.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Form Modal */}
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
