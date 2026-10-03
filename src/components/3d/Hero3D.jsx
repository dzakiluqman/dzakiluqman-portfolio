import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { MapPin, ArrowDown, Github, Linkedin, Mail, Sparkles, Send, FileText, CheckCircle2 } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

// Ambient Particle Field
function ParticleField({ count = 450 }) {
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
        size={0.024}
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
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 lg:py-24 overflow-hidden cyber-grid">
      {/* Background ambient particle canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: false, alpha: true }}
          className="w-full h-full"
        >
          <ParticleField count={380} />
        </Canvas>
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Content Container - Centered Focal Point Architecture */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col items-center">
        
        {/* Top Centered Header: Status Badge, Headline, Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-2">
          {/* Status Badge - Human & Modern */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-medium backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Available for Opportunities</span>
          </motion.div>

          {/* Name & Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]"
          >
            {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-neon-cyan via-slate-100 to-indigo-400 bg-clip-text text-transparent"
          >
            {headline}
          </motion.p>
        </div>

        {/* Centerpiece Stage: Balanced 3-Column Symmetrical Hero with Centered 3D Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-4 sm:my-6 w-full">
          
          {/* Left Flank Card: Bio Description & Core Focus */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex flex-col justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl shadow-xl h-[360px] text-left lg:col-span-3"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                <span>About & Focus</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {bio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-xs text-slate-400 font-mono font-medium">Core Stack</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/60">React & Vite</span>
                <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-800/90 text-neon-cyan border border-neon-cyan/30">Tailwind CSS</span>
                <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-800/90 text-indigo-300 border border-indigo-500/30">Node & APIs</span>
              </div>
            </div>
          </motion.div>

          {/* Center Stage: Dead-Center 3D Human Head Topology Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="lg:col-span-6 h-[380px] sm:h-[440px] lg:h-[480px] w-full relative flex items-center justify-center"
          >
            {/* Ambient Radial Spotlight Backing */}
            <div className="absolute inset-0 max-w-[340px] max-h-[340px] m-auto bg-gradient-to-tr from-neon-cyan/20 via-indigo-600/15 to-neon-violet/20 rounded-full blur-[90px] pointer-events-none" />

            {/* 3D WebGL Canvas */}
            <Canvas
              camera={{ position: [0, 0, 4.0], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full cursor-grab active:cursor-grabbing z-10"
            >
              <ambientLight intensity={0.95} />
              <directionalLight position={[4, 6, 5]} intensity={1.4} color="#ffffff" />
              <pointLight position={[3, 2, 3]} intensity={2.0} color="#00f2fe" />
              <pointLight position={[-3, 2, 2.5]} intensity={1.6} color="#818cf8" />
              <pointLight position={[0, -2.5, 3]} intensity={0.8} color="#38bdf8" />

              <Suspense fallback={null}>
                <ParticleField count={220} />
                <Float speed={2.0} rotationIntensity={0.15} floatIntensity={0.35}>
                  <Avatar3DMale scale={1.22} />
                </Float>
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Right Flank Card: Location, Availability & Quick Connect */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex flex-col justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl shadow-xl h-[360px] text-left lg:col-span-3"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono text-neon-cyan mb-1.5 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span>Based In</span>
                </div>
                <p className="text-base font-bold text-white">
                  {location}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Timezone: UTC+7 (WIB)
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Availability</span>
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Open to Junior Developer Roles
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full-time, contract, or collaborative work
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-neon-cyan" />
                <span>Say Hello</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Mobile & Tablet Fallback View (< lg): Centered Location & Bio Box */}
        <div className="lg:hidden max-w-xl mx-auto space-y-3 text-center my-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span>{location}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Bottom Centered Controls: Call to Action Buttons & Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center gap-5 mt-2"
        >
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="relative group px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:shadow-neon-cyan/80 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 font-mono font-bold"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center gap-2 font-mono font-medium"
            >
              <span>Contact Me</span>
              <Send className="w-3.5 h-3.5 text-neon-cyan" />
            </button>

            <button
              onClick={() => scrollToSection('experience')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 font-mono"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Resume / CV</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-1">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
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
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-slate-700 hover:bg-slate-800 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 hover:bg-slate-800 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero3D
