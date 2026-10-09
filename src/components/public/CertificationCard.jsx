import React from 'react'
import { motion } from 'framer-motion'
import { Award, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react'

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
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formattedDate = formatDate(issue_date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Subtle liquid glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
              <Award className="w-4 h-4" />
            </div>
            {formattedDate && (
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                {formattedDate}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-medium text-zinc-100 group-hover:text-white transition-colors tracking-tight font-sans">
          {title}
        </h3>

        {/* Issuer */}
        <p className="mt-1 text-sm font-sans text-zinc-400">
          {issuer}
        </p>

        {/* Credential ID if present */}
        {credential_id && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-500">ID:</span>
            <code className="text-xs font-mono text-zinc-300 bg-black/40 border border-white/10 px-2 py-0.5 rounded">
              {credential_id}
            </code>
          </div>
        )}

        {/* Skills or summary */}
        {skills && (
          <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
            <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-0.5">Competencies:</span>
            {skills}
          </p>
        )}
      </div>

      {/* Credential Link Button */}
      {credential_url && (
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <a
            href={credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium font-sans text-zinc-300 hover:text-cyan-400 transition-colors group/link"
          >
            <span>Verify Credential</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>

          <span className="text-[10px] font-mono text-zinc-500">External Registry</span>
        </div>
      )}
    </motion.div>
  )
}

export default CertificationCard
