import React, { useState, useEffect, useMemo } from 'react'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Code, 
  FileCode, 
  Sparkles, 
  Palette, 
  Server, 
  Database, 
  Cpu, 
  Boxes, 
  Cloud, 
  GitBranch, 
  Terminal, 
  Layers, 
  Globe, 
  Workflow, 
  Shield, 
  Layout, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  Loader2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  ExternalLink
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockSkills } from '../../lib/mockData'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code },
  { name: 'FileCode', icon: FileCode },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Palette', icon: Palette },
  { name: 'Server', icon: Server },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Boxes', icon: Boxes },
  { name: 'Cloud', icon: Cloud },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Terminal', icon: Terminal },
  { name: 'Layers', icon: Layers },
  { name: 'Globe', icon: Globe },
  { name: 'Workflow', icon: Workflow },
  { name: 'Shield', icon: Shield },
  { name: 'Layout', icon: Layout },
  { name: 'HardDrive', icon: HardDrive }
]

const ICON_COMPONENTS = AVAILABLE_ICONS.reduce((acc, curr) => {
  acc[curr.name] = curr.icon
  return acc
}, {})

const CATEGORY_CONFIG = {
  frontend: {
    label: 'Frontend & Interface',
    badgeClass: 'bg-white/[0.06] text-zinc-200 border-white/10'
  },
  backend: {
    label: 'Backend & Architecture',
    badgeClass: 'bg-white/[0.06] text-zinc-200 border-white/10'
  },
  devops: {
    label: 'Infrastructure & DevOps',
    badgeClass: 'bg-white/[0.06] text-zinc-200 border-white/10'
  }
}

