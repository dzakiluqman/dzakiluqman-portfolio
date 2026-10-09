import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Key } from 'lucide-react'
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
    <div className="min-h-screen bg-[#000000] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects (Pure Monochrome) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 p-2 shadow-xl shadow-white/5">
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
          <div className="mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white" />
                Demo Admin Credentials:
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-black hover:bg-zinc-200 transition-colors font-medium"
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

        {/* Login Box */}
        <div className="mt-6 bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-relaxed">{errorMsg}</p>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#000000] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20"
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
                  onChange={(e) => setEmail ? setPassword(e.target.value) : null}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#000000] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
