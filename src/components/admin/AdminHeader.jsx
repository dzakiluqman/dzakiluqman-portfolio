import React from 'react'
import { Database, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminHeader = ({ title, subtitle, action }) => {
  const { isConfigured } = useAuth()

  return (
    <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border bg-zinc-900 border-zinc-800">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          {isConfigured ? (
            <span className="text-zinc-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Supabase Connected
            </span>
          ) : (
            <span className="text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
              Local Demo Mode
            </span>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </header>
  )
}

export default AdminHeader
