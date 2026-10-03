import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, MapPin, Sparkles, FileText, Send } from 'lucide-react'

export const Hero = ({ profile }) => {
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = profile?.headline || 'Junior Software Developer'
  const bio = profile?.bio || 'An enthusiastic, fast-learning Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.'
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const socialLinks = profile?.social_links || {}

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bio & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Available for Opportunities</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1" />
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-mono text-indigo-400 tracking-wide">
                Hi there, I'm
              </h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-slate-200 via-indigo-200 to-violet-300 bg-clip-text text-transparent pt-1">
                {headline}
              </p>
            </div>

            {/* Location & Bio */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{location}</span>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                <span>Explore Featured Work</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Get In Touch</span>
              </button>

              <button
                onClick={() => scrollToSection('experience')}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Interactive CV</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-mono">Connect:</span>
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>

              {/* Main Card */}
              <div className="relative rounded-2xl bg-dark-900/90 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                {/* Header with Terminal dots */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    stack.config.json
                  </span>
                </div>

                {/* Avatar & Key Stats */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-950 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{name}</h3>
                    <p className="text-xs text-indigo-400 font-mono">Senior Engineer</p>
                    <p className="text-xs text-slate-400 mt-1">5+ Yrs Industry Experience</p>
                  </div>
                </div>

                {/* Code-like metrics */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-dark-950/70 p-3 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500">// Core Competencies</span>
                    <div className="mt-1 text-slate-300">
                      <span className="text-indigo-400">const</span> stack = [<br />
                      &nbsp;&nbsp;<span className="text-emerald-400">'React / Next.js'</span>,<br />
                      &nbsp;&nbsp;<span className="text-emerald-400">'TypeScript'</span>,<br />
                      &nbsp;&nbsp;<span className="text-emerald-400">'Supabase / PostgreSQL'</span>,<br />
                      &nbsp;&nbsp;<span className="text-emerald-400">'Cloud Architecture'</span><br />
                      ];
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-2">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-xl font-bold text-indigo-400 font-sans">25+</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Projects Shipped</p>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-xl font-bold text-emerald-400 font-sans">99.9%</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Uptime & Reliability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
