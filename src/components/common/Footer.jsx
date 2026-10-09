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
    twitter: 'https://twitter.com/dzakiluqman',
    email: 'dzakiluqman275@gmail.com'
  }

  const navLinks = [
    { label: 'Featured Projects', href: '#projects' },
    { label: 'Career Progression', href: '#experience' },
    { label: 'Technical Competencies', href: '#skills' },
    { label: "Let's Connect", href: '#contact' },
  ]

  const techStack = [
    { name: 'React 18 & Three.js', desc: 'Spatial 3D & WebGL Canvas' },
    { name: 'Tailwind CSS & Framer Motion', desc: 'Liquid-Glass Design System' },
    { name: 'Supabase & PostgreSQL', desc: 'Realtime Data Layer' },
    { name: 'Vite & Cloudflare Edge', desc: 'Ultra-fast Compilation' },
  ]

  return (
    <footer className="bg-[#000000] pt-20 pb-12 text-zinc-400 overflow-hidden relative border-t border-white/[0.05]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* 1. TOP SECTION: Organized Link Columns (Navigation, Socials, Tech Stack) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-16">
          {/* Column 1: Navigation */}
          <div className="md:col-span-4 space-y-4">
            <span className="block text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">
              Navigation
            </span>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors duration-200"
                >
                  <Shield className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors duration-200" />
                  <span>CMS Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Socials & Network */}
          <div className="md:col-span-4 space-y-4">
            <span className="block text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">
              Socials
            </span>
            <ul className="space-y-2.5">
              {socialLinks.github && (
                <li>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </li>
              )}
              {socialLinks.linkedin && (
                <li>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </li>
              )}
              {socialLinks.twitter && (
                <li>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200"
                  >
                    <span>Twitter / X</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </li>
              )}
              {socialLinks.email && (
                <li>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm transition-colors duration-200"
                  >
                    <span>Direct Email</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Tech Stack */}
          <div className="md:col-span-4 space-y-4">
            <span className="block text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">
              Tech Stack
            </span>
            <ul className="space-y-2.5">
              {techStack.map((tech) => (
                <li key={tech.name} className="space-y-0.5">
                  <span className="block text-sm text-zinc-400 font-medium">
                    {tech.name}
                  </span>
                  <span className="block text-xs text-zinc-600">
                    {tech.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: Massive Display Typography with Liquid Text Fill Effect */}
        <div className="py-10 md:py-16 text-center select-none overflow-hidden relative">
          <h1 className="font-extrabold tracking-tighter leading-none text-center select-none text-5xl sm:text-7xl md:text-[10rem] lg:text-[13rem] liquid-text-sheen drop-shadow-[0_10px_35px_rgba(255,255,255,0.05)] font-sans">
            dzakiluqman
          </h1>
        </div>

        {/* 3. BOTTOM SECTION: Copyright Line & Back to Top */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 text-center sm:text-left">
            © 2026 Dzakii Luqman Faid. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
