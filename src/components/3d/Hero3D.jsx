import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

// Primary Ambient Particle Field (Dense & Dynamic)
function ParticleField({ count = 900 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 10 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = radius * Math.cos(phi)
    }
    return p
  }, [count])

  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.038
      ref.current.rotation.x += delta * 0.022
    }
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f2fe"
        size={0.026}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Secondary Faster Orbit Particle Layer (Continuous Flow & Dual-Tone Depth)
function DriftParticles({ count = 350 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 6.5 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = radius * Math.cos(phi)
    }
    return p
  }, [count])

  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.05
      ref.current.rotation.z += delta * 0.025
    }
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.028}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export const Hero3D = ({ profile }) => {
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = profile?.headline || 'Junior Software Developer'
  const bio = profile?.bio || 'An enthusiastic, fast-learning Junior Software Developer building modern web applications with React, Tailwind CSS, and cloud backends.'
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const socialLinks = profile?.social_links || {}

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden cyber-grid">
      {/* Fullscreen Cyberpunk Grid Background Layer across 100vw / 100vh */}
      <div className="absolute inset-0 w-full h-full cyber-grid opacity-85 pointer-events-none -z-20" />

      {/* Subtle ambient lighting glows behind grid and 3D canvas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-neon-cyan/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Fullscreen 3D Canvas spanning 100vw by 100vh with centered 3D Head and dense particle field */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 4.0], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.95} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} color="#ffffff" />
          <pointLight position={[3, 2, 3]} intensity={2.0} color="#00f2fe" />
          <pointLight position={[-3, 2, 2.5]} intensity={1.6} color="#818cf8" />
          <pointLight position={[0, -2.5, 3]} intensity={0.8} color="#38bdf8" />

          <Suspense fallback={null}>
            <ParticleField count={900} />
            <DriftParticles count={350} />
            <Float speed={2.0} rotationIntensity={0.12} floatIntensity={0.3}>
              <Avatar3DMale scale={1.25} />
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {/* Top Section: Raw Minimalist Typography (Zero cards or containers) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-3xl mx-auto space-y-2 pointer-events-auto"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Available for work</span>
          <span className="text-slate-600">•</span>
          <span>{location}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none pt-1">
          {name}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300">
          {headline}
        </p>
      </motion.div>

      {/* Center Spacer: Dedicated Breathing Room for Dead-Center 3D Head */}
      <div className="flex-1 w-full min-h-[220px] sm:min-h-[280px] md:min-h-[340px] pointer-events-none" />

      {/* Bottom Section: Bio, Text-Based Links, Standalone Clean Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 text-center max-w-xl mx-auto space-y-5 pointer-events-auto"
      >
        {/* Short About Bio (1-2 sentences) */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {bio}
        </p>

        {/* Text-Based Action Links (No background, No border, No card) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-1 text-sm font-medium">
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

        {/* Raw Social Icons (Standalone clean icons only: no background boxes, circles, or pills) */}
        <div className="flex items-center justify-center gap-6 pt-1 text-slate-400">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={`mailto:${socialLinks.email}`}
              className="hover:text-white transition-colors p-1"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}

export default Hero3D
