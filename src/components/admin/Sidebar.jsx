import React, { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderGit2, 
  Code, 
  FileText, 
  Mail, 
  LogOut, 
  ExternalLink, 
  ShieldCheck,
  Disc3,
  Sliders,
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import dlLogo from '../../assets/images/dl-logo.png'

export const Sidebar = ({ unreadCount = 0 }) => {
  const { user, logout, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills & Stack', path: '/admin/skills', icon: Code },
    { name: 'CV & Experience', path: '/admin/cv', icon: FileText },
    { name: 'Soundtrack', path: '/admin/tracks', icon: Disc3 },
    { name: 'Messages', path: '/admin/messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : null },
  ]

  return (
    <>
      {/* Mobile Header Bar & Hamburger */}
      <div className="lg:hidden w-full flex items-center justify-between bg-[#121218] border border-white/5 rounded-2xl px-4 py-3 mb-3">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 p-1 flex items-center justify-center shadow-md">
            <img src={dlLogo} alt="DL Logo" className="w-full h-auto max-h-6 object-contain rounded-md" />
          </div>
          <div>
            <span className="font-bold text-xs text-white tracking-tight flex items-center gap-1">
              Admin CMS
              <ShieldCheck className="w-3 h-3 text-[#8b5cf6]" />
            </span>
            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
              {isDemoMode ? 'Preview Mode' : 'Supabase Live'}
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img src={dlLogo} alt="DL Logo" className="w-7 h-7 object-contain" />
                <span className="font-bold text-sm text-white">Admin Dashboard</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/admin/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#06b6d4] text-black">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-zinc-400" />
                <span>View Live Portfolio</span>
              </div>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Left Floating Pill Sidebar */}
      <aside className="hidden lg:flex w-20 bg-[#121218] border border-white/5 rounded-3xl p-4 flex-col justify-between items-center shrink-0 min-h-[calc(100vh-2rem)] sticky top-4 shadow-2xl shadow-black/60 z-30">
        {/* Brand Logo Capsule */}
        <div className="flex flex-col items-center">
          <Link
            to="/admin/dashboard"
            className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-2 flex items-center justify-center shadow-lg hover:border-[#8b5cf6]/50 hover:shadow-[#8b5cf6]/20 transition-all group relative"
            title="Admin CMS Home"
          >
            <img 
              src={dlLogo} 
              alt="DL Logo" 
              className="w-full h-auto max-h-8 object-contain rounded-md transition-transform group-hover:scale-105" 
            />
            {/* Online status indicator */}
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#121218] shadow-sm" />
          </Link>
        </div>

        {/* Center Vertical Navigation Tabs */}
        <nav className="flex flex-col items-center gap-3 w-full my-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin/dashboard'}
                title={item.name}
                className={({ isActive }) =>
                  `relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group ${
                    isActive
                      ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/35 scale-105'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    
                    {/* Unread Message Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-[#06b6d4] text-black flex items-center justify-center shadow-md animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {/* Minimal Hover Tooltip */}
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1a1a24] text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 border border-white/10 shadow-xl z-50">
                      {item.name}
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}

          <div className="w-8 h-[1px] bg-white/10 my-2" />

          {/* Settings / System indicator */}
          <Link
            to="/admin/dashboard"
            title="System & CMS Overview"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all group relative"
          >
            <Sliders className="w-5 h-5 transition-transform group-hover:rotate-45" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1a1a24] text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 border border-white/10 shadow-xl z-50">
              System Settings
            </div>
          </Link>
        </nav>

        {/* Bottom Actions: View Live Site & Logout */}
        <div className="flex flex-col items-center gap-3 w-full pt-4 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Portfolio"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all group relative"
          >
            <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1a1a24] text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 border border-white/10 shadow-xl z-50">
              Live Portfolio
            </div>
          </a>

          <button
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all group relative"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1a1a24] text-rose-300 text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 border border-rose-500/20 shadow-xl z-50">
              Sign Out
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
