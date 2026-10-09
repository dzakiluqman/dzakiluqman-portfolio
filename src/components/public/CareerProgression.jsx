import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Printer, X, ArrowUpRight } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockExperiences } from '../../lib/mockData'

export const CareerProgression = ({ 
  experiences: propExperiences = [], 
  educations = [], 
  certifications = [], 
  profile 
}) => {
  const [experiences, setExperiences] = useState(propExperiences?.length ? propExperiences : [])
  const [showCvModal, setShowCvModal] = useState(false)

  // Fetch experiences dynamically from Supabase
  useEffect(() => {
    let isMounted = true

    const fetchDynamicExperiences = async () => {
      const getLocalFallback = () => {
        const stored = localStorage.getItem('dzaki_demo_exp')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) return parsed
          } catch (e) {
            console.warn('Error parsing local experiences:', e)
          }
        }
        return propExperiences && propExperiences.length > 0 ? propExperiences : mockExperiences
      }

      if (!isSupabaseConfigured) {
        if (isMounted) setExperiences(getLocalFallback())
        return
      }

      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          if (isMounted) setExperiences(data)
        } else {
          if (isMounted) setExperiences(getLocalFallback())
        }
      } catch (err) {
        console.warn('Error fetching dynamic experiences from Supabase:', err)
        if (isMounted) setExperiences(getLocalFallback())
      }
    }

    fetchDynamicExperiences()

    // Real-time synchronization with Supabase
    let channel = null
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('public:experiences:realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
          fetchDynamicExperiences()
        })
        .subscribe()
    }

    // Listen to local admin panel updates
    const handleUpdateEvent = () => fetchDynamicExperiences()
    window.addEventListener('dzaki:experiences_updated', handleUpdateEvent)
    window.addEventListener('storage', handleUpdateEvent)

    return () => {
      isMounted = false
      if (channel) supabase.removeChannel(channel)
      window.removeEventListener('dzaki:experiences_updated', handleUpdateEvent)
      window.removeEventListener('storage', handleUpdateEvent)
    }
  }, [propExperiences])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const items = experiences && experiences.length > 0 ? experiences : mockExperiences

  return (
    <section id="experience" className="relative py-20 md:py-28 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-light text-zinc-100 tracking-tight font-sans">
              Career <span className="font-semibold text-white">Progression</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
              Engineering milestones, technical leadership tenures, and high-impact distributed systems delivered in production.
            </p>
          </div>

          {/* Minimal Curriculum Vitae Trigger */}
          <button
            onClick={() => setShowCvModal(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 text-xs font-sans text-zinc-300 hover:text-white transition-all duration-300"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Curriculum Vitae</span>
          </button>
        </motion.div>

        {/* Minimal Editorial Vertical Timeline */}
        <div className="relative border-l border-white/[0.08] ml-2 md:ml-4 pl-6 md:pl-10 space-y-8 md:space-y-10">
          {items.map((exp, index) => {
            const start = formatDate(exp.start_date)
            const end = exp.is_current ? 'Present' : formatDate(exp.end_date)

            return (
              <motion.div
                key={exp.id || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                className="relative group"
              >
                {/* Subtle Timeline Node on Hairline */}
                <div className="absolute -left-[31px] md:-left-[47px] top-6 w-2.5 h-2.5 rounded-full bg-[#000000] border border-white/30 group-hover:border-white/60 transition-colors" />

                {/* Editorial Item Container */}
                <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 backdrop-blur-md p-6 sm:p-7 rounded-2xl transition-all duration-300">
                  {/* Date & Meta Header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs tracking-wider text-zinc-500 uppercase font-sans mb-2">
                    <span className="text-zinc-300 font-medium">{start} — {end}</span>
                    {exp.location && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                    {exp.employment_type && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span>{exp.employment_type}</span>
                      </>
                    )}
                  </div>

                  {/* Role Title & Company */}
                  <h3 className="text-xl font-medium text-zinc-100 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight font-sans">
                    {exp.role}{' '}
                    <span className="text-zinc-400 font-normal">at {exp.company}</span>
                  </h3>

                  {/* Summary Description */}
                  {exp.description && (
                    <p className="mt-3 text-sm text-zinc-400 font-sans leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Key Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-4 pt-4 border-t border-white/[0.06] space-y-2 text-xs sm:text-sm text-zinc-400 font-sans">
                      {exp.achievements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-zinc-600 mt-1 select-none">—</span>
                          <span className="leading-relaxed text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Swiss Editorial Curriculum Vitae Modal */}
      <AnimatePresence>
        {showCvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#000000] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2 text-xs font-sans text-slate-300">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Curriculum Vitae</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print CV</span>
                  </button>
                  <button
                    onClick={() => setShowCvModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-6 sm:p-10 space-y-8 overflow-y-auto text-slate-300 font-sans">
                {/* Profile Header */}
                <div className="border-b border-white/10 pb-6">
                  <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                    {profile?.full_name || 'Dzakii Luqman Faid'}
                  </h1>
                  <p className="text-sm font-medium text-slate-300 mt-1">
                    {profile?.headline || 'Lead Software Developer & Systems Architect'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {profile?.location || 'Kota Magelang, Indonesia'} · {profile?.social_links?.email || 'dzakiluqman275@gmail.com'}
                  </p>
                </div>

                {/* Professional Summary */}
                {profile?.bio && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Summary
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Experience Records */}
                <div className="space-y-4">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {items.map((exp, i) => (
                      <div key={i} className="text-xs sm:text-sm space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-medium text-white">{exp.role} — {exp.company}</span>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">
                            {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="space-y-1 pt-1 text-slate-400">
                            {exp.achievements.map((ach, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-slate-600">—</span>
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {educations && educations.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Education
                    </h2>
                    <div className="space-y-3">
                      {educations.map((edu, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                          <div>
                            <p className="font-medium text-white">{edu.institution}</p>
                            <p className="text-slate-400">{edu.degree} in {edu.field_of_study}</p>
                          </div>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">
                            {edu.start_year} — {edu.end_year || 'Present'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Certifications & Credentials
                    </h2>
                    <div className="space-y-3">
                      {certifications.map((cert, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                          <div>
                            <p className="font-medium text-white">{cert.title}</p>
                            <p className="text-slate-400">{cert.issuer} {cert.credential_id ? `· ID: ${cert.credential_id}` : ''}</p>
                          </div>
                          {cert.issue_date && (
                            <span className="text-xs text-slate-500 uppercase tracking-wide">
                              {formatDate(cert.issue_date)}
                            </span>
                          )}
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
    </section>
  )
}

export default CareerProgression
