import React from 'react'

/**
 * ATS-Friendly Resume / Curriculum Vitae Component
 * 
 * Complies with strict Applicant Tracking System (ATS) guidelines:
 * - Single-column layout with Job Overview paragraph format (no heavy bullet lists).
 * - Styled with Montserrat font family.
 * - High contrast: pure black on pure white background.
 * - Semantic HTML hierarchy (h1, h2, p, a).
 * - Standard section headers: ABOUT ME, EXPERIENCE, EDUCATION, CERTIFICATIONS.
 * - Mandatory Header at the very top: Name, Role, Location, Gmail, Portfolio link.
 * - Print-optimized: A4 margins, page-break-inside avoid on individual items.
 */
export const ResumePDF = ({
  profile = {},
  experiences = [],
  educations = [],
  certifications = []
}) => {
  // Format dates cleanly (e.g., "Dec 2023 – May 2024")
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

  // Format education years
  const formatEducationYears = (edu) => {
    const currentYr = new Date().getFullYear()
    const isOngoing = !edu.end_year || parseInt(edu.end_year, 10) >= currentYr
    if (isOngoing) {
      return `${edu.start_year || currentYr} – Present`
    }
    if (edu.start_year && edu.end_year && String(edu.start_year) !== String(edu.end_year)) {
      return `${edu.start_year} – ${edu.end_year}`
    }
    return `${edu.start_year || edu.end_year || ''}`
  }

  // Default experiences conforming to Job Overview format
  const defaultExperiences = [
    {
      role: 'Backend Developer',
      company: 'PT Teknoreka Inovasi Nusantara',
      employment_type: 'Internship',
      start_date: '2023-12-01',
      end_date: '2024-05-31',
      location: 'Special Region of Yogyakarta',
      description: 'Developed and maintained robust backend services and relational MySQL database architectures for a Digital Library web application built with Laravel. Focused on engineering clean RESTful APIs for book management, search filters, and user authentication while optimizing query performance and collaborating closely with front-end teams for seamless UI integration.'
    },
    {
      role: 'Level Designer & 3D Artist',
      company: 'PT Bodha Dharmaja Aryadhana',
      employment_type: 'Internship',
      start_date: '2022-09-01',
      end_date: '2023-08-31',
      location: 'South Jakarta, Indonesia',
      description: 'Designed and assembled interactive 3D game environments and spatial level blockouts in Unreal Engine 5. Responsible for real-time environment asset integration, dynamic lighting setups tailored for hardware performance, and directing cinematic video trailers using Unreal Engine Sequencer.'
    }
  ]

  const defaultEducations = [
    {
      institution: 'Universitas Muhammadiyah Magelang',
      degree: 'Bachelor of Computer Science',
      field_of_study: 'Informatics Engineering',
      start_year: 2020,
      end_year: 2024,
      key_focus: 'Software Engineering & Relational Database Systems',
      description: 'Focused on algorithms, data structures, full-stack software development lifecycles, and database optimization.'
    }
  ]

  const defaultCertifications = [
    {
      title: 'Junior Web Developer',
      issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
      issue_date: '2024-06-15',
      credential_id: 'BNSP-JWD-2024'
    },
    {
      title: 'Meta Front-End Developer Specialization',
      issuer: 'Coursera / Meta',
      issue_date: '2023-11-20',
      credential_id: 'META-FED-2023'
    }
  ]

  // Fallback demo data from localStorage if prop arrays are empty
  const getExperiences = () => {
    if (experiences && experiences.length > 0) return experiences
    try {
      const stored = localStorage.getItem('dzaki_demo_exp')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
      }
    } catch {}
    return defaultExperiences
  }

  const getEducations = () => {
    if (educations && educations.length > 0) return educations
    try {
      const stored = localStorage.getItem('dzaki_demo_edu')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
      }
    } catch {}
    return defaultEducations
  }

  const getCertifications = () => {
    if (certifications && certifications.length > 0) return certifications
    try {
      const stored = localStorage.getItem('dzaki_demo_certs')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
      }
    } catch {}
    return defaultCertifications
  }

  const expList = getExperiences()
  const eduList = getEducations()
  const certList = getCertifications()

  // Dynamic Contact Data
  const fullName = profile?.full_name ? profile.full_name.toUpperCase() : 'DZAKII LUQMAN FAID'
  const role = profile?.headline || 'Junior Full-Stack Developer'
  const location = profile?.location || 'Magelang, Indonesia'
  const email = profile?.social_links?.email || profile?.email || 'dzakiluqman275@gmail.com'
  const portfolioUrl = 'https://portfolio.dzakiluqman.my.id'
  const portfolioDisplay = 'portfolio.dzakiluqman.my.id'
  const aboutMeText = profile?.bio?.trim() || 'An enthusiastic, fast-learning Junior Full-Stack Developer passionate about building modern, interactive web applications and mobile ecosystems using React, Next.js, TypeScript, and cloud services. Experienced in engineering RESTful APIs, optimizing relational databases, and integrating computer vision and IoT hardware telemetry. Dedicated to writing clean, maintainable code and delivering performant, user-centric software solutions.'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        #printable-cv, #printable-cv * {
          font-family: 'Montserrat', sans-serif !important;
        }

        @media print {
          /* 1. Set page margin to 0 to eliminate browser default header & footer slots */
          @page {
            size: A4;
            margin: 0;
          }

          /* 2. Reset html and body elements */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 3. Apply custom margin via padding inside the printable CV container */
          #printable-cv {
            padding: 16mm 18mm !important;
            box-sizing: border-box !important;
            width: 100% !important;
            min-h-screen: 100vh;
          }
        }
      `}</style>

      <div 
        id="printable-cv"
        className="bg-white text-black p-8 rounded-lg space-y-6 text-sm leading-normal ats-resume-container w-full max-w-[210mm] mx-auto selection:bg-zinc-200 selection:text-black"
        style={{
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        {/* 1. MANDATORY HEADER */}
        <div className="text-center border-b border-neutral-300 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
            {fullName}
          </h1>
          <p className="text-sm font-semibold text-neutral-800 mt-1">
            {role}
          </p>
          <p className="text-xs text-neutral-600 mt-2 flex items-center justify-center gap-2 flex-wrap">
            <span>{location}</span>
            <span>•</span>
            <a 
              href={`mailto:${email}`} 
              className="text-neutral-800 hover:underline"
            >
              {email}
            </a>
            <span>•</span>
            <a 
              href={portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neutral-800 hover:underline font-medium"
            >
              {portfolioDisplay}
            </a>
          </p>
        </div>

        {/* 2. ABOUT ME */}
        <section className="break-inside-avoid-page">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
            ABOUT ME
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800 text-justify">
            {aboutMeText}
          </p>
        </section>

        {/* 3. EXPERIENCE (JOB OVERVIEW FORMAT - NO BULLET POINTS) */}
        {expList && expList.length > 0 && (
          <section className="break-inside-avoid-page">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              EXPERIENCE
            </h2>
            
            <div className="space-y-4">
              {expList.map((exp, idx) => {
                const start = formatDate(exp.start_date)
                const end = exp.is_current ? 'Present' : formatDate(exp.end_date)
                const dateRange = start ? `${start} – ${end}` : (end || '')

                // Concise Job Overview paragraph: use description or join achievements without bullets
                const overviewText = exp.description || (Array.isArray(exp.achievements) ? exp.achievements.join(' ') : exp.achievements)

                return (
                  <div key={exp.id || idx} className="break-inside-avoid">
                    <div className="flex justify-between font-semibold text-xs text-black">
                      <span>
                        {exp.role} at {exp.company} {exp.employment_type ? `(${exp.employment_type})` : ''}
                      </span>
                      {dateRange && <span>{dateRange}</span>}
                    </div>
                    {exp.location && (
                      <p className="text-xs text-neutral-600 italic mb-1">{exp.location}</p>
                    )}
                    {overviewText && (
                      <p className="text-xs text-neutral-800 leading-relaxed">
                        {overviewText}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 4. EDUCATION */}
        {eduList && eduList.length > 0 && (
          <section className="break-inside-avoid-page">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {eduList.map((edu, idx) => {
                const years = formatEducationYears(edu)
                const degreeTitle = edu.field_of_study 
                  ? (edu.degree ? `${edu.degree} in ${edu.field_of_study}` : edu.field_of_study)
                  : (edu.degree || 'Degree')

                return (
                  <div key={edu.id || idx} className="break-inside-avoid">
                    <div className="flex justify-between font-semibold text-xs text-black">
                      <span>{degreeTitle} at {edu.institution}</span>
                      {years && <span>{years}</span>}
                    </div>
                    {edu.key_focus && (
                      <p className="text-xs text-neutral-600 italic mb-0.5">Focus: {edu.key_focus}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-neutral-800 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 5. CERTIFICATIONS */}
        {certList && certList.length > 0 && (
          <section className="break-inside-avoid-page">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              CERTIFICATIONS
            </h2>
            <div className="space-y-2.5">
              {certList.map((cert, idx) => {
                const issueDate = formatDate(cert.issue_date)

                return (
                  <div key={cert.id || idx} className="break-inside-avoid">
                    <div className="flex justify-between font-semibold text-xs text-black">
                      <span>
                        {cert.title} — {cert.issuer}
                        {cert.credential_id && (
                          <span className="text-neutral-500 font-normal ml-1">({cert.credential_id})</span>
                        )}
                      </span>
                      {issueDate && <span>{issueDate}</span>}
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-neutral-600 hover:text-black underline inline-block"
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default ResumePDF
