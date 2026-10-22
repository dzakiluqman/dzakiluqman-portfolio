import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Save,
  Sparkles,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Github,
  ExternalLink,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check,
  AlertCircle,
  FileCode2,
  FolderKanban
} from 'lucide-react'
import { uploadMultipleProjectImages, isSupabaseConfigured } from '../../lib/supabase'

const COMMON_CATEGORIES = [
  'Fullstack / Web',
  'Frontend / UI/UX',
  'Backend & APIs',
  'DevOps & Cloud',
  'Mobile Application',
  'Artificial Intelligence',
  'Fintech & Web3',
  'Open Source Tool'
]

export const ProjectFormModal = ({ isOpen, onClose, onSave, project = null, isSaving = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Fullstack / Web',
    description: '',
    content: '',
    tech_stack: 'React, TypeScript, Tailwind CSS',
    github_url: '',
    demo_url: '',
    is_featured: false,
    is_published: true,
    sort_order: 1
  })

  // Multi-image state: string[] array of Supabase Storage URLs
  const [images, setImages] = useState([])
  const [urlInput, setUrlInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 })
  const [uploadError, setUploadError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (project) {
      // Parse images array from project or fallback to thumbnail_url
      let initialImages = []
      if (Array.isArray(project.images) && project.images.length > 0) {
        initialImages = [...project.images]
      } else if (typeof project.images === 'string') {
        try {
          const parsed = JSON.parse(project.images)
          if (Array.isArray(parsed)) initialImages = parsed
        } catch {
          if (project.images.startsWith('http')) initialImages = [project.images]
        }
      } else if (project.thumbnail_url) {
        initialImages = [project.thumbnail_url]
      }

      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        category: project.category || 'Fullstack / Web',
        description: project.description || '',
        content: project.content || '',
        tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || ''),
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        is_featured: Boolean(project.is_featured),
        is_published: project.is_published !== undefined ? Boolean(project.is_published) : true,
        sort_order: project.sort_order ?? 1
      })
      setImages(initialImages)
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'Fullstack / Web',
        description: '',
        content: '',
        tech_stack: 'React, TypeScript, Tailwind CSS',
        github_url: '',
        demo_url: '',
        is_featured: false,
        is_published: true,
        sort_order: 1
      })
      setImages([])
    }

    setUrlInput('')
    setUploadError(null)
    setIsUploading(false)
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

  // --- MULTI-IMAGE UPLOAD TO SUPABASE STORAGE ---
  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
    if (validFiles.length === 0) {
      setUploadError('Please select valid image files (JPG, PNG, WebP, SVG, GIF).')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress({ completed: 0, total: validFiles.length })

    try {
      // Upload directly to public Supabase Storage bucket named 'projects'
      const uploadedUrls = await uploadMultipleProjectImages(
        validFiles,
        'projects',
        (completed, total) => {
          setUploadProgress({ completed, total })
        }
      )

      setImages((prev) => [...prev, ...uploadedUrls])
    } catch (err) {
      console.error('Storage upload failed:', err)
      setUploadError(err.message || 'Failed to upload images to Supabase Storage.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileInputChange = (e) => {
    handleUploadFiles(e.target.files)
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer?.files?.length > 0) {
      handleUploadFiles(e.dataTransfer.files)
    }
  }

  // Manual URL Add
  const handleAddUrl = (e) => {
    e.preventDefault()
    const trimmed = urlInput.trim()
    if (!trimmed) return

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUploadError('Image URL must start with http:// or https://')
      return
    }

    setImages((prev) => [...prev, trimmed])
    setUrlInput('')
    setUploadError(null)
  }

  // Image manipulation in list
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSetPrimary = (index) => {
    if (index === 0) return
    setImages((prev) => {
      const selected = prev[index]
      const remaining = prev.filter((_, idx) => idx !== index)
      return [selected, ...remaining]
    })
  }

  const handleMoveImage = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= images.length) return

    setImages((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(index, 1)
      copy.splice(targetIndex, 0, moved)
      return copy
    })
  }

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault()

    // Parse tech_stack string into array of trimmed strings
    const techArray = formData.tech_stack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    // Primary cover thumbnail is strictly images[0]
    const primaryCoverUrl = images.length > 0 ? images[0] : ''

    const payload = {
      ...formData,
      images, // array of strings (Supabase Storage URLs)
      thumbnail_url: primaryCoverUrl, // synced with images[0] for backward compatibility
      tech_stack: techArray,
      sort_order: parseInt(formData.sort_order, 10) || 0
    }

    onSave(payload)
  }

  if (!isOpen) return null

  // Preview chips for tech stack
  const previewTechs = formData.tech_stack
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-[#121218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto text-zinc-100"
        >
          {/* OLED Bento Modal Header */}
          <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{project ? 'Edit Project' : 'Create New Project'}</span>
                  {!isSupabaseConfigured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-normal">
                      Demo Mode
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400">
                  {project
                    ? 'Update project details, tech stack, and Supabase showcase images'
                    : 'Add a new portfolio project with multi-image gallery and Supabase Storage sync'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">

            {/* ROW 1: Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  Project Title <span className="text-zinc-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. TubeMod, CloudScale Telemetry"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  URL Slug <span className="text-zinc-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                    /projects/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="tubemod"
                    className="w-full pl-24 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ROW 2: Category & Sort Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  Category <span className="text-zinc-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                  >
                    {COMMON_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-950 text-white py-1">
                        {cat}
                      </option>
                    ))}
                    {!COMMON_CATEGORIES.includes(formData.category) && (
                      <option value={formData.category} className="bg-zinc-950 text-white">
                        {formData.category}
                      </option>
                    )}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  min="0"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition-all font-mono"
                />
              </div>
            </div>

            {/* ROW 3: Short Description */}
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                Overview / Description <span className="text-zinc-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="High-level project summary displayed on portfolio showcase cards..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all resize-y"
              />
            </div>

            {/* ROW 4: Tech Stack */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-300">
                  Tech Stack <span className="text-zinc-500 font-normal">(Comma-separated: e.g. PHP, MySQL, MVC or React, Supabase)</span>
                </label>
                {previewTechs.length > 0 && (
                  <span className="text-[11px] font-mono text-zinc-400">
                    {previewTechs.length} technologies
                  </span>
                )}
              </div>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="PHP, MySQL, MVC, Tailwind CSS, Docker"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all font-mono"
              />

              {/* Live Tag Preview */}
              {previewTechs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {previewTechs.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1"
                    >
                      <FileCode2 className="w-3 h-3 text-zinc-400" />
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* 🗄️ SUPABASE STORAGE & MULTI-IMAGE UPLOADER SECTION */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-white" />
                    <span>Project Showcase Images</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
                      bucket: projects
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Upload multiple screenshots or architecture diagrams. <span className="text-zinc-200">The 1st image is strictly the Primary Cover</span>.
                  </p>
                </div>

                <div className="text-xs font-mono text-zinc-400">
                  <span className="text-white font-semibold">{images.length}</span> images loaded
                </div>
              </div>

              {/* Upload Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragging
                    ? 'border-white bg-white/[0.08] scale-[0.99]'
                    : 'border-white/15 bg-white/[0.01] hover:border-white/40 hover:bg-white/[0.03]'
                  } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shadow-inner">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {isUploading ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white flex items-center justify-center gap-2">
                        <span>Uploading to Supabase Storage...</span>
                        <span>({uploadProgress.completed}/{uploadProgress.total})</span>
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">
                        Targeting public bucket: <code className="text-white">projects</code>
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-200">
                        <span className="text-white font-semibold underline underline-offset-2">Click to select images</span> or drag and drop files here
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        PNG, JPG, WebP, GIF, SVG up to 10MB each (Multi-select supported)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Direct URL Add Option */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste external image URL (e.g. Unsplash, CDN)..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddUrl(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/10 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* ========================================================================= */}
              {/* 🖼️ THUMBNAIL GRID PREVIEW & REORDERING */}
              {/* ========================================================================= */}
              {images.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Star className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300" />
                      <span>Thumbnail Gallery & Ordering</span>
                    </span>
                    <span className="text-zinc-500">First image = Card Cover</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((imgUrl, index) => {
                      const isPrimary = index === 0

                      return (
                        <div
                          key={`${imgUrl}-${index}`}
                          className={`group relative rounded-xl overflow-hidden border transition-all duration-200 ${isPrimary
                              ? 'border-white bg-white/[0.08] shadow-lg shadow-white/5 ring-1 ring-white/30'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                        >
                          {/* Image Thumbnail Container */}
                          <div className="relative aspect-video w-full bg-black/80 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`Project preview ${index + 1}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Badge: Primary Card Cover vs Gallery Index */}
                            <div className="absolute top-2 left-2 z-10">
                              {isPrimary ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-black font-bold text-[10px] tracking-wide shadow-md">
                                  <Star className="w-3 h-3 fill-black text-black" />
                                  <span>Primary Card Cover / Thumbnail</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-zinc-300 font-mono text-[10px]">
                                  #{index + 1}
                                </span>
                              )}
                            </div>

                            {/* Delete (✕) Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                              title="Remove image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Controls bar below thumbnail */}
                          <div className="p-2.5 flex items-center justify-between gap-1.5 bg-black/60 border-t border-white/5">
                            {isPrimary ? (
                              <span className="text-[11px] font-mono text-zinc-200 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Default Card Cover</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(index)}
                                className="text-[11px] font-mono font-medium text-zinc-300 hover:text-white hover:underline flex items-center gap-1 transition-colors"
                                title="Set this image as primary thumbnail cover"
                              >
                                <Star className="w-3 h-3 text-zinc-400" />
                                <span>Make Cover</span>
                              </button>
                            )}

                            {/* Move reordering arrows */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveImage(index, -1)}
                                className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                title="Move Left / Earlier"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === images.length - 1}
                                onClick={() => handleMoveImage(index, 1)}
                                className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                title="Move Right / Later"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center bg-black/40 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-500 font-mono">
                    No images uploaded yet. Select files above or paste a URL to populate the project gallery.
                  </p>
                </div>
              )}
            </div>

            {/* ROW 5: GitHub & Live Demo URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/dzakiluqman/repo"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Live / Demo URL (Optional)</span>
                </label>
                <input
                  type="url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleChange}
                  placeholder="https://myproject-demo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all font-mono"
                />
              </div>
            </div>

            {/* ROW 6: Detailed Content / Architecture */}
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                Technical Architecture & Deep-Dive Writeup
              </label>
              <textarea
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                placeholder="In-depth details, architecture diagrams, performance metrics, database design, and key engineering decisions..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all resize-y"
              />
            </div>

            {/* ROW 7: Checkbox Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white accent-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Published (Visible publicly on portfolio)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white accent-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Featured Project (Highlighted on homepage)</span>
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-zinc-500">
                {images.length > 0
                  ? `${images.length} images will be saved`
                  : 'A default placeholder cover will be used if no images are provided'}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving || isUploading}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-white" />
                      <span>{project ? 'Update Project' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProjectFormModal
