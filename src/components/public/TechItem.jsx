import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import {
  Code,
  FileCode,
  Sparkles,
  Palette,
  Server,
  Database,
  Cpu,
  Boxes,
  Cloud,
  GitBranch,
  Terminal,
  Layers,
  Globe,
  Workflow,
  Shield,
  Layout,
  HardDrive
} from 'lucide-react'

// Direct fallback map for reliable rendering without runtime lookup failures
const ICON_MAP = {
  Code,
  FileCode,
  Sparkles,
  Palette,
  Server,
  Database,
  Cpu,
  Container: Boxes,
  Boxes,
  Box: Boxes,
  Cloud,
  GitBranch,
  Terminal,
  Layers,
  Globe,
  Workflow,
  Shield,
  Layout,
  HardDrive
}

// Curated Swiss editorial domain focus descriptors
const TECH_FOCUS_MAP = {
  'react / next.js': 'UI Architecture & SSR',
  'react': 'Component Systems & State',
  'next.js': 'Server Components & SSR',
  'typescript': 'Strict Static Typing',
  'three.js / r3f': 'WebGL & Spatial 3D',
  'three.js': 'WebGL & 3D Shaders',
  'tailwind css': 'Design Tokens & Utility',
  'tailwind': 'Utility-First Styling',
  'node.js & express': 'High-Throughput APIs',
  'node.js': 'Runtime & Microservices',
  'express': 'Middleware & REST APIs',
  'supabase & postgresql': 'Relational Data & Realtime',
  'supabase': 'Auth & Edge Synchronization',
  'postgresql': 'ACID Schemas & Indexing',
  'go / golang': 'Concurrent Microservices',
  'golang': 'High-Concurrency Services',
  'docker & kubernetes': 'Containers & Orchestration',
  'docker': 'Container Virtualization',
  'kubernetes': 'Cluster Orchestration',
  'aws & cloudflare': 'Serverless & Global Edge',
  'aws': 'Cloud Infrastructure & IAM',
  'cloudflare': 'Edge Compute & CDN Caching',
  'ci/cd github actions': 'Automated Deployment Pipelines',
  'github actions': 'Automated Workflows',
  'git': 'Distributed Version Control',
  'python': 'Data Processing & Scripting',
  'redis': 'In-Memory Cache & Queues',
  'graphql': 'Declarative API Schemas'
}

const getFocusDescription = (skill) => {
  if (skill.subtitle) return skill.subtitle
  if (skill.focus) return skill.focus
  if (skill.description) return skill.description

  const key = (skill.title || skill.name || '').trim().toLowerCase()
  if (TECH_FOCUS_MAP[key]) return TECH_FOCUS_MAP[key]

  const cat = (skill.category || '').toLowerCase()
  if (cat.includes('front')) return 'UI Systems & State'
  if (cat.includes('back')) return 'Core Services & Data'
  if (cat.includes('devops') || cat.includes('infra') || cat.includes('cloud')) {
    return 'Infrastructure & Pipeline'
  }
  return 'Engineering Core'
}

export const TechItem = ({ skill, index = 0 }) => {
  const IconComponent =
    (skill.icon_name && ICON_MAP[skill.icon_name]) ||
    (skill.icon_name && Icons[skill.icon_name]) ||
    Code

  const title = skill.title || skill.name || 'Technical Competency'
  const focus = getFocusDescription(skill)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
      className="group relative flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-white/20 transition-all duration-200 flex-shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-medium text-zinc-100 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight truncate font-sans">
            {title}
          </div>
          <div className="text-xs text-zinc-500 font-sans tracking-tight truncate mt-0.5">
            {focus}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TechItem
