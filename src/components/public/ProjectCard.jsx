import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'

export const ProjectCard = ({ project, index = 0, onSelect }) => {
  const {
    title,
    description,
    category,
    tech_stack = [],
    github_url,
    demo_url,
    images = [],
    thumbnail_url,
  } = project

  // Strictly render the FIRST image in the array as the card thumbnail (prevent loading secondary images in grid)
  const thumbnailUrl = (images && images.length > 0 ? images[0] : null) || thumbnail_url || FALLBACK_IMAGE

  const handleCardClick = () => {
    onSelect?.(project)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(project)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between h-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
    >
      {/* Top Media & Content Information */}
      <div>
        {/* Proportional Widescreen Image Container (Strictly renders images[0]) */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900/60 border border-white/5 mb-5">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Multi-image indicator badge if project has more than 1 image */}
          {images && images.length > 1 && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-slate-300 font-sans pointer-events-none">
              {images.length} photos
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="space-y-2.5">
          <div className="text-xs font-sans uppercase tracking-wider text-slate-400 font-medium">
            {category || 'Project'}
          </div>

          <h3 className="text-xl font-light text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight font-sans">
            <span className="inline-flex items-center gap-1.5">
              <span className="line-clamp-1">{title}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200 shrink-0" />
            </span>
          </h3>

          {description && (
            <p className="text-sm text-slate-400 leading-relaxed font-sans line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Tech Stack & Links */}
      <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
        {/* Minimalist Tech Tags */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {tech_stack && tech_stack.length > 0 && tech_stack.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded-md text-slate-300 font-sans"
            >
              {tech}
            </span>
          ))}
          {tech_stack && tech_stack.length > 3 && (
            <span className="text-xs text-slate-500 font-sans px-1">
              +{tech_stack.length - 3}
            </span>
          )}
        </div>

        {/* Minimalist Source & Demo Links (Event propagation stopped) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-sans text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 p-1"
              title="View Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Code</span>
            </a>
          )}
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-sans text-slate-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 p-1"
              title="Live Deployment"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
