import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'

export const ProjectCard = ({ project, index = 0 }) => {
  const {
    id,
    slug,
    title,
    description,
    category,
    tech_stack = [],
    github_url,
    demo_url,
    images = [],
    thumbnail_url,
  } = project

  const projectHref = `/projects/${id || slug}`

  // Normalize images array
  const imageList = Array.isArray(images)
    ? images
    : (typeof images === 'string' && images.startsWith('[') ? (() => { try { return JSON.parse(images) } catch { return [] } })() : (typeof images === 'string' && images.startsWith('http') ? [images] : []))

  // Render strictly the first image from the Supabase array as the thumbnail
  const thumbnailUrl = (imageList && imageList.length > 0 ? imageList[0] : null) || thumbnail_url || FALLBACK_IMAGE

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between h-full"
    >
      {/* Primary Clickable Link Area covering the card for direct page navigation */}
      <Link
        to={projectHref}
        className="block focus:outline-none flex-1"
        aria-label={`View dedicated page for ${title}`}
      >
        {/* Proportional Widescreen Image Container (Strictly renders images[0]) */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950/80 border border-white/[0.06] mb-5">
          <img
            src={thumbnailUrl}
            alt={title}
            width="640"
            height="360"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Multi-image indicator badge if project has more than 1 image */}
          {imageList && imageList.length > 1 && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] text-zinc-300 font-sans pointer-events-none">
              {imageList.length} photos
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="space-y-2.5">
          <div className="text-xs font-sans uppercase tracking-wider text-zinc-500 font-medium">
            {category || 'Project'}
          </div>

          <h3 className="text-xl font-light text-zinc-100 group-hover:text-white transition-colors duration-200 tracking-tight font-sans">
            <span className="inline-flex items-center gap-1.5">
              <span className="line-clamp-1">{title}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors duration-200 shrink-0" />
            </span>
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 leading-relaxed font-sans line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>

      {/* Card Footer: Tech Stack & Direct External Links */}
      <div className="pt-5 mt-5 border-t border-white/[0.08] flex items-center justify-between gap-3 relative z-10">
        {/* Minimalist Tech Tags */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {tech_stack && tech_stack.length > 0 && tech_stack.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 text-xs bg-white/[0.03] border border-white/[0.08] rounded-md text-zinc-300 font-sans"
            >
              {tech}
            </span>
          ))}
          {tech_stack && tech_stack.length > 3 && (
            <span className="text-xs text-zinc-500 font-sans px-1">
              +{tech_stack.length - 3}
            </span>
          )}
        </div>

        {/* Minimalist External Links */}
        <div className="flex items-center gap-2.5 shrink-0">
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-1 p-1"
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
              className="text-xs font-sans text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-1 p-1"
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
