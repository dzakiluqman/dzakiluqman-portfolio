import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Terminal, Shield, ArrowUpRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Skills & Education', href: '/#skills' },
    { name: 'Contact', href: '/#contact' },
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5 font-mono">
                Dzakii Luqman Faid
                <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-ping" title="Available for projects"></span>
              </span>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">Senior Fullstack</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-all"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400 transition-all shadow-sm group"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              <span>{user ? 'Admin Dashboard' : 'CMS Admin'}</span>
              <ArrowUpRight className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <button
              onClick={() => handleNavClick('/#contact')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-95 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400"
              title="CMS Admin"
            >
              <Shield className="w-4 h-4" />
            </Link>
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
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 text-indigo-300 border border-indigo-500/20"
            >
              {user ? 'Go to Admin Dashboard' : 'Open CMS Admin Login'}
            </Link>
            <button
              onClick={() => handleNavClick('/#contact')}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-brand-primary text-white shadow-lg shadow-indigo-600/30"
            >
              Contact Me
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
