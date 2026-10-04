import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Skills & Education', href: '/#skills' },
    { name: 'Get in touch', href: '/#contact' },
  ]

  const handleNavClick = (href) => {
    setIsOpen(false)
    if (location.pathname !== '/') {
      window.location.href = href
      return
    }
    const targetId = href.replace('/#', '')
    const elem = document.getElementById(targetId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Top-Left: Clean 1:1 Aspect Ratio Square Logo Placeholder */}
          <Link
            to="/"
            className="w-10 h-10 aspect-square rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center hover:border-slate-700 hover:text-neon-cyan transition-all shrink-0"
            aria-label="Home"
          >
            <span>DL</span>
          </Link>

          {/* Far Right: Clean Minimalist Navigation Links (No Hire Me button) */}
          <div className="flex items-center gap-8 ml-auto">
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
