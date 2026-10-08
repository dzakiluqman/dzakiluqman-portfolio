import React, { useRef, useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'

// Lazy load heavy 3D avatar component to avoid blocking initial DOM paint
const Avatar3DMale = lazy(() => import('./Avatar3DMale'))

// Helper to generate a crisp, smooth antialiased circular texture for points
function createCircleTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.85)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Clean White Circular Particle Field (Dense, Round & Clean ambient halo)
function ParticleField({ count = 280 }) {
  const circleTexture = useMemo(() => createCircleTexture(), [])

  const [positions] = useState(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 0.45 + 1.8 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = radius * Math.cos(phi)
    }
    return p
  })

  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.025
      ref.current.rotation.x += delta * 0.012
    }
  })

  return (
    <points ref={ref} frustumCulled={false} key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#ffffff"
        map={circleTexture}
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const Hero3D = ({ profile }) => {
  const containerRef = useRef(null)
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = profile?.headline || 'Junior Software Developer'
  const bio = profile?.bio || 'An enthusiastic, fast-learning Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.'
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const socialLinks = {
    github: profile?.social_links?.github || 'https://github.com/dzakiluqman',
    linkedin: profile?.social_links?.linkedin || 'https://linkedin.com/in/dzakiluqman',
    email: profile?.social_links?.email || 'dzakiluqman275@gmail.com'
  }

  // Dynamic responsive viewport tracking for Three.js scaling across mobile, tablet, and desktop resolutions
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }))

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
        {/* Ambient lighting glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-neon-cyan/15 via-indigo-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px]" />

        {/* ONLY Giant Display Name Stack strictly BEHIND the 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center leading-none"
        >
          {/* Line 1: DZAKII */}
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight text-white/90 leading-[0.84] drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
            DZAKII
          </span>

          {/* Line 2: LUQMAN FAID */}
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight text-white/90 leading-[0.84] drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)] mt-1 sm:mt-2">
            LUQMAN FAID
          </span>

          {/* Spacer matching subtitle height for layout parity */}
          <div className="h-6 sm:h-8 mt-2 sm:mt-3 invisible" aria-hidden="true">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-mono uppercase tracking-[0.28em]">
              {headline}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* LAYER 2 (z-10): 3D Model Canvas (Naturally Occludes the Name)  */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <Canvas
          eventSource={containerRef}
          camera={cameraConfig}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'mediump',
            depth: true,
            stencil: false,
          }}
          className="w-full h-full"
        >
          {/* Efficient Studio Soft Lighting: 1 ambient light and 1 soft directional light */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[2.5, 3.5, 2.5]} intensity={1.1} color="#fff6eb" />

          <Suspense fallback={null}>
            <ParticleField />
            <Float speed={1.8} rotationIntensity={0.03} floatIntensity={0.04}>
              <Avatar3DMale scale={avatarScale} />
            </Float>
          </Suspense>
        </Canvas>
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
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight leading-[0.84]">
            DZAKII
          </span>
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem] font-black uppercase tracking-tight leading-[0.84] mt-1 sm:mt-2">
            LUQMAN FAID
          </span>
        </div>

        {/* Foreground subtitle directly below LUQMAN FAID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 sm:mt-3 pointer-events-none text-center px-4"
        >
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-mono uppercase tracking-[0.28em] text-neon-cyan font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {headline.toUpperCase()}
          </span>
        </motion.div>
      </div>

      {/* 1. Bottom-Left: Borderless Social Media Icon Links */}
      <div className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 flex items-center gap-5 md:gap-4 z-20 pointer-events-auto text-slate-400">
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-cyan hover:opacity-100 opacity-70 transition-all p-1 text-slate-400"
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
            className="hover:text-neon-cyan hover:opacity-100 opacity-70 transition-all p-1 text-slate-400"
            aria-label="LinkedIn"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socialLinks.email && (
          <a
            href={`mailto:${socialLinks.email}`}
            className="hover:text-neon-cyan hover:opacity-100 opacity-70 transition-all p-1 text-slate-400"
            aria-label="Email"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* 2. Bottom-Center: Clean Text-Only CTA Links */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-5 sm:gap-6 md:gap-8 z-20 pointer-events-auto whitespace-nowrap text-xs sm:text-sm font-medium">
        <button
          onClick={() => scrollToSection('projects')}
          className="group text-slate-300 hover:text-neon-cyan transition-colors flex items-center gap-1.5"
        >
          <span>Explore Projects</span>
          <span className="text-neon-cyan group-hover:translate-y-0.5 transition-transform">↓</span>
        </button>

        <button
          onClick={() => scrollToSection('contact')}
          className="group text-slate-300 hover:text-neon-cyan transition-colors flex items-center gap-1.5"
        >
          <span>Get in touch</span>
          <span className="text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </button>

        <button
          onClick={() => scrollToSection('experience')}
          className="group text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>View Resume</span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </button>
      </div>

      {/* 3. Bottom-Right: Clean Floating Status Line */}
      <div className="absolute top-6 md:top-auto md:bottom-6 right-6 md:right-10 flex items-center gap-2 text-xs text-slate-400 z-20 pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300">Available for work</span>
        <span className="text-slate-600">·</span>
        <span>{location}</span>
      </div>
    </section>
  )
}

export default Hero3D
