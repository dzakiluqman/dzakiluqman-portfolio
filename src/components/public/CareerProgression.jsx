import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Printer, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockExperiences, mockEducations, mockCertifications } from '../../lib/mockData'
import EducationCard from './EducationCard'
import CertificationCard from './CertificationCard'

export const CareerProgression = ({ 
  experiences: propExperiences = [], 
  educations: propEducations = [], 
  certifications: propCertifications = [], 
  profile 
}) => {
  const [activeTab, setActiveTab] = useState('experience') // 'experience' | 'education' | 'certs'
  const [experiences, setExperiences] = useState(propExperiences?.length ? propExperiences : [])
  const [educations, setEducations] = useState(propEducations?.length ? propEducations : [])
  const [certifications, setCertifications] = useState(propCertifications?.length ? propCertifications : [])
  const [showCvModal, setShowCvModal] = useState(false)

  // Dynamic data loading and realtime updates
  useEffect(() => {
    let isMounted = true

    const fetchAllData = async () => {
      const getLocalFallback = () => {
        const storedExp = localStorage.getItem('dzaki_demo_exp')
        const storedEdu = localStorage.getItem('dzaki_demo_edu')
        const storedCerts = localStorage.getItem('dzaki_demo_certs')

        const parsedExp = storedExp ? JSON.parse(storedExp) : null
        const parsedEdu = storedEdu ? JSON.parse(storedEdu) : null
        const parsedCerts = storedCerts ? JSON.parse(storedCerts) : null

        return {
          exp: (Array.isArray(parsedExp) && parsedExp.length > 0) ? parsedExp : (propExperiences?.length ? propExperiences : mockExperiences),
          edu: (Array.isArray(parsedEdu) && parsedEdu.length > 0) ? parsedEdu : (propEducations?.length ? propEducations : mockEducations),
          certs: (Array.isArray(parsedCerts) && parsedCerts.length > 0) ? parsedCerts : (propCertifications?.length ? propCertifications : mockCertifications)
        }
      }

      if (!isSupabaseConfigured) {
        if (isMounted) {
          const fallback = getLocalFallback()
          setExperiences(fallback.exp)
          setEducations(fallback.edu)
          setCertifications(fallback.certs)
        }
        return
      }

      try {
        const [expRes, eduRes, certsRes] = await Promise.all([
          supabase.from('experiences').select('*').order('start_date', { ascending: false }),
          supabase.from('educations').select('*').order('start_year', { ascending: false }),
          supabase.from('certifications').select('*').order('issue_date', { ascending: false })
        ])

        if (isMounted) {
          const fallback = getLocalFallback()
          setExperiences(expRes.data && expRes.data.length > 0 ? expRes.data : fallback.exp)
          setEducations(eduRes.data && eduRes.data.length > 0 ? eduRes.data : fallback.edu)
          setCertifications(certsRes.data && certsRes.data.length > 0 ? certsRes.data : fallback.certs)
        }
      } catch (err) {
        console.warn('Error fetching career progression data:', err)
        if (isMounted) {
          const fallback = getLocalFallback()
          setExperiences(fallback.exp)
          setEducations(fallback.edu)
          setCertifications(fallback.certs)
        }
      }
    }

    fetchAllData()

    // Realtime subscriptions
    let channels = []
    if (isSupabaseConfigured) {
      const expChannel = supabase
        .channel('public:experiences:progression')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, fetchAllData)
        .subscribe()
      const eduChannel = supabase
        .channel('public:educations:progression')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'educations' }, fetchAllData)
        .subscribe()
      const certChannel = supabase
        .channel('public:certifications:progression')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'certifications' }, fetchAllData)
        .subscribe()
      channels = [expChannel, eduChannel, certChannel]
    }

    const handleUpdate = () => fetchAllData()
    window.addEventListener('dzaki:experiences_updated', handleUpdate)
    window.addEventListener('dzaki:educations_updated', handleUpdate)
    window.addEventListener('dzaki:certifications_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      isMounted = false
      channels.forEach(ch => supabase.removeChannel(ch))
      window.removeEventListener('dzaki:experiences_updated', handleUpdate)
      window.removeEventListener('dzaki:educations_updated', handleUpdate)
      window.removeEventListener('dzaki:certifications_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [propExperiences, propEducations, propCertifications])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const expList = experiences && experiences.length > 0 ? experiences : mockExperiences
  const eduList = educations && educations.length > 0 ? educations : mockEducations
  const certList = certifications && certifications.length > 0 ? certifications : mockCertifications

  const tabs = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'certs', label: 'Certs' }
  ]

  return (
    <section id="experience" className="relative py-20 md:py-28 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header with Right-Aligned CV Button & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          {/* Left Side: Title & Subtitle */}
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-light text-zinc-100 tracking-tight">
              Career <span className="font-bold text-white">Progression</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Engineering tenures, academic computer science foundations, and industry-verified credentials.
            </p>
          </div>

          {/* Right Side: Stacked CV Button & Right-Aligned Minimalist Text Tabs */}
          <div className="flex flex-col items-start md:items-end gap-5">
            {/* Top Right: Curriculum Vitae Trigger */}
            <button
              onClick={() => setShowCvModal(true)}
              className="no-print self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Curriculum Vitae</span>
            </button>

            {/* Clean Minimal Text Filter Links (Synchronized with Featured Projects) */}
            <nav className="tab-buttons no-print flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none" aria-label="Career progression tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm font-sans tracking-wide transition-colors whitespace-nowrap focus:outline-none ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Dynamic Interactive Tab Content (Screen View) */}
        <div className="print:hidden">
          <AnimatePresence mode="wait">
            {/* TAB 1: WORK EXPERIENCE */}
            {activeTab === 'experience' && (
              <motion.div
                key="tab-experience"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative border-l border-white/[0.08] ml-2 md:ml-4 pl-6 md:pl-10 space-y-8 md:space-y-10">
                  {expList.map((exp, index) => {
                    const start = formatDate(exp.start_date)
                    const end = exp.is_current ? 'Present' : formatDate(exp.end_date)

                    return (
                      <motion.div
                        key={exp.id || index}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="relative group"
                      >
                        {/* Subtle Node on Timeline */}
                        <div className="absolute -left-[31px] md:-left-[47px] top-6 w-2.5 h-2.5 rounded-full bg-[#000000] border border-white/30 group-hover:border-white group-hover:shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all" />

                        {/* Liquid Card */}
                        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 backdrop-blur-md p-6 sm:p-7 rounded-2xl transition-all duration-300">
                          {/* Date & Meta Header */}
                          <div className="flex flex-wrap items-center gap-2 text-xs tracking-wider text-zinc-500 uppercase font-mono mb-2">
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
                          <h3 className="text-xl font-medium text-zinc-100 group-hover:text-white transition-colors duration-200 tracking-tight">
                            {exp.role}{' '}
                            <span className="text-zinc-400 font-normal">at {exp.company}</span>
                          </h3>

                          {/* Summary */}
                          {exp.description && (
                            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                              {exp.description}
                            </p>
                          )}

                          {/* Achievements */}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="mt-4 pt-4 border-t border-white/[0.06] space-y-2 text-xs sm:text-sm text-zinc-400">
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
              </motion.div>
            )}

            {/* TAB 2: ACADEMIC EDUCATION */}
            {activeTab === 'education' && (
              <motion.div
                key="tab-education"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {eduList.map((edu, idx) => (
                  <EducationCard
                    key={edu.id || `edu-${idx}`}
                    education={edu}
                    index={idx}
                  />
                ))}
              </motion.div>
            )}

            {/* TAB 3: CERTIFICATIONS & CREDENTIALS */}
            {activeTab === 'certs' && (
              <motion.div
                key="tab-certs"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {certList.map((cert, idx) => (
                  <CertificationCard
                    key={cert.id || `cert-${idx}`}
                    certification={cert}
                    index={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRINT ALL TABS SEQUENTIALLY (Ensures print mode renders all 3 domains cleanly) */}
        <div className="print-all-tabs hidden print:block space-y-12">
          {/* Print Section 1: Experience */}
          <div className="space-y-4 break-inside-avoid">
            <h3 className="text-lg font-bold text-black border-b border-gray-300 pb-2">
              Work Experience
            </h3>
            <div className="space-y-6">
              {expList.map((exp, i) => (
                <div key={i} className="timeline-item break-inside-avoid text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-black">{exp.role} — {exp.company}</span>
                    <span className="text-xs text-gray-600 font-mono">
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-gray-700 text-xs leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-xs text-gray-700">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Print Section 2: Education */}
          <div className="space-y-4 break-inside-avoid">
            <h3 className="text-lg font-bold text-black border-b border-gray-300 pb-2">
              Formal Education
            </h3>
            <div className="space-y-4">
              {eduList.map((edu, i) => {
                const currentYr = new Date().getFullYear()
                const isOngoing = !edu.end_year || parseInt(edu.end_year, 10) >= currentYr
                const years = isOngoing 
                  ? `${edu.start_year || currentYr} — Present` 
                  : (edu.start_year && edu.end_year && edu.start_year !== edu.end_year ? `${edu.start_year} — ${edu.end_year}` : `${edu.start_year || edu.end_year}`)

                const headline = edu.field_of_study || edu.degree || edu.institution
                const subtitle = edu.degree && edu.institution ? `${edu.degree} • ${edu.institution}` : (edu.degree || edu.institution)

                return (
                  <div key={i} className="card break-inside-avoid text-sm">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-black">{headline}</span>
                      <span className="text-xs text-gray-600 font-mono">
                        {years} {isOngoing && '(In Progress)'}
                      </span>
                    </div>
                    <p className="text-gray-800 text-xs mt-0.5">{subtitle}</p>
                    {edu.description && (
                      <p className="text-gray-600 text-xs my-1.5 leading-relaxed">{edu.description}</p>
                    )}
                    {edu.key_focus && (
                      <p className="text-gray-600 text-[11px] font-mono">Key Focus: {edu.key_focus}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Print Section 3: Certifications */}
          <div className="space-y-4 break-inside-avoid">
            <h3 className="text-lg font-bold text-black border-b border-gray-300 pb-2">
              Certifications & Credentials
            </h3>
            <div className="space-y-3">
              {certList.map((cert, i) => (
                <div key={i} className="card break-inside-avoid text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-black">{cert.title}</span>
                    <span className="text-xs text-gray-600 font-mono">
                      {formatDate(cert.issue_date)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs">
                    {cert.issuer} {cert.credential_id ? `· ID: ${cert.credential_id}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Swiss Editorial Curriculum Vitae Modal (Printable & Export-Safe) */}
      <AnimatePresence>
        {showCvModal && (
          <div className="cv-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cv-modal-content relative w-full max-w-4xl max-h-[90vh] bg-[#000000] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8"
            >
              {/* Modal Top Bar (Hidden during print) */}
              <div className="no-print p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Curriculum Vitae</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
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
              <div className="cv-modal-body p-6 sm:p-10 space-y-8 overflow-y-auto text-slate-300">
                {/* Profile Header */}
                <div className="border-b border-white/10 pb-6 break-inside-avoid">
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
                  <div className="space-y-2 break-inside-avoid">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Summary
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Experience Records */}
                <div className="space-y-4 break-inside-avoid">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {expList.map((exp, i) => (
                      <div key={i} className="text-xs sm:text-sm space-y-1.5 break-inside-avoid">
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
                {eduList && eduList.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10 break-inside-avoid">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Education
                    </h2>
                    <div className="space-y-4">
                      {eduList.map((edu, i) => {
                        const currentYr = new Date().getFullYear()
                        const isOngoing = !edu.end_year || parseInt(edu.end_year, 10) >= currentYr
                        const years = isOngoing 
                          ? `${edu.start_year || currentYr} — Present` 
                          : (edu.start_year && edu.end_year && edu.start_year !== edu.end_year ? `${edu.start_year} — ${edu.end_year}` : `${edu.start_year || edu.end_year}`)

                        const headline = edu.field_of_study || edu.degree || edu.institution
                        const subtitle = edu.degree && edu.institution ? `${edu.degree} • ${edu.institution}` : (edu.degree || edu.institution)

                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between text-xs sm:text-sm break-inside-avoid gap-2">
                            <div>
                              <p className="font-medium text-white">{headline}</p>
                              <p className="text-zinc-400">{subtitle}</p>
                              {edu.description && (
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{edu.description}</p>
                              )}
                              {edu.key_focus && (
                                <p className="text-xs text-zinc-500 mt-0.5 font-mono">Key Focus: {edu.key_focus}</p>
                              )}
                            </div>
                            <span className="text-xs text-zinc-500 uppercase tracking-wide shrink-0">
                              {years} {isOngoing && '(In Progress)'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certList && certList.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10 break-inside-avoid">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Certifications & Credentials
                    </h2>
                    <div className="space-y-3">
                      {certList.map((cert, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm break-inside-avoid">
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
