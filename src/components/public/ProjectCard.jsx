import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Star, ArrowRight } from 'lucide-react'

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
    is_featured
  } = project

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={thumbnail_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {category ? (
            <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-slate-900/90 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              {category}
            </span>
          ) : <span />}

          {is_featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>Featured</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            <Link to={`/project/${slug || id}`} className="focus:outline-none">
              {title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        {tech_stack && tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tech_stack.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {tech_stack.length > 5 && (
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/50 text-slate-400">
                +{tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="View GitHub Repository"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {demo_url && (
              <a
                href={demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="View Live Demo"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            to={`/project/${slug || id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-0.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
