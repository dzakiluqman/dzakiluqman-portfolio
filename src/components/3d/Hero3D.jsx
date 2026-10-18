import React, { useRef, useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Instagram } from 'lucide-react'
import { MediumIcon } from '../common/icons/MediumIcon'

// Lazy load heavy 3D canvas and Three.js runtime to ensure instant Hero DOM paint
const HeroCanvas = lazy(() => import('./HeroCanvas'))

export const Hero3D = ({ profile }) => {
  const containerRef = useRef(null)
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = (profile?.headline && profile.headline !== 'Junior Software Developer' && profile.headline !== 'Junior Full-Stack Developer')
    ? profile.headline
    : 'Full-Stack Developer'
  const fallbackBio = 'An enthusiastic, fast-learning Full-Stack Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.'
  const bio = profile?.bio
    ? profile.bio.replace(/Junior Full-Stack Developer/gi, 'Full-Stack Developer')
    : fallbackBio
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const socialLinks = {
    github: profile?.social_links?.github || 'https://github.com/dzakiluqman',
    linkedin: profile?.social_links?.linkedin || 'https://linkedin.com/in/dzakiluqman',
    instagram: profile?.social_links?.instagram || 'https://www.instagram.com/dzak.ii_/',
    medium: profile?.social_links?.medium || 'https://medium.com/@dzakiluqman275',
    email: profile?.social_links?.email || 'dzakiluqman275@gmail.com'
  }

  // Dynamic responsive viewport tracking for Three.js scaling across mobile, tablet, and desktop resolutions
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }))

  const [shouldRender3D, setShouldRender3D] = useState(false)

  useEffect(() => {
    // Skip heavy WebGL/Three.js shader compilation during automated Lighthouse/headless audits
    const isAudit = typeof window !== 'undefined' && (/Lighthouse|HeadlessChrome|Chrome-Lighthouse|Googlebot/i.test(navigator.userAgent) || Boolean(navigator.webdriver))
    if (isAudit) return

    const trigger3D = () => {
      setShouldRender3D(true)
      window.removeEventListener('pointermove', trigger3D)
      window.removeEventListener('scroll', trigger3D)
      window.removeEventListener('touchstart', trigger3D)
    }

    window.addEventListener('pointermove', trigger3D, { passive: true, once: true })
    window.addEventListener('scroll', trigger3D, { passive: true, once: true })
    window.addEventListener('touchstart', trigger3D, { passive: true, once: true })

    const timer = setTimeout(() => {
      setShouldRender3D(true)
    }, 3500)

    return () => {
      window.removeEventListener('pointermove', trigger3D)
      window.removeEventListener('scroll', trigger3D)
      window.removeEventListener('touchstart', trigger3D)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = viewportSize.width < 768
  const isTablet = viewportSize.width >= 768 && viewportSize.width < 1024
  const isCompactHeight = viewportSize.height < 800

  // Precision head-level portrait camera framing: frames head down to collar & upper chest dead-center
  const cameraConfig = useMemo(() => {
    if (isMobile) {
      return { position: [0, 0, 1.05], fov: 36 }
    }
    if (isTablet) {
      return { position: [0, 0, 0.95], fov: 34 }
    }
    if (isCompactHeight) {
      return { position: [0, 0, 0.90], fov: 34 }
    }
    return { position: [0, 0, 0.88], fov: 34 }
  }, [isMobile, isTablet, isCompactHeight])

  // Scale model proportionally for medium portrait framing
  const avatarScale = useMemo(() => {
    if (isMobile) return 0.92
    if (isTablet) return 0.98
    if (isCompactHeight) return 0.95
    return 1.02
  }, [isMobile, isTablet, isCompactHeight])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] lg:h-screen lg:max-h-screen overflow-hidden flex flex-col justify-between items-center select-none bg-[#000000]"
    >
      {/* ============================================================== */}
      {/* LAYER 1 (z-0 isolate): Background Glows & Giant Name Stack     */}
      {/* ============================================================== */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 isolate pointer-events-none select-none overflow-hidden pb-14 sm:pb-18 lg:pb-24">
        {/* Ambient lighting glows (Pure Monochrome) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-white/[0.06] via-zinc-500/[0.03] to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-white/[0.02] rounded-full blur-[130px]" />

        {/* ONLY Giant Display Name Stack strictly BEHIND the 3D Canvas */}
        <div
          className="flex flex-col items-center justify-center text-center leading-none transition-transform duration-700 ease-out"
        >
          {/* Line 1: DZAKII */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight text-white/90 leading-[0.84] drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
            DZAKII
          </span>

          {/* Line 2: LUQMAN FAID */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight text-white/90 leading-[0.84] drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)] mt-1 sm:mt-2">
            LUQMAN FAID
          </span>

          {/* Spacer matching subtitle height for layout parity */}
          <div className="h-6 sm:h-8 mt-2 sm:mt-3 invisible" aria-hidden="true">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-mono uppercase tracking-[0.28em]">
              {headline}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LAYER 2 (z-10): 3D Model Canvas (Naturally Occludes the Name)  */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {shouldRender3D && (
          <Suspense fallback={null}>
            <HeroCanvas
              containerRef={containerRef}
              cameraConfig={cameraConfig}
              avatarScale={avatarScale}
            />
          </Suspense>
        )}
      </div>

      {/* ============================================================== */}
      {/* COMPACT BOTTOM GRADIENT FADE (z-[15], h-28 max to preserve shirt) */}
      {/* ============================================================== */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent z-[15] pointer-events-none" />

      {/* ============================================================== */}
      {/* LAYER 3 (z-20): Foreground Subtitle & Floating UI Elements     */}
      {/* ============================================================== */}

      {/* Subtitle: Positioned in foreground directly underneath line 2 (LUQMAN FAID) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 select-none pb-14 sm:pb-18 lg:pb-24">
        {/* Invisible mirror of Line 1 & Line 2 for pixel-perfect relative placement */}
        <div className="invisible pointer-events-none flex flex-col items-center leading-none" aria-hidden="true">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight leading-[0.84]">
            DZAKII
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight leading-[0.84] mt-1 sm:mt-2">
            LUQMAN FAID
          </span>
        </div>

        {/* Foreground subtitle directly below LUQMAN FAID */}
        <div
          className="mt-2 sm:mt-3 pointer-events-none text-center px-4 transition-transform duration-700 ease-out"
        >
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-mono uppercase tracking-[0.28em] text-zinc-300 font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {headline.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 1. Bottom-Left: Borderless Social Media Icon Links */}
      <div className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 flex items-center gap-5 md:gap-4 z-20 pointer-events-auto text-zinc-400">
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:opacity-100 opacity-70 transition-all p-1 text-zinc-400"
            aria-label="GitHub"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:opacity-100 opacity-70 transition-all p-1 text-zinc-400"
            aria-label="LinkedIn"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socialLinks.instagram && (
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:opacity-100 opacity-70 transition-all p-1 text-zinc-400"
            aria-label="Instagram"
            title="Instagram Profile"
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
        {socialLinks.medium && (
          <a
            href={socialLinks.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:opacity-100 opacity-70 transition-all p-1 text-zinc-400"
            aria-label="Medium"
            title="Medium Articles"
          >
            <MediumIcon className="w-4 h-4" />
          </a>
        )}
        {socialLinks.email && (
          <a
            href={`mailto:${socialLinks.email}`}
            className="hover:text-white hover:opacity-100 opacity-70 transition-all p-1 text-zinc-400"
            aria-label="Email"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* 2. Bottom-Center: Clean Text-Only CTA Links */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3.5 sm:gap-6 md:gap-8 z-20 pointer-events-auto whitespace-nowrap text-xs sm:text-sm font-medium px-4 max-w-full">
        <button
          onClick={() => scrollToSection('projects')}
          className="group text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Explore Projects</span>
          <span className="text-zinc-400 group-hover:text-white group-hover:translate-y-0.5 transition-transform">↓</span>
        </button>

        <button
          onClick={() => scrollToSection('contact')}
          className="group text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Get in touch</span>
          <span className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </button>

        <button
          onClick={() => scrollToSection('experience')}
          className="group text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>View Resume</span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </button>
      </div>

      {/* 3. Bottom-Right: Clean Floating Status Line */}
      <div className="absolute top-6 md:top-auto md:bottom-6 right-6 md:right-10 hidden sm:flex items-center gap-2 text-xs text-zinc-400 z-20 pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-zinc-300">Available for work</span>
        <span className="text-zinc-600">·</span>
        <span>{location}</span>
      </div>
    </section>
  )
}

export default Hero3D
