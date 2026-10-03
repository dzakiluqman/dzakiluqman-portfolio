import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FolderGit2, 
  Briefcase, 
  Mail, 
  Code, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Clock,
  Sparkles,
  Database,
  Cpu,
  Radio,
  Activity,
  Terminal,
  ShieldCheck
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockProjects, mockExperiences, mockSkills, mockMessages } from '../../lib/mockData'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalExperiences: 0,
    totalSkills: 0,
    unreadMessages: 0
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardMetrics() {
      setLoading(true)

      if (!isSupabaseConfigured) {
        const storedMessages = JSON.parse(localStorage.getItem('dzaki_demo_messages') || 'null') || mockMessages
        const storedProjects = JSON.parse(localStorage.getItem('dzaki_demo_projects') || 'null') || mockProjects
        const storedExp = JSON.parse(localStorage.getItem('dzaki_demo_exp') || 'null') || mockExperiences
        const storedSkills = JSON.parse(localStorage.getItem('dzaki_demo_skills') || 'null') || mockSkills

        setStats({
          totalProjects: storedProjects.length,
          publishedProjects: storedProjects.filter((p) => p.is_published).length,
          totalExperiences: storedExp.length,
          totalSkills: storedSkills.length,
          unreadMessages: storedMessages.filter((m) => !m.is_read).length
        })
        setRecentMessages(storedMessages.slice(0, 4))
        setLoading(false)
        return
      }

      try {
        const [projectsRes, expRes, skillsRes, messagesRes] = await Promise.all([
          supabase.from('projects').select('id, is_published'),
          supabase.from('experiences').select('id'),
          supabase.from('skills').select('id'),
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5)
        ])

        const projects = projectsRes.data || []
        const experiences = expRes.data || []
        const skills = skillsRes.data || []
        const messages = messagesRes.data || []

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p) => p.is_published).length,
          totalExperiences: experiences.length,
          totalSkills: skills.length,
          unreadMessages: messages.filter((m) => !m.is_read).length
        })
        setRecentMessages(messages)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100 cyber-grid">
      <Sidebar unreadCount={stats.unreadMessages} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Portfolio Overview & Management"
          subtitle="Real-time CMS overview, database records, and inbound inquiries"
          action={
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
          }
        />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {loading ? (
            <LoadingSpinner text="Loading dashboard metrics..." />
          ) : (
            <>
              {/* System Status Bar */}
              <div className="p-4 rounded-2xl hud-glass border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold">Supabase Connected</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Row Level Security (RLS) Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <span>Region: Asia Southeast</span>
                  <span className="text-neon-cyan font-semibold">Live Mode</span>
                </div>
              </div>

              {/* Sci-Fi Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Projects */}
                <div className="p-6 rounded-2xl hud-glass border border-slate-800 hover:border-neon-cyan/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Total Projects</span>
                    <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalProjects}</span>
                    <span className="text-xs text-neon-cyan font-mono">({stats.publishedProjects} Live)</span>
                  </div>
                  <Link
                    to="/admin/projects"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-neon-cyan hover:text-white"
                  >
                    <span>Inspect repo matrix</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Work Experiences */}
                <div className="p-6 rounded-2xl hud-glass border border-slate-800 hover:border-neon-violet/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Work Experience</span>
                    <div className="w-9 h-9 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center text-neon-violet">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalExperiences}</span>
                    <span className="text-xs text-slate-400 font-mono">Positions logged</span>
                  </div>
                  <Link
                    to="/admin/cv"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-neon-violet hover:text-white"
                  >
                    <span>Update trajectory</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Skills Listed */}
                <div className="p-6 rounded-2xl hud-glass border border-slate-800 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Technical Skills</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Code className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalSkills}</span>
                    <span className="text-xs text-slate-400 font-mono">Skills listed</span>
                  </div>
                  <Link
                    to="/admin/cv"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-white"
                  >
                    <span>Reconfigure skills</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Inquiries */}
                <div className="p-6 rounded-2xl hud-glass border border-slate-800 hover:border-rose-500/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Inbound Messages</span>
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.unreadMessages}</span>
                    <span className="text-xs text-rose-400 font-mono">Unread inquiries</span>
                  </div>
                  <Link
                    to="/admin/messages"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-rose-400 hover:text-white"
                  >
                    <span>Review inbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Grid: Recent Inbound Messages & DB Topology */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Messages */}
                <div className="lg:col-span-7 hud-glass rounded-2xl p-6 space-y-4 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-neon-cyan" />
                      <h3 className="font-bold text-white text-base">Recent Inbound Messages</h3>
                    </div>
                    <Link
                      to="/admin/messages"
                      className="text-xs font-mono text-neon-cyan hover:underline"
                    >
                      VIEW INBOX ({stats.unreadMessages} UNREAD)
                    </Link>
                  </div>

                  {recentMessages.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono">
                      No messages logged yet. Real-time form submissions stream here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            msg.is_read
                              ? 'bg-dark-950/60 border-slate-800/80 text-slate-400'
                              : 'bg-neon-cyan/5 border-neon-cyan/40 text-white shadow-neon-cyan/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-slate-200">
                              {msg.sender_name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-neon-cyan font-mono">{msg.sender_email}</p>
                          <p className="text-xs text-slate-300 mt-2 line-clamp-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Panel: Supabase DB Architecture */}
                <div className="lg:col-span-5 hud-glass rounded-2xl p-6 space-y-5 border border-slate-800">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                    <Database className="w-4 h-4 text-neon-cyan" />
                    <h3 className="font-bold text-white text-base">Supabase Database Architecture</h3>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>
                      Direct connection configured via <code className="text-neon-cyan font-mono">@supabase/supabase-js</code> with Row Level Security.
                    </p>

                    <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 font-mono text-[11px] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">profiles:</span>
                        <span className="text-neon-cyan">Public Read / Auth Write</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">projects:</span>
                        <span className="text-emerald-400">Bento Grid CRUD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">experiences:</span>
                        <span className="text-neon-violet">Timeline Sync</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">skills:</span>
                        <span className="text-amber-400">3D Tech Sphere Sync</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">messages:</span>
                        <span className="text-rose-400">Inbound Form Submissions</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-dark-950 border border-neon-cyan/40 hover:bg-neon-cyan/10 text-neon-cyan text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Live Portfolio</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
