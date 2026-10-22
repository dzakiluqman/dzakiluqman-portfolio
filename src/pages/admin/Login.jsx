import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Key, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import dlLogo from '../../assets/images/dl-logo.png'

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
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-[#8b5cf6]/30 selection:text-white">
      {/* Background glow effects (Violet & Cyan Bento Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#121218] border border-white/10 p-2.5 shadow-xl shadow-[#8b5cf6]/10">
            <img 
              src={dlLogo} 
              alt="DL Logo" 
              className="w-full h-auto max-h-10 object-contain rounded-lg" 
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio CMS Admin
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Sign in to manage projects, CV records, and inbox messages
          </p>
        </div>

        {/* Demo Notice / Quick Fill */}
        {!isConfigured && (
          <div className="mt-6 p-4 rounded-2xl bg-[#121218] border border-white/10 text-xs text-zinc-300 shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8b5cf6]" />
                Demo Admin Credentials:
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.08] text-[#06b6d4] hover:bg-white/[0.15] border border-[#06b6d4]/30 transition-colors font-medium cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
            <p className="font-mono text-[11px] text-zinc-400">
              Email: <span className="text-white font-bold">admin@portfolio.dev</span><br />
              Pass: <span className="text-white font-bold">admin123</span>
            </p>
          </div>
        )}

        {/* Login Bento Box */}
        <div className="mt-6 bg-[#121218] border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-200 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/30 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
