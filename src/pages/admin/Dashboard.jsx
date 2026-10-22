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
  ShieldCheck,
  Disc3,
  TrendingUp,
  Layers,
  ChevronRight,
  Wifi,
  Sliders,
  Send,
  Zap
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalExperiences: 0,
    totalSkills: 0,
    unreadMessages: 0,
    totalTracks: 0,
    activeTracks: 0
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartTimeframe, setChartTimeframe] = useState('This Year')

  useEffect(() => {
    async function fetchDashboardMetrics() {
      setLoading(true)

      if (!isSupabaseConfigured) {
        const storedMessages = JSON.parse(localStorage.getItem('dzaki_demo_messages') || '[]') || []
        const storedProjects = JSON.parse(localStorage.getItem('dzaki_demo_projects') || '[]') || []
        const storedExp = JSON.parse(localStorage.getItem('dzaki_demo_exp') || '[]') || []
        const storedSkills = JSON.parse(localStorage.getItem('dzaki_demo_skills') || '[]') || []
        const storedTracks = JSON.parse(localStorage.getItem('dzaki_demo_tracks') || '[]') || []

        setStats({
          totalProjects: storedProjects.length,
          publishedProjects: storedProjects.filter((p) => p.is_published).length,
          totalExperiences: storedExp.length,
          totalSkills: storedSkills.length,
          unreadMessages: storedMessages.filter((m) => !m.is_read).length,
          totalTracks: storedTracks.length,
          activeTracks: storedTracks.filter((t) => t.is_active).length
        })
        setRecentMessages(storedMessages.slice(0, 4))
        setLoading(false)
        return
      }

      try {
        const [projectsRes, expRes, skillsRes, messagesRes, tracksRes] = await Promise.all([
          supabase.from('projects').select('id, is_published'),
          supabase.from('experiences').select('id'),
          supabase.from('skills').select('id'),
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('tracks').select('id, is_active')
        ])

        const projects = projectsRes.data || []
        const experiences = expRes.data || []
        const skills = skillsRes.data || []
        const messages = messagesRes.data || []
        const tracks = tracksRes.data || []

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p) => p.is_published).length,
          totalExperiences: experiences.length,
          totalSkills: skills.length,
          unreadMessages: messages.filter((m) => !m.is_read).length,
          totalTracks: tracks.length,
          activeTracks: tracks.filter((t) => t.is_active).length
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

  // Percentage calculations
  const publishedRate = stats.totalProjects > 0 
    ? Math.round((stats.publishedProjects / stats.totalProjects) * 100) 
    : 0

  const activeTracksRate = stats.totalTracks > 0
    ? Math.round((stats.activeTracks / stats.totalTracks) * 100)
    : 0

  const totalEntities = stats.totalProjects + stats.totalSkills + stats.totalExperiences + stats.totalTracks

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col lg:flex-row p-3 sm:p-4 lg:p-5 gap-4 font-sans selection:bg-[#8b5cf6]/30 selection:text-white">
      {/* Left Floating Pill Sidebar */}
      <Sidebar unreadCount={stats.unreadMessages} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 space-y-4">
        {/* Top Header Bar */}
        <AdminHeader
          title="Dashboard"
          subtitle="Manage your portfolio assets, telemetry, and inbound inquiries in one click"
          action={
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/30 transition-all cursor-pointer font-sans active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Link>
          }
        />

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <LoadingSpinner text="Compiling Bento Grid metrics..." />
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {/* Bento Grid Top Section: Quick Stats + Activity Chart + Cloud Identity Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
              
              {/* Bento Card 1: Total Balance / Projects Showcase (col-span-3) */}
              <div className="lg:col-span-3 bg-[#121218] border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-all shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                      Total Showcase
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      {publishedRate}% Live
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {stats.totalProjects}
                      <span className="text-sm font-normal text-zinc-400 ml-2">Projects</span>
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      {stats.publishedProjects} published on portfolio
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/admin/projects"
                      className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-[#06b6d4]" />
                      <span>Manage</span>
                    </Link>
                    <Link
                      to="/admin/projects"
                      className="py-2.5 px-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold text-center shadow-md shadow-[#8b5cf6]/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create</span>
                    </Link>
                  </div>
                </div>

                {/* Sub-Metrics & Segmented Progress Bar */}
                <div className="pt-5 mt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Live: {stats.publishedProjects}</span>
                    <span className="text-zinc-400">Drafts: {stats.totalProjects - stats.publishedProjects}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-700 shadow-sm shadow-[#8b5cf6]/50"
                      style={{ width: `${Math.max(publishedRate, 8)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                    <span>Visibility Ratio</span>
                    <span className="text-zinc-300 font-bold">{publishedRate}%</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Transactions / Activity & Telemetry Chart (col-span-6) */}
              <div className="lg:col-span-6 bg-[#121218] border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/10 transition-all shadow-xl">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        Activity & Telemetry Overview
                        <Activity className="w-4 h-4 text-[#8b5cf6]" />
                      </h3>
                      <p className="text-xs text-zinc-400">Content updates, submissions & visitor interactions</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {['This Year', 'Month'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setChartTimeframe(tab)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            chartTimeframe === tab
                              ? 'bg-white/10 text-white border border-white/15'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Metrics & Legend */}
                  <div className="flex flex-wrap items-baseline gap-6 my-2">
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        {totalEntities}
                      </span>
                      <span className="text-xs text-zinc-400 ml-2 font-mono">Total CMS Records</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono ml-auto">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] shadow-sm shadow-[#8b5cf6]/50" />
                        Inquiries & Messages
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-sm shadow-[#06b6d4]/50" />
                        Showcase Assets
                      </span>
                    </div>
                  </div>
                </div>

                {/* High-Contrast Vector Area Chart (matching reference Finity aesthetics) */}
                <div className="relative w-full h-44 sm:h-52 pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      {/* Violet Gradient Area */}
                      <linearGradient id="violetGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                        <stop offset="85%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>

                      {/* Cyan Gradient Area */}
                      <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="90%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>

                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                    <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

                    {/* Cyan Wavy Area & Line (Projects / Assets) */}
                    <path
                      d="M 0 160 C 50 170, 90 140, 140 150 C 190 160, 240 120, 290 145 C 340 170, 390 130, 440 140 C 490 150, 540 130, 600 135 L 600 200 L 0 200 Z"
                      fill="url(#cyanGlow)"
                    />
                    <path
                      d="M 0 160 C 50 170, 90 140, 140 150 C 190 160, 240 120, 290 145 C 340 170, 390 130, 440 140 C 490 150, 540 130, 600 135"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Violet Wavy Area & Line (Messages / Inquiries) */}
                    <path
                      d="M 0 145 C 50 135, 90 165, 140 110 C 190 70, 240 115, 290 85 C 340 55, 390 110, 440 70 C 490 65, 540 100, 600 90 L 600 200 L 0 200 Z"
                      fill="url(#violetGlow)"
                    />
                    <path
                      d="M 0 145 C 50 135, 90 165, 140 110 C 190 70, 240 115, 290 85 C 340 55, 390 110, 440 70 C 490 65, 540 100, 600 90"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#glowEffect)"
                    />

                    {/* Apex Highlight Pin & Tooltip */}
                    <circle cx="290" cy="85" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                    <line x1="290" y1="85" x2="290" y2="190" stroke="#8b5cf6" strokeDasharray="3 3" strokeOpacity="0.6" />
                    
                    {/* Floating Pill Tag */}
                    <g transform="translate(255, 48)">
                      <rect width="70" height="24" rx="12" fill="#8b5cf6" />
                      <text x="35" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Active
                      </text>
                    </g>
                  </svg>

                  {/* Horizontal Month Labels */}
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 pt-2 px-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 3: Supabase Cloud Card / Live Architecture (col-span-3) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#1c1c28] via-[#121218] to-[#0d0d12] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group hover:border-[#8b5cf6]/40 transition-all">
                {/* Background Holographic Shimmer */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#06b6d4]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                      Cloud Instance
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.08] text-zinc-200 border border-white/10 flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-[#10b981]" />
                      POSTGRES 15
                    </span>
                  </div>

                  {/* Virtual Card Graphic */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-[#8b5cf6]" />
                        <span className="font-mono text-xs font-bold text-white tracking-wider">SUPABASE</span>
                      </div>
                      <Radio className="w-4 h-4 text-[#06b6d4] animate-pulse" />
                    </div>

                    <div className="pt-2">
                      <p className="font-mono text-xs tracking-widest text-zinc-400">
                        xmdr •••• •••• tcgu
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        Region: Asia Southeast (Singapore)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: RLS & Status */}
                <div className="pt-4 border-t border-white/5 space-y-2 relative z-10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                      RLS Security
                    </span>
                    <span className="text-[#10b981] font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Environment</span>
                    <span className="text-zinc-200">Production</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bento Grid Bottom Section: Management Shortcuts + Database Donut + Recent Messages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

              {/* Bento Card 4: Management Shortcuts & Trajectory (col-span-5) */}
              <div className="lg:col-span-5 bg-[#121218] border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-white/10 transition-all shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Content Trajectory & Modules
                    </h3>
                    <p className="text-xs text-zinc-400">Direct management shortcuts & sync status</p>
                  </div>
                  <Link
                    to="/admin/projects"
                    className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* 4 Shortcut Items matching "Financial Goals" in reference */}
                <div className="space-y-3">
                  {/* Item 1: Projects */}
                  <Link
                    to="/admin/projects"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Circular Gauge 1 */}
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="3"
                            strokeDasharray="88" strokeDashoffset={88 - (88 * (publishedRate || 10)) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-mono">{publishedRate}%</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#8b5cf6] transition-colors">
                          Showcase Projects
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {stats.publishedProjects} Published / {stats.totalProjects} Total
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-300">Manage</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>

                  {/* Item 2: Skills */}
                  <Link
                    to="/admin/skills"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="3"
                            strokeDasharray="88" strokeDashoffset="12"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-mono">{stats.totalSkills}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#06b6d4] transition-colors">
                          Technical Skills
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          3D Canvas & Tech Cloud Stack
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-300">Manage</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>

                  {/* Item 3: CV & Experience */}
                  <Link
                    to="/admin/cv"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none" stroke="#d946ef" strokeWidth="3"
                            strokeDasharray="88" strokeDashoffset="24"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-mono">{stats.totalExperiences}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#d946ef] transition-colors">
                          Career Progression
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          Timeline Roles & Education
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-300">Manage</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>

                  {/* Item 4: Ambient Soundtrack */}
                  <Link
                    to="/admin/tracks"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3"
                            strokeDasharray="88" strokeDashoffset={88 - (88 * (activeTracksRate || 20)) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white font-mono">{stats.activeTracks}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#10b981] transition-colors">
                          Audio Soundtracks
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {stats.activeTracks} of {stats.totalTracks} Active in Player
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-300">Manage</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bento Card 5: Database Distribution Donut (col-span-3) */}
              <div className="lg:col-span-3 bg-[#121218] border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-white/10 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      CMS Distribution
                    </h3>
                    <span className="text-zinc-500 text-xs font-mono">All Entities</span>
                  </div>
                  <p className="text-xs text-zinc-400">Total database records proportion</p>
                </div>

                {/* Donut Chart SVG (matching Finity "All Expenses" widget) */}
                <div className="my-4 flex flex-col items-center justify-center relative">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Segment 1: Projects (Violet) */}
                      <circle
                        cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="12"
                        strokeDasharray="238.7" strokeDashoffset="90"
                        strokeLinecap="round"
                      />
                      {/* Segment 2: Skills (Cyan) */}
                      <circle
                        cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12"
                        strokeDasharray="238.7" strokeDashoffset="170"
                        strokeLinecap="round"
                      />
                      {/* Segment 3: Experiences (Fuchsia) */}
                      <circle
                        cx="50" cy="50" r="38" fill="none" stroke="#d946ef" strokeWidth="12"
                        strokeDasharray="238.7" strokeDashoffset="210"
                        strokeLinecap="round"
                      />
                      {/* Segment 4: Tracks (Emerald) */}
                      <circle
                        cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12"
                        strokeDasharray="238.7" strokeDashoffset="230"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Donut Center Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">Total</span>
                      <span className="text-xl font-extrabold text-white leading-none mt-0.5">
                        {totalEntities}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                    <span>Projects ({stats.totalProjects})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                    <span>Skills ({stats.totalSkills})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#d946ef]" />
                    <span>Experience ({stats.totalExperiences})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span>Tracks ({stats.totalTracks})</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 6: Recent Inbound Inquiries (col-span-4) */}
              <div className="lg:col-span-4 bg-[#121218] border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-white/10 transition-all shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8b5cf6]" />
                    <h3 className="text-base font-bold text-white tracking-tight">Recent Inquiries</h3>
                  </div>
                  <Link
                    to="/admin/messages"
                    className="text-xs font-mono text-[#06b6d4] hover:underline flex items-center gap-1"
                  >
                    <span>Inbox ({stats.unreadMessages})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {recentMessages.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">No inquiries logged yet</p>
                    <p className="text-[11px] text-zinc-600">Visitor messages stream here in real time</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recentMessages.slice(0, 3).map((msg) => (
                      <Link
                        key={msg.id}
                        to="/admin/messages"
                        className={`block p-3 rounded-2xl border transition-all hover:scale-[1.01] ${
                          !msg.is_read
                            ? 'bg-[#1a1a24] border-[#8b5cf6]/40 shadow-sm'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Sender Avatar Circle */}
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                              {msg.sender_name?.[0]?.toUpperCase() || 'M'}
                            </div>
                            <span className="text-xs font-bold text-zinc-200 truncate">
                              {msg.sender_name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 pl-8">
                          {msg.message}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* View Full Inbox Action */}
                <div className="pt-2">
                  <Link
                    to="/admin/messages"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Open Message Center</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
