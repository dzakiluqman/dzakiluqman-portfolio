import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowUp, Shield } from 'lucide-react'

export const Footer = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = profile?.social_links || {
    github: 'https://github.com/dzakiluqman',
    linkedin: 'https://linkedin.com/in/dzakiluqman',
    email: 'dzakiluqman275@gmail.com'
  }

  const navLinks = [
    { label: 'Featured Projects', href: '#projects' },
    { label: 'Technical Competencies', href: '#skills' },
    { label: 'Career Progression', href: '#experience' },
    { label: "Let's Connect", href: '#contact' },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#000000] pt-16 pb-12 text-zinc-400">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Editorial Layout: 3 Columns (Left: Branding, Center: Navigation, Right: Social) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 items-start">
          {/* Left: Branding & Bio */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-base font-semibold text-zinc-100 tracking-wider uppercase font-sans">
              {profile?.full_name?.toUpperCase() || 'DZAKII LUQMAN FAID'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-sans">
              {profile?.headline || 'Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.'}
            </p>
          </div>

          {/* Center: Quick Navigation Text Links */}
          <div className="md:col-span-4 space-y-3">
            <span className="block text-xs font-sans font-medium text-zinc-500 uppercase tracking-wider">
              Navigation
            </span>
            <ul className="space-y-2 text-xs font-sans">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                >
                  <Shield className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 transition-colors duration-200" />
                  <span>CMS Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Social Links with standardized arrow translate */}
          <div className="md:col-span-3 space-y-3">
            <span className="block text-xs font-sans font-medium text-zinc-500 uppercase tracking-wider">
              Network
            </span>
            <ul className="space-y-2 text-xs font-sans">
              {socialLinks.github && (
                <li>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                  </a>
                </li>
              )}
              {socialLinks.linkedin && (
                <li>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                  </a>
                </li>
              )}
              {socialLinks.email && (
                <li>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="group inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    <span>Email</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom: Clean Copyright Metadata and Location / Time Stamp */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <p>© {currentYear} {profile?.full_name || 'Dzakii Luqman Faid'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>{profile?.location || 'Kota Magelang, Indonesia'} · UTC+7</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              title="Scroll to Top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
