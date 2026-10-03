import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Sparkles, Loader2, Image, Github, ExternalLink } from 'lucide-react'

export const ProjectFormModal = ({ isOpen, onClose, onSave, project = null, isSaving = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Fullstack Web App',
    description: '',
    content: '',
    tech_stack: 'React, TypeScript, Tailwind CSS',
    github_url: '',
    demo_url: '',
    thumbnail_url: '',
    is_featured: false,
    is_published: true,
    sort_order: 1
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        category: project.category || 'Fullstack Web App',
        description: project.description || '',
        content: project.content || '',
        tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || ''),
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        thumbnail_url: project.thumbnail_url || '',
        is_featured: Boolean(project.is_featured),
        is_published: project.is_published !== undefined ? Boolean(project.is_published) : true,
        sort_order: project.sort_order ?? 1
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'Fullstack Web App',
        description: '',
        content: '',
        tech_stack: 'React, TypeScript, Tailwind CSS',
        github_url: '',
        demo_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        is_featured: false,
        is_published: true,
        sort_order: 1
      })
    }
  }, [project, isOpen])

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value }
        if (name === 'title' && (!project || !prev.slug)) {
          updated.slug = generateSlug(value)
        }
        return updated
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Parse tech_stack string into array of trimmed strings
    const techArray = formData.tech_stack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      ...formData,
      tech_stack: techArray,
      sort_order: parseInt(formData.sort_order, 10) || 0
    }

    onSave(payload)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {project ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400">
                {project ? 'Update project metadata and links' : 'Add a portfolio project with GitHub and demo links'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Project Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. CloudScale Telemetry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="cloudscale-telemetry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fullstack Web App">Fullstack Web App</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Fintech & Web3">Fintech & Web3</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="Open Source Tool">Open Source Tool</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Short Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="High-level summary displayed on portfolio cards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Full Content / Architecture Details
              </label>
              <textarea
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                placeholder="In-depth explanation of system design, architecture, metrics, and outcomes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React, TypeScript, Supabase, Tailwind CSS, Docker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Demo URL</span>
                </label>
                <input
                  type="url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleChange}
                  placeholder="https://myproject.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-cyan-400" />
                <span>Thumbnail Image URL</span>
              </label>
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Published (Visible on Portfolio)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Featured Star
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{project ? 'Update Project' : 'Create Project'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProjectFormModal
