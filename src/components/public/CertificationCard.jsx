import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, ArrowUpRight } from 'lucide-react'

export const CertificationCard = ({ certification, index = 0 }) => {
  if (!certification) return null

  const {
    title = 'Professional Certification',
    issuer = 'Issuing Organization',
    issue_date = '',
    credential_id = '',
    credential_url = '',
    skills = ''
  } = certification

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr.toUpperCase()
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
    } catch {
      return dateStr.toUpperCase()
    }
  }

  const formattedDate = formatDate(issue_date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group relative rounded-2xl bg-zinc-950/60 hover:bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 backdrop-blur-md p-6 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Card Header Row (Top Meta) */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Badge/Pill with ribbon/award icon + capitalized date */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/80 text-xs font-mono text-zinc-300">
            <Award className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold tracking-wider">{formattedDate || 'VERIFIED'}</span>
          </div>

          {/* Right: Verified badge */}
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* 1. Title */}
        <h3 className="font-bold text-zinc-100 text-lg line-clamp-2 mt-4 tracking-tight group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* 2. Issuer */}
        <p className="text-zinc-400 text-sm mt-1">
          {issuer}
        </p>

        {/* 3. Credential ID Tag */}
        {credential_id && (
          <div className="mt-3">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md inline-block">
              ID: {credential_id}
            </span>
          </div>
        )}

        {/* 4. Competencies Section */}
        {skills && (
          <div className="mt-5">
            <h4 className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mt-5 mb-1">
              COMPETENCIES
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {skills}
            </p>
          </div>
        )}
      </div>

      {/* Verification Link if URL exists */}
      {credential_url && (
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <a
            href={credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors group/link"
          >
            <span>Verify Credential</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
          <span className="text-[10px] text-zinc-500 font-mono">Registry</span>
        </div>
      )}
    </motion.div>
  )
}

export default CertificationCard
