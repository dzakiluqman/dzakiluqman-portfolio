import React from 'react'

/**
 * ATS-Friendly Resume / Curriculum Vitae Component
 * 
 * Complies with strict Applicant Tracking System (ATS) guidelines:
 * - Single-column layout for clean, unambiguous sequential text parsing.
 * - Standard web typography (Plus Jakarta Sans / Inter / Arial).
 * - High contrast: pure black/dark zinc on pure white background.
 * - Semantic HTML hierarchy (h1, h2, h3, p, ul, li).
 * - Standard section headers: EXPERIENCE, EDUCATION, CERTIFICATIONS.
 * - Explicit contact information: Name, Role, Location, Gmail, Portfolio link.
 * - No rasterized text, canvas, or complex SVG overlays that break OCR/parsing.
 * - Print-optimized: A4 margins, page-break-inside avoid on individual records.
 */
export const ResumePDF = ({
  profile = {},
  experiences = [],
  educations = [],
  certifications = []
}) => {
  // Format dates cleanly (e.g., "Jan 2023")
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

  // Fallback demo data from localStorage if prop arrays are empty
  const getExperiences = () => {
    if (experiences && experiences.length > 0) return experiences
    try {
      const stored = localStorage.getItem('dzaki_demo_exp')
      if (stored) return JSON.parse(stored)
    } catch {}
    return []
  }

  const getEducations = () => {
    if (educations && educations.length > 0) return educations
    try {
      const stored = localStorage.getItem('dzaki_demo_edu')
      if (stored) return JSON.parse(stored)
    } catch {}
    return []
  }

  const getCertifications = () => {
    if (certifications && certifications.length > 0) return certifications
    try {
      const stored = localStorage.getItem('dzaki_demo_certs')
      if (stored) return JSON.parse(stored)
    } catch {}
    return []
  }

  const expList = getExperiences()
  const eduList = getEducations()
  const certList = getCertifications()

  // Dynamic Contact Data
  const fullName = profile?.full_name ? profile.full_name.toUpperCase() : 'DZAKII LUQMAN FAID'
  const role = profile?.headline || 'Junior Full-Stack Developer'
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const email = profile?.social_links?.email || profile?.email || 'dzakiluqman275@gmail.com'
  const portfolioUrl = 'https://portfolio.dzakiluqman.my.id'
  const portfolioDisplay = 'portfolio.dzakiluqman.my.id'
  const aboutMeText = profile?.bio?.trim() || 'An enthusiastic, fast-learning Junior Full-Stack Developer passionate about building modern, interactive web applications and mobile ecosystems using React, Next.js, TypeScript, and cloud services. Experienced in engineering RESTful APIs, optimizing relational databases, and integrating computer vision and IoT hardware telemetry. Dedicated to writing clean, maintainable code and delivering performant, user-centric software solutions.'

  return (
    <div 
      id="printable-cv"
      className="bg-white text-black p-8 rounded-lg space-y-6 ats-resume-container w-full max-w-[210mm] mx-auto print:p-0 font-sans leading-normal selection:bg-zinc-200 selection:text-black"
      style={{
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      {/* 1. MANDATORY HEADER (MUST BE AT THE VERY TOP OF PAGE 1) */}
      <div className="text-center border-b border-neutral-300 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-black">
          {fullName}
        </h1>
        <p className="text-base font-semibold text-neutral-800 mt-1">
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

      {/* 3. EXPERIENCE */}
      {expList && expList.length > 0 && (
        <section className="break-inside-avoid-page">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {expList.map((exp, idx) => {
              const start = formatDate(exp.start_date)
              const end = exp.is_current ? 'Present' : formatDate(exp.end_date)
              const dateRange = start ? `${start} – ${end}` : end

              // Normalize achievements
              let achievements = []
              if (Array.isArray(exp.achievements)) {
                achievements = exp.achievements.filter(Boolean)
              } else if (typeof exp.achievements === 'string' && exp.achievements.trim()) {
                achievements = exp.achievements
                  .split('\n')
                  .map(a => a.replace(/^[•\-\*]\s*/, '').trim())
                  .filter(Boolean)
              }

              return (
                <div key={exp.id || idx} className="ats-item break-inside-avoid text-xs sm:text-sm">
                  {/* Job Title & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <div className="font-bold text-zinc-950">
                      <span>{exp.role}</span>
                      <span className="font-normal text-zinc-700"> at </span>
                      <span className="font-semibold text-zinc-900">{exp.company}</span>
                      {exp.location && (
                        <span className="text-zinc-600 font-normal"> — {exp.location}</span>
                      )}
                      {exp.employment_type && (
                        <span className="text-zinc-500 font-normal text-[11px] ml-1.5">({exp.employment_type})</span>
                      )}
                    </div>
                    {dateRange && (
                      <span className="text-xs font-semibold text-zinc-700 shrink-0 sm:text-right">
                        {dateRange}
                      </span>
                    )}
                  </div>

                  {/* Summary / Description */}
                  {exp.description && (
                    <p className="mt-1 text-zinc-800 leading-relaxed text-xs sm:text-[13px]">
                      {exp.description}
                    </p>
                  )}

                  {/* Achievements Bullet Points */}
                  {achievements.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-zinc-800 list-disc pl-5 text-xs sm:text-[13px]">
                      {achievements.map((item, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            EDUCATION
          </h2>
          <div className="space-y-3.5">
            {eduList.map((edu, idx) => {
              const years = formatEducationYears(edu)
              const degreeTitle = edu.field_of_study 
                ? (edu.degree ? `${edu.degree} in ${edu.field_of_study}` : edu.field_of_study)
                : (edu.degree || 'Degree')

              return (
                <div key={edu.id || idx} className="ats-item break-inside-avoid text-xs sm:text-sm">
                  {/* Degree, Institution & Years */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <div>
                      <span className="font-bold text-zinc-950">{degreeTitle}</span>
                      <span className="font-normal text-zinc-700">, </span>
                      <span className="font-semibold text-zinc-900">{edu.institution}</span>
                    </div>
                    {years && (
                      <span className="text-xs font-semibold text-zinc-700 shrink-0 sm:text-right">
                        {years}
                      </span>
                    )}
                  </div>

                  {/* Key Focus */}
                  {edu.key_focus && (
                    <p className="text-zinc-700 text-xs mt-0.5 font-medium">
                      <span className="font-semibold text-zinc-800">Focus:</span> {edu.key_focus}
                    </p>
                  )}

                  {/* Description */}
                  {edu.description && (
                    <p className="mt-1 text-zinc-800 text-xs sm:text-[13px] leading-relaxed">
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
        <section className="mb-6 break-inside-avoid-page">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            CERTIFICATIONS
          </h2>
          <div className="space-y-3">
            {certList.map((cert, idx) => {
              const issueDate = formatDate(cert.issue_date)

              return (
                <div key={cert.id || idx} className="ats-item break-inside-avoid text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <div>
                      <span className="font-bold text-zinc-950">{cert.title}</span>
                      <span className="font-normal text-zinc-700"> — </span>
                      <span className="font-semibold text-zinc-900">{cert.issuer}</span>
                      {cert.credential_id && (
                        <span className="text-zinc-600 font-normal text-xs ml-1.5">
                          (ID: {cert.credential_id})
                        </span>
                      )}
                    </div>
                    {issueDate && (
                      <span className="text-xs font-semibold text-zinc-700 shrink-0 sm:text-right">
                        {issueDate}
                      </span>
                    )}
                  </div>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-zinc-600 hover:text-black underline mt-0.5 inline-block"
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
  )
}

export default ResumePDF
