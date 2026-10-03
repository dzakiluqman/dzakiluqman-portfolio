import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured)

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        if (!isSupabaseConfigured) {
          // Check if local demo session exists
          const savedDemoSession = localStorage.getItem('dzaki_demo_session')
          if (savedDemoSession) {
            const parsed = JSON.parse(savedDemoSession)
            setUser(parsed.user)
            setSession(parsed)
          }
          setLoading(false)
          return
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        if (error) console.warn('Supabase getSession warning:', error.message)
        
        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setLoading(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
            setLoading(false)
          }
        })

        return () => {
          subscription?.unsubscribe()
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    // If Supabase is not configured or in Demo Mode, allow testing admin features with demo credentials
    if (!isSupabaseConfigured) {
      if (email === 'admin@portfolio.dev' && password === 'admin123') {
        const demoUser = {
          id: 'demo-admin-uuid-0001',
          email: 'admin@portfolio.dev',
          user_metadata: { full_name: 'Dzaki Luqman (Demo Admin)' }
        }
        const demoSession = { user: demoUser, access_token: 'demo-token' }
        setUser(demoUser)
        setSession(demoSession)
        localStorage.setItem('dzaki_demo_session', JSON.stringify(demoSession))
        return { data: { user: demoUser, session: demoSession }, error: null }
      }
      return {
        data: null,
        error: new Error('Invalid demo credentials. For demo mode use: admin@portfolio.dev / admin123 (or connect live Supabase keys in .env)')
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const logout = async () => {
    try {
      if (!isSupabaseConfigured) {
        localStorage.removeItem('dzaki_demo_session')
        setUser(null)
        setSession(null)
        return { error: null }
      }
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        logout,
        isConfigured: isSupabaseConfigured,
        isDemoMode: !isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
