import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Cpu, Layers, Terminal, ShieldCheck, CheckCircle2, Sparkles, Zap } from 'lucide-react'

// Safe dynamic icon resolver with fallback to Code icon
const DynamicIcon = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = Icons[name] || Icons.Code
  return <IconComponent className={className} />
}

export const TechnicalCompetencies = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All')

  // Extract categories dynamically from skills array
  const categories = useMemo(() => {
    const rawCategories = skills.map((s) => s.category).filter(Boolean)
    return ['All', ...Array.from(new Set(rawCategories))]
  }, [skills])

  // Filter skills based on current active tab
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills
    return skills.filter((s) => s.category === activeCategory)
  }, [skills, activeCategory])

  // Map proficiency level to refined editorial palette
  const levelStyles = {
    Expert: {
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/30',
      bg: 'bg-neon-cyan/10',
      indicator: 'bg-neon-cyan',
      bar: 'bg-gradient-to-r from-neon-cyan to-blue-500',
      percentage: '95%'
    },
    Advanced: {
      text: 'text-neon-violet',
      border: 'border-neon-violet/30',
      bg: 'bg-neon-violet/10',
      indicator: 'bg-neon-violet',
      bar: 'bg-gradient-to-r from-neon-violet to-purple-600',
      percentage: '85%'
    },
    Intermediate: {
      text: 'text-amber-400',
      border: 'border-amber-400/30',
      bg: 'bg-amber-400/10',
      indicator: 'bg-amber-400',
      bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
      percentage: '70%'
    },
    Beginner: {
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      bg: 'bg-slate-500/10',
      indicator: 'bg-slate-400',
      bar: 'bg-slate-500',
      percentage: '50%'
    }
  }

  // Count by category for filter pill badges
  const categoryCounts = useMemo(() => {
    const counts = { All: skills.length }
    skills.forEach((s) => {
      if (s.category) {
        counts[s.category] = (counts[s.category] || 0) + 1
      }
    })
    return counts
  }, [skills])

  return (
    <section id="skills" className="py-24 border-t border-slate-800/80 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono uppercase tracking-widest mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Engineering Stack & Expertise</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technical Competencies
          </h2>
          
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Production-proven frontend architectures, high-concurrency backend services, 
            resilient databases, and modern automated DevOps toolchains.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-900/80 border border-slate-800/90 backdrop-blur-md max-w-xl mx-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 font-semibold shadow-[0_0_15px_rgba(0,242,254,0.12)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-neon-cyan/30 text-neon-cyan' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Editorial Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editorial Architectural Overview Card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-dark-900/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan uppercase tracking-wider mb-3">
                <Layers className="w-4 h-4 text-neon-cyan" />
                <span>Architecture Standard</span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Engineered for High Performance
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Prioritizing strict type safety, zero-bundle-waste static delivery, responsive UI layouts, and scalable cloud-native architectures.
              </p>

              {/* Core Principles Pills */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-950/60 border border-slate-800/60">
                  <div className="mt-0.5 w-6 h-6 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Zero-Lag Execution</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Optimized bundle footprint with single-canvas WebGL architecture for max Lighthouse scores.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-950/60 border border-slate-800/60">
                  <div className="mt-0.5 w-6 h-6 rounded-md bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Full-Stack Reliability</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">End-to-end typing from PostgreSQL schemas to reactive client components.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-950/60 border border-slate-800/60">
                  <div className="mt-0.5 w-6 h-6 rounded-md bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Modern Tooling</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Vite, Docker containerization, Supabase, and automated GitHub CI/CD.</p>
                  </div>
                </div>
              </div>

              {/* Status Ticker Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Stack
                </span>
                <span className="text-white font-semibold">{filteredSkills.length} Technologies</span>
              </div>
            </div>
          </div>

          {/* Right Column: Static CSS Editorial Badges Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => {
                  const style = levelStyles[skill.level] || levelStyles.Advanced

                  return (
                    <motion.div
                      key={skill.id || skill.name || index}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="group p-4 rounded-xl bg-dark-900/60 hover:bg-dark-900 border border-slate-800/80 hover:border-slate-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Minimalist icon frame */}
                          <div className="w-9 h-9 rounded-lg bg-dark-950 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-neon-cyan group-hover:border-neon-cyan/40 transition-colors flex-shrink-0">
                            <DynamicIcon name={skill.icon_name} className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white tracking-wide truncate group-hover:text-neon-cyan transition-colors">
                              {skill.name}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                              {skill.category}
                            </span>
                          </div>
                        </div>

                        {/* Editorial Level Pill */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono flex-shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.indicator}`} />
                          <span>{skill.level}</span>
                        </div>
                      </div>

                      {/* Minimalist Proficiency Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1.5 rounded-full bg-dark-950 overflow-hidden border border-slate-800/80">
                          <div
                            style={{ width: style.percentage }}
                            className={`h-full rounded-full ${style.bar} transition-all duration-500`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TechnicalCompetencies
