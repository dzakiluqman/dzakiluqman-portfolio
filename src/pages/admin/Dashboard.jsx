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
  Database
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
        // Live Supabase queries
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
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100">
      <Sidebar unreadCount={stats.unreadMessages} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Overview & Analytics"
          subtitle="Portfolio management control center and live metrics"
          action={
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
          }
        />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {loading ? (
            <LoadingSpinner text="Compiling metrics..." />
          ) : (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Total Projects</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalProjects}</span>
                    <span className="text-xs text-emerald-400 font-mono">({stats.publishedProjects} Published)</span>
                  </div>
                  <Link
                    to="/admin/projects"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Manage projects</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Work History</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalExperiences}</span>
                    <span className="text-xs text-slate-400 font-mono">Positions recorded</span>
                  </div>
                  <Link
                    to="/admin/cv"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Update CV items</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Skills Listed</span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Code className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.totalSkills}</span>
                    <span className="text-xs text-slate-400 font-mono">Tech badges</span>
                  </div>
                  <Link
                    to="/admin/cv"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Edit competencies</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Unread Messages</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.unreadMessages}</span>
                    <span className="text-xs text-slate-400 font-mono">Inquiries pending</span>
                  </div>
                  <Link
                    to="/admin/messages"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-300"
                  >
                    <span>Open Inbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quick Actions & Recent Messages Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Messages Preview */}
                <div className="lg:col-span-7 bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <h3 className="font-bold text-white text-base">Recent Inbound Inquiries</h3>
                    </div>
                    <Link
                      to="/admin/messages"
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
                    >
                      View all ({stats.unreadMessages} unread)
                    </Link>
                  </div>

                  {recentMessages.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono">
                      No inbound messages yet. Submissions from the contact form will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            msg.is_read
                              ? 'bg-dark-950/60 border-slate-800 text-slate-400'
                              : 'bg-indigo-950/20 border-indigo-500/30 text-white'
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
                          <p className="text-xs text-indigo-400 font-mono">{msg.sender_email}</p>
                          <p className="text-xs text-slate-300 mt-2 line-clamp-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Database & Schema Info */}
                <div className="lg:col-span-5 bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Supabase Backend Status</h3>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>
                      Your application is wired for Supabase PostgreSQL with Row-Level Security (RLS) policies.
                    </p>

                    <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Profiles:</span>
                        <span className="text-emerald-400">Public Read / Auth Write</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Projects:</span>
                        <span className="text-emerald-400">Full CRUD for Admin</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experiences / Skills:</span>
                        <span className="text-emerald-400">Dynamic CV sync</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Messages:</span>
                        <span className="text-emerald-400">Public Insert / Admin Inbox</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[11px] text-slate-400">
                        A ready-to-run SQL schema file is included in <code className="text-white bg-slate-800 px-1 py-0.5 rounded">supabase_schema.sql</code>. Copy & paste into your Supabase SQL editor to create all tables and seed data automatically.
                      </p>
                    </div>

                    <div className="pt-2">
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-400" />
                        <span>Preview Live Portfolio Front-end</span>
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
