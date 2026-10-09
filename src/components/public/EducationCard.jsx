import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Sparkles, Calendar, BookOpen } from 'lucide-react'

export const EducationCard = ({ education, index = 0 }) => {
  if (!education) return null

  const {
    institution = 'Academic Institution',
    degree = 'Degree',
    field_of_study = '',
    start_year = '',
    end_year = '',
    key_focus = '',
    description = ''
  } = education

  const yearsDisplay = start_year 
    ? (end_year && end_year !== start_year ? `${start_year} — ${end_year}` : `${start_year}`)
    : (end_year || 'Present')

  const effectiveKeyFocus = key_focus || field_of_study

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Subtle liquid glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
              {yearsDisplay}
            </span>
          </div>

          {end_year && parseInt(end_year, 10) >= new Date().getFullYear() && (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              In Progress
            </span>
          )}
        </div>

        {/* Degree & Field */}
        <h3 className="text-lg sm:text-xl font-medium text-zinc-100 group-hover:text-white transition-colors tracking-tight font-sans">
          {degree}
        </h3>

        {/* Institution */}
        <p className="mt-1 text-sm font-sans text-zinc-300 flex items-center gap-1.5">
          <span>{institution}</span>
        </p>

        {/* Key Focus Tag */}
        {effectiveKeyFocus && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Key Focus</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              {effectiveKeyFocus}
            </p>
          </div>
        )}

        {/* Description / Academic Highlights */}
        {description && (
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default EducationCard
