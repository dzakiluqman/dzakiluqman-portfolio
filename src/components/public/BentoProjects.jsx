import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Star, 
  Maximize2, 
  X, 
  Code2, 
  Sparkles 
} from 'lucide-react'

// 3D Tilt Card wrapper
const TiltCard = ({ children, className = '', isHero = false, onClick }) => {
  const cardRef = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rX = ((y - centerY) / centerY) * -10
    const rY = ((x - centerX) / centerX) * 10

    setRotateX(rX)
    setRotateY(rY)
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlowPos({ x: 50, y: 50 })
  }

  return (
    <div
      style={{ perspective: '1000px' }}
      className={`h-full ${isHero ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out'
        }}
        className={`relative h-full rounded-2xl hud-glass hud-glass-hover overflow-hidden group cursor-pointer border border-neon-cyan/20 p-6 flex flex-col justify-between ${className}`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
          style={{
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 242, 254, 0.18), transparent 60%)`
          }}
        />
        {children}
      </div>
    </div>
  )
}

export const BentoProjects = ({ projects = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedModalProject, setSelectedModalProject] = useState(null)

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 border-t border-slate-800/80 relative cyber-grid">
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-violet/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-neon-cyan text-xs font-mono uppercase tracking-widest mb-2.5">
              <FolderGit2 className="w-4 h-4 text-neon-cyan" />
              <span>BENTO_PROJECT_MATRIX // V2</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineered Deployments
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              High-impact distributed applications, cloud telemetry, and AI systems with full 3D interactive preview.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-neon-cyan text-dark-950 font-bold shadow-neon-cyan'
                    : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[340px]">
          {filteredProjects.map((project, index) => {
            const isHero = index === 0 && filteredProjects.length > 2

            return (
              <TiltCard
                key={project.id || index}
                isHero={isHero}
                onClick={() => setSelectedModalProject(project)}
              >
                <div className="flex items-center justify-between gap-2 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-dark-950/80 text-neon-cyan border border-neon-cyan/30">
                    {project.category || 'Architecture'}
                  </span>

                  <div className="flex items-center gap-2">
                    {project.is_featured && (
                      <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="p-1.5 rounded-lg bg-dark-950/70 border border-slate-800 text-slate-400 group-hover:text-neon-cyan transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="relative my-4 aspect-video rounded-xl overflow-hidden bg-dark-950 border border-slate-800 group-hover:border-neon-cyan/40 transition-colors">
                  <img
                    src={project.thumbnail_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
                </div>

                <div className="space-y-2 z-10">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between z-10 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack?.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-950/80 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack?.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-dark-950 text-slate-500">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-dark-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                        title="GitHub Source"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-dark-950/80 hover:bg-slate-800 text-slate-400 hover:text-neon-cyan border border-slate-800 transition-colors"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </div>
      </div>

      {/* QUICK VIEW GLASS MODAL */}
      <AnimatePresence>
        {selectedModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl hud-glass rounded-2xl border border-neon-cyan/40 shadow-neon-cyan/20 overflow-hidden my-8"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                    {selectedModalProject.category}
                  </span>
                  {selectedModalProject.is_featured && (
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Featured
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedModalProject(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={selectedModalProject.thumbnail_url}
                    alt={selectedModalProject.title}
                    className="w-full h-64 object-cover object-top"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {selectedModalProject.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedModalProject.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-3 font-mono leading-relaxed">
                  <div className="text-neon-cyan font-bold flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>SYSTEM_DESIGN & ARCHITECTURE</span>
                  </div>
                  <p>{selectedModalProject.content || selectedModalProject.description}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Integrated Technologies:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedModalProject.tech_stack?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-dark-950 border border-slate-700 text-neon-cyan"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  {selectedModalProject.github_url && (
                    <a
                      href={selectedModalProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-950 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-2 font-mono"
                    >
                      <Github className="w-4 h-4" />
                      <span>REPOSITORY</span>
                    </a>
                  )}
                  {selectedModalProject.demo_url && (
                    <a
                      href={selectedModalProject.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:opacity-95 transition-all flex items-center gap-2 font-mono font-bold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>INITIALIZE_DEMO</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default BentoProjects
