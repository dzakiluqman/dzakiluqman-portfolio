import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Award, BookOpen, ShieldCheck } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockEducations, mockCertifications } from '../../lib/mockData'
import EducationCard from './EducationCard'
import CertificationCard from './CertificationCard'

export const EducationCertifications = ({
  educations: propEducations = [],
  certifications: propCertifications = []
}) => {
  const [educations, setEducations] = useState(
    propEducations?.length ? propEducations : mockEducations
  )
  const [certifications, setCertifications] = useState(
    propCertifications?.length ? propCertifications : mockCertifications
  )

  useEffect(() => {
    let isMounted = true

    const fetchDynamicCredentials = async () => {
      // Local fallback handler
      const getLocalFallback = () => {
        const storedEdu = localStorage.getItem('dzaki_demo_edu')
        const storedCerts = localStorage.getItem('dzaki_demo_certs')

        const parsedEdu = storedEdu ? JSON.parse(storedEdu) : null
        const parsedCerts = storedCerts ? JSON.parse(storedCerts) : null

        return {
          edu: (Array.isArray(parsedEdu) && parsedEdu.length > 0)
            ? parsedEdu
            : (propEducations?.length ? propEducations : mockEducations),
          certs: (Array.isArray(parsedCerts) && parsedCerts.length > 0)
            ? parsedCerts
            : (propCertifications?.length ? propCertifications : mockCertifications)
        }
      }

      if (!isSupabaseConfigured) {
        if (isMounted) {
          const fallback = getLocalFallback()
          setEducations(fallback.edu)
          setCertifications(fallback.certs)
        }
        return
      }

      try {
        const [eduRes, certsRes] = await Promise.all([
          supabase
            .from('educations')
            .select('*')
            .order('start_year', { ascending: false }),
          supabase
            .from('certifications')
            .select('*')
            .order('issue_date', { ascending: false })
        ])

        if (isMounted) {
          if (eduRes.data && eduRes.data.length > 0) {
            setEducations(eduRes.data)
          } else {
            setEducations(getLocalFallback().edu)
          }

          if (certsRes.data && certsRes.data.length > 0) {
            setCertifications(certsRes.data)
          } else {
            setCertifications(getLocalFallback().certs)
          }
        }
      } catch (err) {
        console.warn('Error fetching dynamic credentials from Supabase:', err)
        if (isMounted) {
          const fallback = getLocalFallback()
          setEducations(fallback.edu)
          setCertifications(fallback.certs)
        }
      }
    }

    fetchDynamicCredentials()

    // Realtime subscriptions
    let eduChannel = null
    let certChannel = null

    if (isSupabaseConfigured) {
      eduChannel = supabase
        .channel('public:educations:credentials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'educations' }, () => {
          fetchDynamicCredentials()
        })
        .subscribe()

      certChannel = supabase
        .channel('public:certifications:credentials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'certifications' }, () => {
          fetchDynamicCredentials()
        })
        .subscribe()
    }

    // Local admin panel update listeners
    const handleUpdate = () => fetchDynamicCredentials()
    window.addEventListener('dzaki:educations_updated', handleUpdate)
    window.addEventListener('dzaki:certifications_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      isMounted = false
      if (eduChannel) supabase.removeChannel(eduChannel)
      if (certChannel) supabase.removeChannel(certChannel)
      window.removeEventListener('dzaki:educations_updated', handleUpdate)
      window.removeEventListener('dzaki:certifications_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [propEducations, propCertifications])

  const eduList = educations && educations.length > 0 ? educations : mockEducations
  const certList = certifications && certifications.length > 0 ? certifications : mockCertifications

  return (
    <section id="education" className="relative py-20 md:py-28 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mb-14 md:mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Foundations & Verification
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-zinc-100 tracking-tight font-sans">
            Education & <span className="font-semibold text-white">Certifications</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
            Formal computer science foundations, engineering rigor, and industry-accredited 
            cloud architecture and distributed systems credentials.
          </p>
        </motion.div>

        {/* 2-Column Editorial Grid: Left = Education, Right = Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Column 1: Formal Education */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-sans tracking-wider text-zinc-300 font-medium uppercase">
                  <span className="text-zinc-500 mr-2 font-mono">01 /</span>
                  Formal Education
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {eduList.length} {eduList.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>

            <div className="space-y-4">
              {eduList.map((edu, idx) => (
                <EducationCard
                  key={edu.id || `edu-${idx}`}
                  education={edu}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Industry Certifications */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-sans tracking-wider text-zinc-300 font-medium uppercase">
                  <span className="text-zinc-500 mr-2 font-mono">02 /</span>
                  Verified Certifications
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {certList.length} {certList.length === 1 ? 'Credential' : 'Credentials'}
              </span>
            </div>

            <div className="space-y-4">
              {certList.map((cert, idx) => (
                <CertificationCard
                  key={cert.id || `cert-${idx}`}
                  certification={cert}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EducationCertifications
