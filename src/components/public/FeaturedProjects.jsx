import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'

export const FeaturedProjects = ({ projects = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="relative pt-16 pb-20 md:pt-20 md:pb-24 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-light text-zinc-100 tracking-tight font-sans">
              Featured <span className="font-semibold text-white">Projects</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
              Curated digital products, software architectures, and interactive web applications engineered with precision.
            </p>
          </div>

          {/* Clean Minimal Text Filter Links */}
          {categories.length > 1 && (
            <nav className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none" aria-label="Project filter categories">
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm font-sans tracking-wide transition-colors whitespace-nowrap focus:outline-none ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </nav>
          )}
        </motion.div>

        {/* Structured 3-Column Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-zinc-500 font-sans text-sm">
            No projects found in this category.
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProjects
