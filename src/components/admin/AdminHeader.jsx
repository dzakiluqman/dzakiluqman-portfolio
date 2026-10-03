import React from 'react'
import { Database, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminHeader = ({ title, subtitle, action }) => {
  const { isConfigured } = useAuth()

  return (
    <header className="bg-dark-900/60 backdrop-blur-md border-b border-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border bg-slate-900 border-slate-800">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          {isConfigured ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Supabase Connected
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
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
