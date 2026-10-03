import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Terminal, Lock, Mail, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Key } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  
  const { login, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const { error } = await login(email, password)

    if (error) {
      setErrorMsg(error.message || 'Authentication failed. Please verify your credentials.')
      setIsSubmitting(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  const fillDemoCredentials = () => {
    setEmail('admin@portfolio.dev')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-0.5 shadow-xl shadow-indigo-600/25">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio CMS Admin
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to manage projects, CV records, and inbox messages
          </p>
        </div>

        {/* Demo Notice / Quick Fill */}
        {!isConfigured && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Demo Admin Credentials:
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Auto Fill
              </button>
            </div>
            <p className="font-mono text-[11px] text-slate-300">
              Email: <span className="text-white font-bold">admin@portfolio.dev</span><br />
              Pass: <span className="text-white font-bold">admin123</span>
            </p>
          </div>
        )}

        {/* Login Box */}
        <div className="mt-6 bg-dark-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
