import React, { useMemo } from 'react'
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

export const TechnicalCompetencies = ({ skills = [] }) => {
  // Organize skills into 3 clean editorial domain columns
  const groupedSkills = useMemo(() => {
    const groups = DOMAIN_SECTIONS.map((section) => ({
      ...section,
      items: skills.filter((s) => section.matches(s.category))
    }))

    // Catch any skill with unusual category and assign gracefully
    const matchedNames = new Set(groups.flatMap((g) => g.items.map((s) => s.id || s.name)))
    const unassigned = skills.filter((s) => !matchedNames.has(s.id || s.name))

    if (unassigned.length > 0) {
      groups[1].items = [...groups[1].items, ...unassigned]
    }

    return groups
  }, [skills])

  return (
    <section id="skills" className="relative py-20 md:py-28 bg-[#020617] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-14 md:mb-16">
          <div className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">
            Engineering Stack
          </div>
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
              {/* Domain Header with Subtle Hairline Separator */}
              <div className="pb-4 mb-5 border-b border-white/10">
                <h3 className="text-xs font-mono tracking-wider text-slate-400 font-medium uppercase">
                  <span className="text-slate-500 mr-2">{domain.number} /</span>
                  {domain.label}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 font-sans leading-relaxed">
                  {domain.summary}
                </p>
              </div>

              {/* Minimal Tech Cards List */}
              <div className="space-y-3">
                {domain.items.map((skill) => (
                  <TechItem key={skill.id || skill.name} skill={skill} />
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
