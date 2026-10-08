import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import dlLogo from '../../assets/images/dl-logo.png'

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
          {/* Top-Left: Logo */}
          <a href="#" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105">
            <img 
              src={dlLogo} 
              alt="DL Logo" 
              className="w-10 h-10 object-contain rounded-lg shadow-sm group-hover:opacity-90" 
            />
          </a>

          {/* Far Right: Clean Minimalist Navigation Links (No Hire Me button) */}
          <div className="flex items-center gap-8 ml-auto">
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-black/80 border border-white/[0.08] text-zinc-300 hover:text-white focus:outline-none"
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
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
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
