import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Github, ExternalLink, ArrowUpRight, Layers } from 'lucide-react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'

export const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Normalize project images into a verified array of URLs
  const images = React.useMemo(() => {
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

  // Reset slide index when opening or changing project
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      setDirection(0)
      setIsPaused(false)
    }
  }, [isOpen, project])

  // 1. Lock document.body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // 2. Keyboard accessibility (Escape to close, Left/Right arrow keys for navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length])

  // Carousel manual controls
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

  // 3. Auto-sliding carousel engine (4-second interval, paused on hover/touch)
  useEffect(() => {
    if (!isOpen || isPaused || images.length <= 1) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isOpen, isPaused, images.length])

  if (!isOpen || !project) return null

  const {
    title,
    category,
    description,
    content,
    tech_stack = [],
    github_url,
    demo_url,
    slug,
    id
  } = project

  const projectUrl = `/project/${slug || id}`

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0
    })
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#090d1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors focus:outline-none"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Interactive Multi-Image Carousel Viewport */}
          <div
            className="relative w-full aspect-video sm:aspect-[16/9] md:aspect-[21/10] bg-slate-950 overflow-hidden select-none shrink-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${title} preview ${currentIndex + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Subtle Vignette Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-transparent to-black/30 pointer-events-none" />

            {/* Slide Index Counter Badge */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300 font-sans font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Left & Right Chevron Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Pagination Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleDotClick(e, idx)}
                    aria-label={`Go to image ${idx + 1}`}
                    className={`transition-all rounded-full focus:outline-none ${
                      currentIndex === idx
                        ? 'w-6 h-1.5 bg-cyan-400'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Modal Content Details (Scrollable Body) */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-cyan-400 font-medium">
                <Layers className="w-3.5 h-3.5" />
                <span>{category || 'Software Engineering'}</span>
              </div>
              <h2
                id="modal-project-title"
                className="text-2xl sm:text-3xl font-light text-slate-100 tracking-tight font-sans"
              >
                {title}
              </h2>
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {description}
              </p>
            )}

            {/* Extended Content / Architecture details */}
            {content && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium font-sans">
                  Overview & Architecture
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans whitespace-pre-line">
                  {content}
                </p>
              </div>
            )}

            {/* Tech Stack Tags */}
            {tech_stack && tech_stack.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium font-sans">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-md text-slate-200 font-sans"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Links Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {demo_url && (
                  <a
                    href={demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
                {github_url && (
                  <a
                    href={github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Code</span>
                  </a>
                )}
              </div>

              <a
                href={projectUrl}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-sans"
              >
                <span>Full Case Study Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProjectDetailModal
