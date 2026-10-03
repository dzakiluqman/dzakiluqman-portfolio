import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { MapPin, ArrowDown, Github, Linkedin, Mail, Sparkles, Send } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

// Ambient Cyber Particle Field
function CyberParticleField({ count = 600 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 9 * Math.cbrt(Math.random())
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
      ref.current.rotation.y += delta * 0.02
      ref.current.rotation.x += delta * 0.01
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
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export const Hero3D = ({ profile }) => {
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = profile?.headline || 'Junior Software Developer'
  const bio = profile?.bio || 'An enthusiastic, fast-learning Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.'
  const location = profile?.location || 'Kota Magelang, Indonesia'
  const socialLinks = profile?.social_links || {}

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-24 lg:pb-16 overflow-hidden cyber-grid">
      {/* Background ambient particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: false, alpha: true }}
          className="w-full h-full"
        >
          <CyberParticleField count={450} />
        </Canvas>
      </div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none z-10" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Content Container - Vertically Centered */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clean Typography, Role, Location, Bio & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-neon-cyan/30 text-neon-cyan text-xs font-mono tracking-widest uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span>READY_FOR_HIRE // JUNIOR DEV</span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-violet bg-clip-text text-transparent">
                {headline}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-mono">
              <MapPin className="w-4 h-4 text-neon-cyan shrink-0" />
              <span>{location}</span>
            </div>

            {/* Bio Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              {bio}
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="relative group px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:shadow-neon-cyan/80 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 font-mono font-bold"
              >
                <span>Explore Projects</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-slate-800 transition-all flex items-center gap-2 font-mono font-medium"
              >
                <span>Contact Me</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clean Social Links */}
            <div className="flex items-center gap-3 pt-3">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-neon-cyan/20 transition-all"
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
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-neon-blue hover:border-neon-blue/40 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-neon-emerald hover:border-neon-emerald/40 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: Stylized 3D Human Face / Head Topology Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-5 h-[380px] sm:h-[460px] lg:h-[540px] w-full relative flex items-center justify-center"
          >
            <Canvas
              camera={{ position: [0, 0, 4.3], fov: 46 }}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <ambientLight intensity={0.85} />
              <directionalLight position={[5, 8, 6]} intensity={1.6} color="#ffffff" />
              <pointLight position={[3.5, 2.5, 3]} intensity={2.8} color="#00f2fe" />
              <pointLight position={[-3.5, 2.5, 2]} intensity={2.2} color="#a855f7" />
              <pointLight position={[0, -2, 4]} intensity={1.2} color="#10b981" />

              <Suspense fallback={null}>
                <CyberParticleField count={250} />
                <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
                  <Avatar3DMale scale={1.22} />
                </Float>
              </Suspense>
            </Canvas>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero3D
