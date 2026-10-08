import React, { useState, useEffect, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockSkills } from '../../lib/mockData'
import TechItem from './TechItem'

const DOMAIN_SECTIONS = [
  {
    key: 'frontend',
    number: '01',
    label: 'FRONTEND & INTERFACE',
    summary: 'UI architecture, client state management, spatial 3D & responsive web systems.',
    matches: (cat = '') => /front|client|ui|ux|web/i.test(cat)
  },
  {
    key: 'backend',
    number: '02',
    label: 'BACKEND & ARCHITECTURE',
    summary: 'Distributed microservices, relational databases, realtime synchronization & APIs.',
    matches: (cat = '') => /back|server|database|api|data/i.test(cat)
  },
  {
    key: 'devops',
    number: '03',
    label: 'INFRASTRUCTURE & DEVOPS',
    summary: 'Container orchestration, automated CI/CD pipelines, edge networking & cloud systems.',
    matches: (cat = '') => /devops|infra|cloud|sys|ops/i.test(cat)
  }
]

export const TechnicalCompetencies = ({ skills: propSkills = [] }) => {
  const [skills, setSkills] = useState(propSkills?.length ? propSkills : [])
  const [isLoading, setIsLoading] = useState(!propSkills?.length)

  useEffect(() => {
    let isMounted = true

    const fetchDynamicSkills = async () => {
      // Local fallback handler
      const getLocalFallback = () => {
        const stored = localStorage.getItem('dzaki_demo_skills')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) return parsed
          } catch (e) {
            console.warn('Error parsing local skills:', e)
          }
        }
        return propSkills && propSkills.length > 0 ? propSkills : mockSkills
      }

      if (!isSupabaseConfigured) {
        if (isMounted) {
          setSkills(getLocalFallback())
          setIsLoading(false)
        }
        return
      }

      try {
        // Dynamic fetching from Supabase ordering by order_index
        let res = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true })

        // Fallback for legacy schemas with sort_order
        if (res.error && (res.error.code === '42703' || res.error.message?.includes('order_index'))) {
          res = await supabase
            .from('skills')
            .select('*')
            .order('sort_order', { ascending: true })
        }

        if (res.error) throw res.error

        if (res.data && res.data.length > 0) {
          const normalized = res.data.map((item, idx) => ({
            ...item,
            id: item.id || `skill-${idx}`,
            title: item.title || item.name || 'Technical Competency',
            name: item.title || item.name || 'Technical Competency',
            subtitle: item.subtitle || item.level || item.focus || '',
            category: item.category || 'frontend',
            icon_name: item.icon_name || 'Code',
            order_index: item.order_index ?? item.sort_order ?? idx + 1
          }))
          if (isMounted) {
            setSkills(normalized)
            setIsLoading(false)
          }
        } else {
          // If Supabase table is empty, use stored demo items or mock skills
          if (isMounted) {
            setSkills(getLocalFallback())
            setIsLoading(false)
          }
        }
      } catch (err) {
        console.warn('Error fetching dynamic skills from Supabase:', err)
        if (isMounted) {
          setSkills(getLocalFallback())
          setIsLoading(false)
        }
      }
    }

    fetchDynamicSkills()

    // Real-time synchronization with Supabase
    let channel = null
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('public:skills:competencies')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
          fetchDynamicSkills()
        })
        .subscribe()
    }

    // Custom browser events triggered by Admin panel updates
    const handleUpdateEvent = () => fetchDynamicSkills()
    window.addEventListener('dzaki:skills_updated', handleUpdateEvent)
    window.addEventListener('storage', handleUpdateEvent)

    return () => {
      isMounted = false
      if (channel) supabase.removeChannel(channel)
      window.removeEventListener('dzaki:skills_updated', handleUpdateEvent)
      window.removeEventListener('storage', handleUpdateEvent)
    }
  }, [propSkills])

  // Organize skills into 3 clean editorial domain columns automatically by category
  const groupedSkills = useMemo(() => {
    const list = skills && skills.length > 0 ? skills : (propSkills?.length ? propSkills : mockSkills)

    const groups = DOMAIN_SECTIONS.map((section) => ({
      ...section,
      items: list
        .filter((s) => section.matches(s.category))
        .sort((a, b) => (a.order_index ?? a.sort_order ?? 0) - (b.order_index ?? b.sort_order ?? 0))
    }))

    // Catch any skill with unusual/custom category and assign gracefully
    const matchedKeys = new Set(groups.flatMap((g) => g.items.map((s) => s.id || s.title || s.name)))
    const unassigned = list.filter((s) => !matchedKeys.has(s.id || s.title || s.name))

    if (unassigned.length > 0) {
      groups[1].items = [
        ...groups[1].items,
        ...unassigned.sort((a, b) => (a.order_index ?? a.sort_order ?? 0) - (b.order_index ?? b.sort_order ?? 0))
      ]
    }

    return groups
  }, [skills, propSkills])

  return (
    <section id="skills" className="relative py-20 md:py-28 bg-[#020617] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header - Eyebrow text removed for clean visual flow */}
        <div className="max-w-2xl mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-slate-100 tracking-tight font-sans">
            Technical <span className="font-semibold text-white">Competencies</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed font-sans">
            Production-proven technologies engineered for high performance, strict type safety, 
            resilient data architectures, and automated cloud delivery.
          </p>
        </div>

        {/* 3 Domain Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {groupedSkills.map((domain) => (
            <div key={domain.key} className="flex flex-col">
              {/* Domain Header with Unified Primary Sans-Serif Typography */}
              <div className="pb-4 mb-5 border-b border-white/10">
                <h3 className="text-xs font-sans tracking-wider text-slate-300 font-medium uppercase">
                  <span className="text-slate-400 mr-2 font-sans">{domain.number} /</span>
                  {domain.label}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 font-sans leading-relaxed">
                  {domain.summary}
                </p>
              </div>

              {/* Minimal Tech Cards List */}
              <div className="space-y-3">
                {domain.items.map((skill) => (
                  <TechItem key={skill.id || skill.title || skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechnicalCompetencies
