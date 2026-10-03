import React, { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Code, Cpu, Database, Terminal, Shield, Zap } from 'lucide-react'

// Helper for dynamic Lucide icons
const DynamicIcon = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = Icons[name] || Icons.Code
  return <IconComponent className={className} />
}

// 3D Rotating Cyber Skill Core with Orbiting Satellites
function SkillCore3D({ count = 8, activeCategory = 'All' }) {
  const groupRef = useRef()
  const ringRef = useRef()

  // Generate satellite positions around sphere
  const satellites = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const radius = 2.4
      return {
        x: Math.cos(angle) * radius,
        y: (Math.sin(i * 1.5) * 0.8),
        z: Math.sin(angle) * radius,
        speed: 0.5 + Math.random() * 0.5
      }
    })
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3
      ringRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Cyber Brain Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.1, 32, 32]}>
          <MeshDistortMaterial
            color="#0b111e"
            emissive="#00f2fe"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.9}
            distort={0.3}
            speed={2}
            wireframe={true}
          />
        </Sphere>
      </Float>

      {/* Outer Gyroscopic Rings */}
      <mesh ref={ringRef} scale={1.8}>
        <torusGeometry args={[1.3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>

      {/* Orbiting Tech Nodes */}
      {satellites.map((sat, idx) => (
        <group key={idx} position={[sat.x, sat.y, sat.z]}>
          <mesh scale={0.16}>
            <octahedronGeometry />
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export const SkillsVisualizer = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))]

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory)

  const levelColorMap = {
    Expert: {
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/40',
      bg: 'bg-neon-cyan/10',
      bar: 'bg-gradient-to-r from-neon-cyan to-blue-500',
      percentage: '95%'
    },
    Advanced: {
      text: 'text-neon-violet',
      border: 'border-neon-violet/40',
      bg: 'bg-neon-violet/10',
      bar: 'bg-gradient-to-r from-neon-violet to-purple-600',
      percentage: '85%'
    },
    Intermediate: {
      text: 'text-amber-400',
      border: 'border-amber-400/40',
      bg: 'bg-amber-400/10',
      bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
      percentage: '70%'
    },
    Beginner: {
      text: 'text-slate-400',
      border: 'border-slate-500/40',
      bg: 'bg-slate-500/10',
      bar: 'bg-slate-500',
      percentage: '50%'
    }
  }

  return (
    <section id="skills" className="py-24 border-t border-slate-800/80 relative cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-neon-cyan text-xs font-mono uppercase tracking-widest mb-2.5">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <span>NEURAL_CAPABILITIES // SKILL_ORBIT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technical Competencies
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Fullstack frameworks, cloud distributed topologies, and reactive state management.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-900 border border-slate-800 max-w-lg mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 font-bold shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Visualizer & HUD Matrix Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 3D Holographic Orbit Sphere */}
          <div className="lg:col-span-5 h-[380px] sm:h-[450px] relative rounded-2xl hud-glass overflow-hidden border border-neon-cyan/20">
            <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-neon-cyan flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
              <span>ORBIT_ENGINE // 3D_NODE_CLOUD</span>
            </div>

            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full">
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
              <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a855f7" />
              <Suspense fallback={null}>
                <SkillCore3D activeCategory={activeCategory} />
              </Suspense>
            </Canvas>

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-dark-950/80 p-2.5 rounded-xl border border-slate-800">
              <span>ACTIVE_RECORDS: {filteredSkills.length}</span>
              <span className="text-neon-cyan">REALTIME_SYNC::OK</span>
            </div>
          </div>

          {/* Right Column: Interactive HUD Grid of Skills */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSkills.map((skill, index) => {
              const style = levelColorMap[skill.level] || levelColorMap.Advanced

              return (
                <motion.div
                  key={skill.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-xl hud-glass hud-glass-hover border border-slate-800 space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-dark-950 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-neon-cyan group-hover:border-neon-cyan/40 transition-colors">
                        <DynamicIcon name={skill.icon_name} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{skill.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{skill.category}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                      {skill.level}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-dark-950 overflow-hidden border border-slate-800">
                      <div
                        style={{ width: style.percentage }}
                        className={`h-full rounded-full ${style.bar} transition-all duration-500`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}

export default SkillsVisualizer