export const AdminSkills = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'frontend',
    icon_name: 'Code',
    order_index: 1
  })

  // Toast Notification
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Load skills
  const loadSkills = async () => {
    setLoading(true)

    const getStoredDemo = () => {
      const stored = localStorage.getItem('dzaki_demo_skills')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        } catch (e) {
          console.error(e)
        }
      }
      return mockSkills
    }

    if (!isSupabaseConfigured) {
      setSkills(getStoredDemo())
      setLoading(false)
      return
    }

    try {
      let res = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true })

      if (res.error && (res.error.code === '42703' || res.error.message?.includes('order_index'))) {
        res = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })
      }

      if (res.error) throw res.error

      if (res.data && res.data.length > 0) {
        const normalized = res.data.map((item, idx) => ({
          ...item,
          id: item.id || `skill-${idx}`,
          title: item.title || item.name || 'Untitled Skill',
          subtitle: item.subtitle || item.level || item.focus || '',
          category: (item.category || 'frontend').toLowerCase(),
          icon_name: item.icon_name || 'Code',
          order_index: item.order_index ?? item.sort_order ?? idx + 1
        }))
        setSkills(normalized)
      } else {
        const fallback = getStoredDemo()
        setSkills(fallback)
      }
    } catch (err) {
      console.warn('Error fetching skills:', err)
      setSkills(getStoredDemo())
      showNotification('Note: Loaded local data (Supabase: ' + err.message + ')', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingSkill(null)
    setFormData({
      title: '',
      subtitle: '',
      category: 'frontend',
      icon_name: 'Code',
      order_index: skills.length + 1
    })
    setIsModalOpen(true)
  }

  // Open modal for Edit
  const handleOpenEditModal = (skill) => {
    setEditingSkill(skill)
    setFormData({
      title: skill.title || skill.name || '',
      subtitle: skill.subtitle || '',
      category: (skill.category || 'frontend').toLowerCase(),
      icon_name: skill.icon_name || 'Code',
      order_index: skill.order_index ?? 1
    })
    setIsModalOpen(true)
  }

  // Save / Update Skill
  const handleSaveSkill = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showNotification('Title is required', 'error')
      return
    }

    setIsSaving(true)

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category.toLowerCase(),
      icon_name: formData.icon_name,
      order_index: parseInt(formData.order_index, 10) || 1,
      // Backwards-compatibility fields for legacy database columns
      name: formData.title.trim(),
      sort_order: parseInt(formData.order_index, 10) || 1,
      level: 'Expert'
    }

    try {
      if (!isSupabaseConfigured) {
        let updated
        if (editingSkill) {
          updated = skills.map((s) => (s.id === editingSkill.id ? { ...s, ...payload } : s))
        } else {
          updated = [...skills, { ...payload, id: `skill-${Date.now()}` }]
        }
        updated.sort((a, b) => a.order_index - b.order_index)
        setSkills(updated)
        localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
        setIsModalOpen(false)
        showNotification(editingSkill ? 'Skill updated successfully' : 'Skill created successfully')
        return
      }

      // Supabase live execution
      if (editingSkill) {
        // Attempt update with primary fields
        let { error } = await supabase
          .from('skills')
          .update({
            title: payload.title,
            subtitle: payload.subtitle,
            category: payload.category,
            icon_name: payload.icon_name,
            order_index: payload.order_index
          })
          .eq('id', editingSkill.id)

        // If title column does not exist on older DB, fallback to legacy fields
        if (error && (error.code === '42703' || error.message?.includes('title'))) {
          const legacyRes = await supabase
            .from('skills')
            .update({
              name: payload.name,
              category: payload.category,
              icon_name: payload.icon_name,
              sort_order: payload.sort_order
            })
            .eq('id', editingSkill.id)
          error = legacyRes.error
        }

        if (error) throw error
        showNotification('Skill updated successfully')
      } else {
        // Insert new skill
        let { error } = await supabase
          .from('skills')
          .insert([{
            title: payload.title,
            subtitle: payload.subtitle,
            category: payload.category,
            icon_name: payload.icon_name,
            order_index: payload.order_index
          }])

        // If title column does not exist on older DB, fallback to legacy fields
        if (error && (error.code === '42703' || error.message?.includes('title'))) {
          const legacyRes = await supabase
            .from('skills')
            .insert([{
              name: payload.name,
              category: payload.category,
              icon_name: payload.icon_name,
              sort_order: payload.sort_order
            }])
          error = legacyRes.error
        }

        if (error) throw error
        showNotification('Skill created successfully')
      }

      // Also update local demo cache and broadcast event
      window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
      setIsModalOpen(false)
      await loadSkills()
    } catch (err) {
      console.error('Error saving skill:', err)
      // Save locally if auth error or RLS constraint
      let updated
      if (editingSkill) {
        updated = skills.map((s) => (s.id === editingSkill.id ? { ...s, ...payload } : s))
      } else {
        updated = [...skills, { ...payload, id: `skill-${Date.now()}` }]
      }
      setSkills(updated)
      localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
      setIsModalOpen(false)
      showNotification('Saved locally (Supabase: ' + err.message + ')', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete Skill
  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technical competency?')) return

    try {
      if (!isSupabaseConfigured) {
        const updated = skills.filter((s) => s.id !== id)
        setSkills(updated)
        localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
        showNotification('Skill removed')
        return
      }

      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error

      setSkills(skills.filter((s) => s.id !== id))
      window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
      showNotification('Skill deleted successfully')
    } catch (err) {
      console.error('Error deleting skill:', err)
      const updated = skills.filter((s) => s.id !== id)
      setSkills(updated)
      localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
      showNotification('Removed locally (Supabase: ' + err.message + ')', 'error')
    }
  }

  // Quick Reorder (Move Up / Down)
  const handleReorder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= filteredSkills.length) return

    const currentItem = filteredSkills[index]
    const targetItem = filteredSkills[targetIndex]

    const newCurrentOrder = targetItem.order_index
    const newTargetOrder = currentItem.order_index

    const updated = skills.map((s) => {
      if (s.id === currentItem.id) return { ...s, order_index: newCurrentOrder }
      if (s.id === targetItem.id) return { ...s, order_index: newTargetOrder }
      return s
    }).sort((a, b) => a.order_index - b.order_index)

    setSkills(updated)
    localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))

    if (isSupabaseConfigured) {
      try {
        await Promise.all([
          supabase.from('skills').update({ order_index: newCurrentOrder }).eq('id', currentItem.id),
          supabase.from('skills').update({ order_index: newTargetOrder }).eq('id', targetItem.id)
        ])
      } catch (e) {
        console.warn('Reorder sync error:', e)
      }
    }
  }

  // Reset to Default Seed Data
  const handleResetToDefault = () => {
    if (!window.confirm('Reset competencies to the default portfolio stack?')) return
    setSkills(mockSkills)
    localStorage.setItem('dzaki_demo_skills', JSON.stringify(mockSkills))
    window.dispatchEvent(new CustomEvent('dzaki:skills_updated'))
    showNotification('Skills reset to default portfolio stack')
  }

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const title = (s.title || s.name || '').toLowerCase()
      const subtitle = (s.subtitle || '').toLowerCase()
      const cat = (s.category || '').toLowerCase()
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || subtitle.includes(searchTerm.toLowerCase())

      if (selectedCategory === 'all') return matchesSearch
      return matchesSearch && cat.includes(selectedCategory)
    })
  }, [skills, searchTerm, selectedCategory])

  // Stats
  const stats = useMemo(() => {
    return {
      total: skills.length,
      frontend: skills.filter((s) => /front|client|ui/i.test(s.category)).length,
      backend: skills.filter((s) => /back|server|api/i.test(s.category)).length,
      devops: skills.filter((s) => /devops|infra|cloud/i.test(s.category)).length
    }
  }, [skills])

  // Live icon preview for modal
  const PreviewIcon = ICON_COMPONENTS[formData.icon_name] || Code

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Technical Competencies CMS"
          subtitle="Manage production technologies, domain categorization, and order indices"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetToDefault}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                title="Reset to default skills"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white hover:bg-zinc-200 text-black shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Skill</span>
              </button>
            </div>
          }
        />

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-mono font-semibold ${
                notification.type === 'error'
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-200'
              }`}
            >
              {notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Domain Breakdown Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Total Items</div>
              <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Frontend</div>
              <div className="text-2xl font-bold text-white mt-1">{stats.frontend}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Backend</div>
              <div className="text-2xl font-bold text-white mt-1">{stats.backend}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">DevOps & Cloud</div>
              <div className="text-2xl font-bold text-white mt-1">{stats.devops}</div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search skills, subtitles, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#000000] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'front', label: 'Frontend' },
                { id: 'back', label: 'Backend' },
                { id: 'devops', label: 'DevOps' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 ${
                    selectedCategory === tab.id
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Competencies List */}
          {loading ? (
            <LoadingSpinner text="Retrieving technical competencies..." />
          ) : filteredSkills.length === 0 ? (
            <div className="hud-glass rounded-2xl border border-slate-800 p-12 text-center space-y-3">
              <Code className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm font-sans">No technical skills found matching your filter.</p>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white text-black hover:bg-zinc-200 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add first skill</span>
              </button>
            </div>
          ) : (
            <div className="hud-glass rounded-2xl border border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-800/80">
                {filteredSkills.map((skill, index) => {
                  const IconComp = ICON_COMPONENTS[skill.icon_name] || Code
                  const catConfig = CATEGORY_CONFIG[skill.category] || {
                    label: skill.category.toUpperCase(),
                    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
                  }

                  return (
                    <div
                      key={skill.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Left: Icon & Title/Subtitle */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-300 shrink-0">
                          <IconComp className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-100 text-sm font-sans">
                              {skill.title || skill.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${catConfig.badgeClass}`}
                            >
                              {catConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-sans truncate mt-0.5">
                            {skill.subtitle || 'General technical competency'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Order Index & Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Order Index Pill */}
                        <span className="hidden sm:inline-block px-2 py-1 rounded-lg bg-dark-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                          #{skill.order_index ?? index + 1}
                        </span>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleReorder(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder(index, 'down')}
                            disabled={index === filteredSkills.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(skill)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Skill"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {editingSkill ? 'Edit Technical Competency' : 'Add New Competency'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Configure stack item titles, subtitles, and domain assignments
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSkill} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Skill Title <span className="text-zinc-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React / Next.js, Docker & Kubernetes"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm font-sans text-white placeholder-slate-500 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle / Focus Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UI Architecture & SSR, Microservices & Data"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm font-sans text-white placeholder-slate-500 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {/* Category & Order Index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Domain Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm font-sans text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="frontend">Frontend & Interface</option>
                    <option value="backend">Backend & Architecture</option>
                    <option value="devops">Infrastructure & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Select Lucide Icon
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-dark-950 border border-slate-800 rounded-xl max-h-36 overflow-y-auto">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon
                    const isSelected = formData.icon_name === item.name
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormData({ ...formData, icon_name: item.name })}
                        className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-white border border-white text-black shadow-sm'
                            : 'bg-dark-900 border border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={item.name}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Live Public Preview
                </label>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                      <PreviewIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-medium text-slate-100 tracking-tight font-sans truncate">
                        {formData.title || 'Untitled Skill'}
                      </div>
                      <div className="text-xs text-slate-400 font-sans tracking-tight truncate mt-0.5">
                        {formData.subtitle || 'Focus area description'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white hover:bg-zinc-200 text-black shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" />
                      <span>{editingSkill ? 'Update Competency' : 'Create Competency'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSkills
