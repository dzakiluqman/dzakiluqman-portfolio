import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

export const ProjectCard = ({ project, index = 0 }) => {
  const {
    id,
    title,
    slug,
    description,
    category,
    tech_stack = [],
    github_url,
    demo_url,
    thumbnail_url,
  } = project

  const projectUrl = `/project/${slug || id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between h-full"
    >
      {/* Top Media & Content Information */}
      <div>
        {/* Proportional Widescreen Image Container */}
        <Link to={projectUrl} className="block group/media focus:outline-none mb-5">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900/60 border border-white/5">
            <img
              src={thumbnail_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'}
              alt={title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        </Link>

        {/* Card Content */}
        <div className="space-y-2.5">
          <div className="text-xs font-sans uppercase tracking-wider text-slate-400 font-medium">
            {category || 'Project'}
          </div>

          <h3 className="text-xl font-light text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight font-sans">
            <Link
              to={projectUrl}
              className="focus:outline-none inline-flex items-center gap-1.5 group/title"
            >
              <span className="line-clamp-1">{title}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200 shrink-0" />
            </Link>
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

        {/* Minimalist Source & Demo Links */}
        <div className="flex items-center gap-2.5 shrink-0">
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1"
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
              className="text-xs font-sans text-slate-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1"
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
