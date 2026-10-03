import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { MapPin, ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

// Ambient Cyber Particle Field
function CyberParticleField({ count = 900 }) {
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
      ref.current.rotation.y += delta * 0.025
      ref.current.rotation.x += delta * 0.012
    }
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f2fe"
        size={0.028}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export const Hero3D = ({ profile }) => {
  const name = profile?.full_name || 'Dzakii Luqman Faid'
  const headline = profile?.headline || 'Senior Fullstack Software Engineer & Cloud Architect'
  const bio = profile?.bio || 'Passionate full-stack developer engineering resilient web systems, scalable cloud platforms, and intuitive interfaces with modern engineering practices.'
  const location = profile?.location || 'Jakarta, Indonesia'
  const socialLinks = profile?.social_links || {}

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 48 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 6]} intensity={1.5} color="#ffffff" />
          <pointLight position={[3.5, 2, 3]} intensity={2.8} color="#00f2fe" />
          <pointLight position={[-3.5, 2, 2]} intensity={2.2} color="#a855f7" />
          <pointLight position={[0, -2, 4]} intensity={1.2} color="#10b981" />

          <Suspense fallback={null}>
            <CyberParticleField count={800} />
            {/* Uncovered 3D Male Avatar positioned gracefully in 3D scene */}
            <group position={[1.5, -0.2, 0]} className="hidden lg:block">
              <Float speed={2} rotationIntensity={0.25} floatIntensity={0.7}>
                <Avatar3DMale scale={1.28} />
              </Float>
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Clean Foreground Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clean Typography, Bio & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Clean Headline & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-violet bg-clip-text text-transparent">
                {headline}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{location}</span>
            </div>

            {/* Clean Bio Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {bio}
            </p>

            {/* Single Clean Call to Action Button */}
            <div className="pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="relative group px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:shadow-neon-cyan/80 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 font-mono font-bold"
              >
                <span>Explore Projects</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Clean Social Links */}
            <div className="flex items-center gap-3 pt-4">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-neon-cyan/20 transition-all"
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
                  className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-blue hover:border-neon-blue/40 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-emerald hover:border-neon-emerald/40 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: Uncovered Dedicated 3D Canvas Space on Mobile/Tablet */}
          <div className="lg:col-span-5 block lg:hidden h-80 relative">
            <Canvas
              camera={{ position: [0, 0, 4.5], fov: 48 }}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
              <pointLight position={[3, 2, 3]} intensity={2.5} color="#00f2fe" />
              <pointLight position={[-3, 2, 2]} intensity={2.0} color="#a855f7" />

              <Suspense fallback={null}>
                <Float speed={2} rotationIntensity={0.25} floatIntensity={0.6}>
                  <Avatar3DMale scale={1.05} />
                </Float>
              </Suspense>
            </Canvas>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero3D
