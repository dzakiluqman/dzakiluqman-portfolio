import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

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
    <section className="relative w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 min-h-[100dvh] lg:h-screen lg:max-h-screen lg:overflow-hidden pt-20 sm:pt-24 lg:pt-20 xl:pt-24 pb-8 sm:pb-12 lg:pb-8 xl:pb-10 overflow-x-hidden">
      {/* Subtle ambient lighting glows behind 3D canvas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-neon-cyan/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Fullscreen 3D Canvas with soft bottom alpha mask for seamless torso fade */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0) 88%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0) 88%)'
        }}
      >
        <Canvas
          camera={cameraConfig}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {/* Studio Soft Lighting: Balanced ambient, warm key light, cool soft fill, subtle rim */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[2.5, 3.5, 2.5]} intensity={1.1} color="#fff6eb" />
          <directionalLight position={[-2.5, 2.0, 2.0]} intensity={0.45} color="#e0f2fe" />
          <directionalLight position={[0, 3.0, -2.5]} intensity={0.4} color="#f8fafc" />

          <Suspense fallback={null}>
            <ParticleField />
            <Float speed={1.8} rotationIntensity={0.03} floatIntensity={0.04}>
              <Avatar3DMale scale={avatarScale} />
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {/* Bottom edge seamless gradient fade dissolving lower torso into the dark background */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 lg:h-64 bg-gradient-to-t from-[#06080f] via-[#06080f]/80 to-transparent pointer-events-none z-[1]" />

      {/* Top Section: Raw Minimalist Typography (Zero cards or containers) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-2 pointer-events-auto px-2"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Available for work</span>
          <span className="text-slate-600">•</span>
          <span>{location}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-none pt-1">
          {name}
        </h1>

        <p className="text-base sm:text-xl lg:text-2xl font-medium text-slate-300">
          {headline}
        </p>
      </motion.div>

      {/* Center Spacer: Dedicated Breathing Room for Dead-Center 3D Head */}
      <div className="flex-1 w-full min-h-[60px] sm:min-h-[120px] lg:min-h-[80px] xl:min-h-[140px] pointer-events-none" />

      {/* Bottom Section: Bio, Text-Based Links, Standalone Clean Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 text-center max-w-xl mx-auto space-y-3.5 sm:space-y-4 lg:space-y-4 xl:space-y-5 pointer-events-auto px-4"
      >
        {/* Short About Bio (1-2 sentences) */}
        <p className="max-w-xs sm:max-w-md md:max-w-xl mx-auto text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
          {bio}
        </p>

        {/* Text-Based Action Links (No background, No border, No card) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-0.5 text-xs sm:text-sm font-medium">
          <button
            onClick={() => scrollToSection('projects')}
            className="group text-slate-200 hover:text-neon-cyan transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <span>Explore Projects</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="group text-slate-200 hover:text-neon-cyan transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('experience')}
            className="group text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <span>View Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Three Raw Social Icons (GitHub, LinkedIn, Email) */}
        <div className="flex items-center justify-center gap-6 pt-1 text-slate-400">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan hover:scale-110 transition-all p-1 text-slate-400"
              aria-label="GitHub"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan hover:scale-110 transition-all p-1 text-slate-400"
              aria-label="LinkedIn"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={`mailto:${socialLinks.email}`}
              className="hover:text-neon-cyan hover:scale-110 transition-all p-1 text-slate-400"
              aria-label="Email"
              title="Send Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}

export default Hero3D
