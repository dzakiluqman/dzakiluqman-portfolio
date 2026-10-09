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
    Expert: 'text-zinc-100 bg-white/10 border-white/20',
    Advanced: 'text-zinc-300 bg-white/[0.06] border-white/15',
    Intermediate: 'text-zinc-400 bg-white/[0.04] border-white/10',
    Beginner: 'text-zinc-500 bg-white/[0.02] border-white/[0.06]',
  }

  const badgeStyle = levelColors[level] || levelColors.Advanced

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/30 transition-colors">
          <DynamicIcon name={icon_name} className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wide">{name}</h4>
          {category && <span className="text-[11px] text-zinc-500 font-mono">{category}</span>}
        </div>
      </div>

      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${badgeStyle}`}>
        {level}
      </span>
    </div>
  )
}

export default SkillBadge
