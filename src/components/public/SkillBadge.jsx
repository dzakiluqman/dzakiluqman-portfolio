import React from 'react'
import * as Icons from 'lucide-react'

// Helper to safely render dynamic Lucide icon by string name
const DynamicIcon = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = Icons[name] || Icons.Code
  return <IconComponent className={className} />
}

export const SkillBadge = ({ skill }) => {
  const { name, level = 'Advanced', icon_name = 'Code', category } = skill

  const levelColors = {
    Expert: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    Advanced: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Beginner: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  }

  const badgeStyle = levelColors[level] || levelColors.Advanced

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
          <DynamicIcon name={icon_name} className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wide">{name}</h4>
          {category && <span className="text-[11px] text-slate-500 font-mono">{category}</span>}
        </div>
      </div>

      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${badgeStyle}`}>
        {level}
      </span>
    </div>
  )
}

export default SkillBadge
