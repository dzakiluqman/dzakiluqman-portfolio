import React from 'react'
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
  Disc3
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import dlLogo from '../../assets/images/dl-logo.png'

export const Sidebar = ({ unreadCount = 0 }) => {
  const { user, logout, isDemoMode } = useAuth()
  const navigate = useNavigate()

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
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 p-1 flex items-center justify-center shadow-md group-hover:border-white/20 transition-colors">
            <img 
              src={dlLogo} 
              alt="DL Logo" 
              className="w-full h-auto max-h-7 object-contain rounded-md" 
            />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              Admin CMS
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            </span>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              {isDemoMode ? 'Preview Mode' : 'Supabase Live'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-mono uppercase text-zinc-500 tracking-wider mb-2">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-200 text-black">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}

        <div className="pt-6">
          <p className="px-3 text-[11px] font-mono uppercase text-zinc-500 tracking-wider mb-2">
            Public Website
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-zinc-400" />
              <span>View Live Portfolio</span>
            </div>
          </a>
        </div>
      </div>

      {/* Admin User Footer & Logout */}
      <div className="p-4 border-t border-zinc-800 bg-[#000000]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user?.email || 'admin@portfolio.dev'}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">Authenticated Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
