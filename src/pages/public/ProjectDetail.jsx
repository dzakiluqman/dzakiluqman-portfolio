import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockProjects } from '../../lib/mockData'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'

/**
 * Parses inline text, converting **bold text** into strong elements
 */
const renderInlineText = (text) => {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+?\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="text-zinc-100 font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

/**
 * FormattedDescription
 * Parses markdown-like strings:
 * - Splits double line breaks (\n\n) into separate paragraphs
 * - Renders **Bold Sub-titles** as distinct block elements with:
 *   `text-zinc-100 font-semibold text-base mt-6 mb-2 block`
 * - Renders regular body paragraphs with:
 *   `text-zinc-400 text-sm leading-relaxed mb-4`
 * - Supports bullet lists (- or * or •)
 */
export const FormattedDescription = ({ text, className = '' }) => {
  if (!text || typeof text !== 'string') return null

  // Split raw text into major blocks by double line breaks (\n\n)
  const rawBlocks = text.split(/\r?\n\s*\r?\n/)
  const parsedItems = []

  rawBlocks.forEach((rawBlock) => {
    const trimmed = rawBlock.trim()
    if (!trimmed) return

    const lines = trimmed.split(/\r?\n/)
    let currentParagraphLines = []
    let currentListLines = []

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        parsedItems.push({
          type: 'paragraph',
          lines: [...currentParagraphLines]
        })
        currentParagraphLines = []
      }
    }

    const flushList = () => {
      if (currentListLines.length > 0) {
        parsedItems.push({
          type: 'list',
          items: [...currentListLines]
        })
        currentListLines = []
      }
    }

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // Standalone subtitle on a line: **Heading** or **Heading:** or ## / ### Heading
      const isStandaloneSubtitle =
        (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length >= 4 && !trimmedLine.slice(2, -2).includes('**')) ||
        trimmedLine.startsWith('### ') ||
        trimmedLine.startsWith('## ')

      // Bullet list item
      const isListItem =
        trimmedLine.startsWith('- ') ||
        trimmedLine.startsWith('* ') ||
        trimmedLine.startsWith('• ')

      if (isStandaloneSubtitle) {
        flushParagraph()
        flushList()
        const headingText = trimmedLine.startsWith('#')
          ? trimmedLine.replace(/^#{1,3}\s+/, '')
          : trimmedLine.slice(2, -2)
        parsedItems.push({
          type: 'subtitle',
          text: headingText
        })
      } else if (isListItem) {
        flushParagraph()
        currentListLines.push(trimmedLine.replace(/^[-*•]\s*/, ''))
      } else {
        flushList()
        currentParagraphLines.push(trimmedLine)
      }
    })

    flushParagraph()
    flushList()
  })

  return (
    <div className={`project-editorial-content ${className}`}>
      {parsedItems.map((item, idx) => {
        if (item.type === 'subtitle') {
          return (
            <h3
              key={`sub-${idx}`}
              className="text-zinc-100 font-semibold text-base mt-6 mb-2 block first:mt-0 tracking-tight"
            >
              {renderInlineText(item.text)}
            </h3>
          )
        }

        if (item.type === 'list') {
          return (
            <ul
              key={`list-${idx}`}
              className="space-y-1.5 mb-4 pl-5 list-disc text-zinc-400 text-sm leading-relaxed"
            >
              {item.items.map((li, lIdx) => (
                <li key={lIdx}>{renderInlineText(li)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p
            key={`p-${idx}`}
            className="text-zinc-400 text-sm leading-relaxed mb-4"
          >
            {item.lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineText(line)}
                {lIdx < item.lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export const ProjectDetail = () => {
  const { id, slug } = useParams()
  const projectId = id || slug

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carousel engine state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // 1. Fetch project record and its images array from Supabase Storage / DB
  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      try {
        if (!isSupabaseConfigured) {
          const found = mockProjects.find((p) => p.id === projectId || p.slug === projectId)
          setProject(found || mockProjects[0])
          setLoading(false)
          return
        }

        // Live Supabase query matching ID or URL slug
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`id.eq.${projectId},slug.eq.${projectId}`)
          .single()

        if (error || !data) {
          const fallback = mockProjects.find((p) => p.id === projectId || p.slug === projectId)
          setProject(fallback || null)
        } else {
          setProject(data)
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        const fallback = mockProjects.find((p) => p.id === projectId || p.slug === projectId)
        setProject(fallback || null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [projectId])

  // Normalize multi-image array from Supabase Storage / Project record
  const images = useMemo(() => {
    if (!project) return []
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images.filter(Boolean)
    }
    if (typeof project.images === 'string') {
      try {
        const parsed = JSON.parse(project.images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean)
      } catch {
        if (project.images.startsWith('http')) return [project.images]
      }
    }
    if (project.thumbnail_url) return [project.thumbnail_url]
    return [FALLBACK_IMAGE]
  }, [project])

  // Reset carousel index when project loads
  useEffect(() => {
    setCurrentIndex(0)
    setDirection(0)
    setIsPaused(false)
  }, [project])

  // Manual carousel controls
  const handlePrev = useCallback((e) => {
    e?.stopPropagation()
    if (images.length <= 1) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleNext = useCallback((e) => {
    e?.stopPropagation()
    if (images.length <= 1) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handleDotClick = (e, index) => {
    e?.stopPropagation()
    if (index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // 2. Auto-sliding carousel engine: 4-second interval, paused on hover/touch
  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isPaused, images.length])

  // Slide animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading project details..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-3xl font-light text-white tracking-tight">Project Not Found</h2>
          <p className="text-zinc-400 text-sm max-w-md">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/#projects"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all text-sm font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    title,
    category,
    description,
    content,
    tech_stack = [],
    github_url,
    demo_url,
    is_featured,
    is_published
  } = project

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        {/* Subtle Top Navigation Bar */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Projects</span>
            </Link>

            {category && (
              <span className="text-xs font-sans tracking-[0.2em] uppercase text-zinc-400 font-medium">
                {category}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* Top Carousel Viewport (aspect-video / aspect-[16/9]) */}
          <section
            className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[21/10] rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            aria-label="Project images showcase carousel"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${title} view ${currentIndex + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Ambient Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-black/30 pointer-events-none" />

            {/* Slide Index Badge */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300 font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Left / Right Chevron Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Minimal Dot Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleDotClick(e, idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all rounded-full focus:outline-none ${
                      currentIndex === idx
                        ? 'w-6 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Project Header Info & Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-white/[0.08]">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                  {category || 'Engineering'}
                </span>
                {is_featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-medium uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-zinc-100 tracking-tight leading-tight">
                {title}
              </h1>

              {description && (
                <div className="pt-2">
                  <FormattedDescription text={description} />
                </div>
              )}
            </div>

            {/* Primary Action Links */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2">
              {demo_url && (
                <a
                  href={demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Deployment</span>
                </a>
              )}

              {github_url && (
                <a
                  href={github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-white border border-white/[0.08] font-medium text-sm transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Editorial Details & Architecture Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Overview & Deep Architecture */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-medium text-white tracking-tight">
                Architecture & Implementation
              </h2>

              <div className="space-y-4">
                <FormattedDescription text={content || description} />
                {!content && (
                  <p className="text-zinc-400 text-sm leading-relaxed mt-4">
                    Engineered with an emphasis on production resilience, performance optimization, and modular component boundaries. Data contracts and asynchronous pipelines are strictly audited.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Metadata */}
            <div className="space-y-6">
              {/* Tech Stack */}
              {tech_stack && tech_stack.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs bg-white/[0.03] border border-white/[0.08] rounded-md text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Card */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Category</span>
                  <span className="text-white font-medium">{category || 'Fullstack'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{is_published ? 'Production' : 'Development'}</span>
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Gallery</span>
                  <span className="text-white font-medium">{images.length} Media Assets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectDetail
