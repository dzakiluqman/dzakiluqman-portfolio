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
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Custom Action Trigger Button (e.g. + Add New Item) */}
        {action && <div className="flex items-center">{action}</div>}

        {/* Admin Profile Capsule Indicator */}
        <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {initials || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-semibold text-white truncate max-w-[110px]">
              {displayName}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate max-w-[110px]">
              {isDemoMode ? 'Preview Admin' : 'Super Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
