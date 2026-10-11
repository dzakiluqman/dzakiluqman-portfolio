import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Printer, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import EducationCard from './EducationCard'
import CertificationCard from './CertificationCard'
import ResumePDF from '../ResumePDF'

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
      if (!isSupabaseConfigured) {
        if (isMounted) {
          try {
            const storedExp = localStorage.getItem('dzaki_demo_exp')
            const storedEdu = localStorage.getItem('dzaki_demo_edu')
            const storedCerts = localStorage.getItem('dzaki_demo_certs')
            setExperiences(propExperiences?.length ? propExperiences : (storedExp ? JSON.parse(storedExp) : []))
            setEducations(propEducations?.length ? propEducations : (storedEdu ? JSON.parse(storedEdu) : []))
            setCertifications(propCertifications?.length ? propCertifications : (storedCerts ? JSON.parse(storedCerts) : []))
          } catch {
            setExperiences(propExperiences || [])
            setEducations(propEducations || [])
            setCertifications(propCertifications || [])
          }
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
          setExperiences(expRes.data || [])
          setEducations(eduRes.data || [])
          setCertifications(certsRes.data || [])
        }
      } catch (err) {
        console.warn('Error fetching career progression data:', err)
        if (isMounted) {
          setExperiences(propExperiences || [])
          setEducations(propEducations || [])
          setCertifications(propCertifications || [])
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

  const expList = Array.isArray(experiences) ? experiences : []
  const eduList = Array.isArray(educations) ? educations : []
  const certList = Array.isArray(certifications) ? certifications : []

  const tabs = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'certs', label: 'Certs' }
  ]

  return (
    <section id="experience" className="relative py-20 md:py-28 bg-[#000000] scroll-mt-24 print:py-0 print:bg-white">
      <div className="max-w-7xl mx-auto px-6 print:hidden">
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
                {expList.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 font-sans text-sm">
                    No work experience records available.
                  </div>
                ) : (
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
              )}
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
                {eduList.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 font-sans text-sm col-span-full">
                    No education records available.
                  </div>
                ) : (
                  eduList.map((edu, idx) => (
                    <EducationCard
                      key={edu.id || `edu-${idx}`}
                      education={edu}
                      index={idx}
                    />
                  ))
                )}
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
                {certList.length === 0 ? (
                  <div className="py-16 text-center text-zinc-500 font-sans text-sm col-span-full">
                    No certification records available.
                  </div>
                ) : (
                  certList.map((cert, idx) => (
                    <CertificationCard
                      key={cert.id || `cert-${idx}`}
                      certification={cert}
                      index={idx}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Standalone ATS Resume for print when modal is not active */}
      {!showCvModal && (
        <div className="hidden print:block w-full">
          <ResumePDF 
            profile={profile}
            experiences={expList}
            educations={eduList}
            certifications={certList}
          />
        </div>
      )}

      {/* Swiss Editorial Curriculum Vitae Modal (Printable & Export-Safe) */}
      <AnimatePresence>
        {showCvModal && (
          <div className="cv-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cv-modal-content relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl p-6 scrollbar-thin scrollbar-thumb-neutral-700 my-auto shadow-2xl flex flex-col"
            >
              {/* Modal Top Bar (Hidden during print) */}
              <div className="no-print pb-4 mb-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                  <FileText className="w-4 h-4 text-neutral-400" />
                  <span className="font-semibold text-white">Curriculum Vitae</span>
                  <span className="text-neutral-500 font-mono text-[11px] hidden sm:inline">(ATS-Friendly)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-neutral-950 hover:bg-neutral-200 transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print CV</span>
                  </button>
                  <button
                    onClick={() => setShowCvModal(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Body: Authentic White A4 ATS Paper Sheet */}
              <div className="cv-modal-body flex justify-center">
                <div className="w-full max-w-[210mm] shadow-2xl rounded-lg overflow-hidden bg-white">
                  <ResumePDF 
                    profile={profile}
                    experiences={expList}
                    educations={eduList}
                    certifications={certList}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CareerProgression
