import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Terminal, MapPin, ArrowDown, Send, FileText, Github, Linkedin, Mail, Cpu, Radio, Sparkles } from 'lucide-react'
import Avatar3DMale from './Avatar3DMale'

// Dynamic Cyber Particle Field
function CyberParticleField({ count = 800 }) {
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
      ref.current.rotation.y += delta * 0.03
      ref.current.rotation.x += delta * 0.015
    }
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f2fe"
        size={0.03}
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
    <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid">
      {/* 3D WebGL Background Canvas with 3D Male Avatar */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 48 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
          <pointLight position={[4, 2, 3]} intensity={2.5} color="#00f2fe" />
          <pointLight position={[-4, 2, 2]} intensity={2.0} color="#a855f7" />
          <pointLight position={[0, -2, 4]} intensity={1.0} color="#10b981" />

          <Suspense fallback={null}>
            <CyberParticleField count={700} />
            {/* Position 3D Avatar on the right side for desktop, centered for mobile */}
            <group position={[1.65, -0.3, 0]} className="hidden lg:block">
              <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
                <Avatar3DMale scale={1.22} />
              </Float>
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 scanlines opacity-35 pointer-events-none z-10" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left HUD Panel: Dynamic Profile Data */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Beacon */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-neon-cyan/30 text-xs font-mono shadow-neon-cyan/20 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
              </span>
              <span className="text-neon-cyan tracking-wider font-semibold">NEURAL_AVATAR // INTERACTIVE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Available for Contract & Leadership</span>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neon-cyan/80">
                <Terminal className="w-4 h-4 text-neon-cyan" />
                <span>system.init(profile_v2)</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-violet bg-clip-text text-transparent">
                {headline}
              </p>
            </div>

            {/* Location & Dynamic Bio */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{location}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> Live Supabase Telemetry
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed hud-glass p-5 rounded-2xl border-slate-800/80">
              {bio}
            </p>

            {/* Glowing HUD CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="relative group px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 shadow-neon-cyan hover:shadow-neon-cyan/80 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-mono"
              >
                <span>EXPLORE_PROJECTS</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-dark-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-neon-cyan/50 hover:bg-slate-800/80 transition-all flex items-center gap-2 font-mono hud-glass"
              >
                <Send className="w-4 h-4 text-neon-cyan" />
                <span>TRANSMIT_MESSAGE</span>
              </button>

              <button
                onClick={() => scrollToSection('experience')}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-dark-950/70 border border-neon-violet/30 text-slate-300 hover:text-neon-violet hover:border-neon-violet transition-all flex items-center gap-2 font-mono"
              >
                <FileText className="w-4 h-4 text-neon-violet" />
                <span>INTERACTIVE_CV</span>
              </button>
            </div>

            {/* Social Matrix */}
            <div className="flex items-center gap-3 pt-3">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">Links:</span>
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-neon-cyan/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-blue hover:border-neon-blue/40 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-neon-emerald hover:border-neon-emerald/40 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: Mobile 3D Avatar Card or Glass HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-fuchsia rounded-3xl blur-xl opacity-35 animate-pulse-slow"></div>

              <div className="relative rounded-2xl hud-glass p-6 sm:p-7 shadow-2xl border border-neon-cyan/20 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-neon-cyan flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
                    AVATAR_NODE::ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-neon-cyan/50 shadow-neon-cyan"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-950 flex items-center justify-center border border-neon-cyan/50">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{name}</h3>
                    <p className="text-xs text-neon-cyan font-mono">3D MALE DEVELOPER</p>
                    <p className="text-xs text-slate-400 mt-1">Cursor Tracking R3F Canvas</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-dark-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500">// Realtime Telemetry</span>
                    <div className="mt-1 text-slate-300">
                      <span className="text-neon-violet">const</span> dev = &#123;<br />
                      &nbsp;&nbsp;name: <span className="text-neon-cyan">'{name}'</span>,<br />
                      &nbsp;&nbsp;avatar: <span className="text-emerald-400">'Interactive 3D Male Mesh'</span>,<br />
                      &nbsp;&nbsp;engine: <span className="text-amber-400">'React Three Fiber + Vite'</span><br />
                      &#125;;
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="bg-dark-950/70 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-xl font-bold text-neon-cyan font-sans">100%</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Dynamic DB</p>
                    </div>
                    <div className="bg-dark-950/70 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-xl font-bold text-neon-violet font-sans">60 FPS</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Interactive WebGL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero3D
