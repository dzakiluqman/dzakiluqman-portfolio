import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react'

export const ExperienceTimeline = ({ experiences = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 font-mono text-sm">
        No work experience records found.
      </div>
    )
  }

  return (
    <div className="relative pl-6 md:pl-8 border-l border-slate-800 space-y-10">
      {experiences.map((exp, index) => {
        const start = formatDate(exp.start_date)
        const end = exp.is_current ? 'Present' : formatDate(exp.end_date)

        return (
          <motion.div
            key={exp.id || index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                exp.is_current
                  ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                  : 'border-slate-700 bg-dark-950 group-hover:border-indigo-500 group-hover:bg-indigo-500/20'
              }`}
            >
              {exp.is_current && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
              )}
            </div>

            {/* Experience Box */}
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {exp.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm font-medium text-indigo-400">
                    <span>{exp.company}</span>
                    {exp.employment_type && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {exp.employment_type}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{start} — {end}</span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {exp.description && (
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {exp.description}
                </p>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="space-y-2 mt-3 pt-3 border-t border-slate-800/60 text-xs sm:text-sm text-slate-400">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-normal">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ExperienceTimeline
