import React from 'react'
import { Github, Linkedin, Twitter, Mail, ArrowUp, Heart } from 'lucide-react'

export const Footer = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = profile?.social_links || {
    github: 'https://github.com/dzakiluqman',
    linkedin: 'https://linkedin.com/in/dzakiluqman',
    twitter: 'https://twitter.com/dzakiluqman',
    email: 'dzakiluqman@example.com'
  }

  return (
    <footer className="border-t border-slate-800/80 bg-dark-950 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {profile?.full_name || 'Dzaki Luqman'}
              </span>
            </h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {profile?.headline || 'Senior Fullstack Software Engineer specializing in modern web architecture, distributed systems, and delightful developer tooling.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
                  aria-label="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#projects" className="hover:text-indigo-400 transition-colors">Featured Projects</a></li>
              <li><a href="#experience" className="hover:text-indigo-400 transition-colors">Work Experience</a></li>
              <li><a href="#skills" className="hover:text-indigo-400 transition-colors">Tech Stack & Skills</a></li>
              <li><a href="#education" className="hover:text-indigo-400 transition-colors">Education & Certs</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Get in Touch</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Engineered with Vite, React 18, Supabase PostgreSQL, Row-Level-Security, and Tailwind CSS.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-md text-slate-300">Vite + React</span>
              <span className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-md text-emerald-400">Supabase</span>
              <span className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-md text-cyan-400">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile?.full_name || 'Dzaki Luqman'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & clean code
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Scroll to Top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
