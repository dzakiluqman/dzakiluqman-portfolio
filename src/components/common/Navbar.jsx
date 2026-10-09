import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import dlLogo from '../../assets/images/dl-logo.png'

export const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Projects', href: '/#projects', id: 'projects' },
    { name: 'Experience', href: '/#experience', id: 'experience' },
    { name: 'Skills', href: '/#skills', id: 'skills' },
    { name: 'Get in touch', href: '/#contact', id: 'contact' },
  ]

  // Track window scroll for background backdrop blur & active scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Calculate which section is active based on viewport position
      const scrollPosition = window.scrollY + 140
      const sectionElements = navLinks
        .map(link => ({ id: link.id, element: document.getElementById(link.id) }))
        .filter(item => item.element !== null)

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i]
        if (element.offsetTop <= scrollPosition) {
          setActiveSection(id)
          return
        }
      }

      if (window.scrollY < 200) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (href, id) => {
    setIsOpen(false)
    setActiveSection(id)

    if (location.pathname !== '/') {
      window.location.href = href
      return
    }

    const elem = document.getElementById(id)
    if (elem) {
      // 80px offset guarantees fixed navbar never overlaps section titles
      const yOffset = -80
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Top-Left: Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActiveSection('')
              }
            }}
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
          >
            <img 
              src={dlLogo} 
              alt="DL Logo" 
              className="w-10 h-10 object-contain rounded-lg shadow-sm group-hover:opacity-90" 
            />
          </a>

          {/* Far Right: Clean Minimalist Navigation Links with Active Scroll-Spy */}
          <div className="flex items-center gap-6 lg:gap-8 ml-auto">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id

                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href, link.id)}
                    className={`relative text-xs lg:text-sm font-sans tracking-wide transition-colors py-1 focus:outline-none ${
                      isActive 
                        ? 'text-white font-medium' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] rounded-full animate-in fade-in duration-200" />
                    )}
                  </button>
                )
              })}
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
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id

            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-sans transition-all flex items-center justify-between ${
                  isActive
                    ? 'text-white bg-white/[0.08] font-medium border-l-2 border-white'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}

export default Navbar
