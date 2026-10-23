import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminHeader = ({ title, subtitle, action, breadcrumb }) => {
  const { user, isDemoMode } = useAuth()
  const location = useLocation()

  const navPills = [
    { label: 'Overview', path: '/admin/dashboard' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Skills', path: '/admin/skills' },
    { label: 'CV', path: '/admin/cv' },
    { label: 'Tracks', path: '/admin/tracks' },
    { label: 'Messages', path: '/admin/messages' },
  ]

  // Generate initials or display name
  const displayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Dzaki Luqman')
  const displayEmail = user?.email || 'admin@portfolio.dev'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <header className="bg-[#121218] border border-white/5 rounded-2xl px-5 py-3 md:px-6 md:py-3.5 shadow-xl backdrop-blur-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      {/* Left: Title & Subtitle or Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-0.5">
            <span className="text-zinc-400">Admin</span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-[#8b5cf6] font-medium">{breadcrumb || title}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center: Horizontal Navigation Pills (like Finity reference header) */}
      <nav className="hidden lg:flex items-center gap-1.5 bg-[#0a0a0c]/80 border border-white/5 p-1 rounded-full">
        {navPills.map((pill) => {
          const isActive = location.pathname === pill.path || 
            (pill.path === '/admin/dashboard' && location.pathname === '/admin')
          return (
            <Link
              key={pill.path}
              to={pill.path}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#8b5cf6] text-white font-semibold shadow-md shadow-[#8b5cf6]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {pill.label}
            </Link>
          )
        })}
      </nav>

      {/* Right: Actions & Admin Profile Capsule */}
      <div className="flex flex-row items-center flex-nowrap gap-3 shrink-0">
        {/* Custom Action Trigger Button (e.g. + Add New Item) */}
        {action && <div className="flex items-center shrink-0">{action}</div>}

        {/* Admin Profile Badge (Moved to the Right) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-neutral-900/80 border border-white/10 rounded-2xl shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
            {initials || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {isDemoMode ? 'Preview Admin' : 'Super Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
