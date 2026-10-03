import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  GraduationCap, 
  Award,
  Terminal,
  FileCheck
} from 'lucide-react'

export const ExperienceTimeline = ({ experiences = [], educations = [], certifications = [], profile }) => {
  const [showCvModal, setShowCvModal] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* CV Trigger Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl hud-glass border border-neon-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">Curriculum Vitae</h4>
            <p className="text-xs text-slate-400">Professional career trajectory, education, and credentials</p>
          </div>
        </div>

        <button
          onClick={() => setShowCvModal(true)}
          className="px-4 py-2.5 rounded-xl font-mono text-xs font-semibold bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Preview & Print CV</span>
        </button>
      </div>

      {/* Cyber Circuit Timeline */}
      <div className="relative pl-6 md:pl-10 border-l-2 border-slate-800 space-y-10">
        {experiences.map((exp, index) => {
          const start = formatDate(exp.start_date)
          const end = exp.is_current ? 'PRESENT' : formatDate(exp.end_date)

          return (
            <motion.div
              key={exp.id || index}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glowing Cyber Circuit Node */}
              <div
                className={`absolute -left-[31px] md:-left-[49px] top-1.5 w-5 h-5 rounded-full border-2 transition-all ${
                  exp.is_current
                    ? 'border-neon-cyan bg-dark-950 shadow-[0_0_15px_#00f2fe]'
                    : 'border-slate-700 bg-dark-950 group-hover:border-neon-violet group-hover:shadow-[0_0_12px_#a855f7]'
                }`}
              >
                {exp.is_current && (
                  <div className="w-2 h-2 rounded-full bg-neon-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-7 rounded-2xl hud-glass hud-glass-hover border border-slate-800/90 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm font-semibold text-neon-cyan font-mono">
                      <span>{exp.company}</span>
                      {exp.employment_type && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-dark-950 border border-slate-700 text-slate-300">
                            {exp.employment_type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                      <span className="text-slate-200">{start} — {end}</span>
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
                  <ul className="space-y-2.5 mt-4 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* DYNAMIC PRINTABLE CV MODAL */}
      <AnimatePresence>
        {showCvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-dark-900 border border-neon-cyan/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8"
            >
              {/* Modal Bar */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-950">
                <div className="flex items-center gap-2 font-mono text-xs text-neon-cyan">
                  <FileCheck className="w-4 h-4" />
                  <span>Curriculum Vitae Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-neon-cyan text-dark-950 hover:opacity-90 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setShowCvModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable CV Document Content */}
              <div className="p-8 space-y-6 overflow-y-auto text-slate-200 font-sans print:p-0">
                <div className="border-b border-slate-800 pb-5">
                  <h2 className="text-3xl font-extrabold text-white">{profile?.full_name || 'Dzaki Luqman'}</h2>
                  <p className="text-base font-semibold text-neon-cyan mt-1">{profile?.headline}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {profile?.location} • {profile?.social_links?.email || 'dzakiluqman@example.com'}
                  </p>
                </div>

                {/* Profile Summary */}
                <div className="space-y-1">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-neon-cyan font-bold">Professional Summary</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{profile?.bio}</p>
                </div>

                {/* Experience in CV */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-neon-cyan font-bold">Work Experience</h3>
                  <div className="space-y-4">
                    {experiences.map((exp, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{exp.role} @ {exp.company}</span>
                          <span className="font-mono text-slate-400">{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                        </div>
                        <p className="text-slate-400">{exp.description}</p>
                        {exp.achievements && (
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
                            {exp.achievements.map((ach, idx) => (
                              <li key={idx}>{ach}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education in CV */}
                {educations && educations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-neon-cyan font-bold">Education</h3>
                    <div className="space-y-2">
                      {educations.map((edu, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <div>
                            <p className="font-bold text-white">{edu.institution}</p>
                            <p className="text-slate-400">{edu.degree} in {edu.field_of_study}</p>
                          </div>
                          <span className="font-mono text-slate-400">{edu.start_year} — {edu.end_year || 'Present'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExperienceTimeline
