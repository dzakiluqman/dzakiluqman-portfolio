import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Sparkles, 
  ExternalLink,
  Info,
  Radio
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { 
  mockProfile, 
  mockProjects, 
  mockExperiences, 
  mockEducations, 
  mockSkills, 
  mockCertifications 
} from '../../lib/mockData'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Hero3D from '../../components/3d/Hero3D'
import BentoProjects from '../../components/public/BentoProjects'
import TechnicalCompetencies from '../../components/public/TechnicalCompetencies'
import ExperienceTimeline from '../../components/public/ExperienceTimeline'
import ContactForm from '../../components/public/ContactForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const Home = () => {
  const [profile, setProfile] = useState(mockProfile)
  const [projects, setProjects] = useState(mockProjects)
  const [experiences, setExperiences] = useState(mockExperiences)
  const [educations, setEducations] = useState(mockEducations)
  const [skills, setSkills] = useState(mockSkills)
  const [certifications, setCertifications] = useState(mockCertifications)
  
  const [loading, setLoading] = useState(true)
  const [activeCvTab, setActiveCvTab] = useState('experience')

  useEffect(() => {
    async function loadPortfolioData() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // 1. Fetch Profile Dynamically
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle()
        if (profileData) {
          setProfile(prev => ({
            ...prev,
            ...profileData,
            full_name: profileData.full_name || prev.full_name,
            headline: profileData.headline || prev.headline,
            location: profileData.location || prev.location,
            bio: profileData.bio || prev.bio,
            social_links: {
              ...prev.social_links,
              ...(profileData.social_links || {})
            }
          }))
        }

        // 2. Fetch Published Projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
        if (projectsData && projectsData.length > 0) setProjects(projectsData)

        // 3. Fetch Experiences
        const { data: expData } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false })
        if (expData && expData.length > 0) setExperiences(expData)

        // 4. Fetch Educations
        const { data: eduData } = await supabase
          .from('educations')
          .select('*')
          .order('start_year', { ascending: false })
        if (eduData && eduData.length > 0) setEducations(eduData)

        // 5. Fetch Skills
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })
        if (skillsData && skillsData.length > 0) setSkills(skillsData)

        // 6. Fetch Certifications
        const { data: certsData } = await supabase
          .from('certifications')
          .select('*')
          .order('issue_date', { ascending: false })
        if (certsData && certsData.length > 0) setCertifications(certsData)

      } catch (err) {
        console.warn('Supabase fetch encountered warning, utilizing fallback:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-neon-cyan selection:text-dark-950">
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. 3D Interactive Hero Canvas with 3D Male Avatar */}
        <Hero3D profile={profile} />

        {/* 2. Futuristic Bento Grid & 3D Tilt Project Showcase */}
        <BentoProjects projects={projects} />

        {/* 3. Technical Competencies Editorial Badges */}
        <TechnicalCompetencies skills={skills} />

        {/* 4. Glowing Cyberpunk Timeline for Experience & CV */}
        <section id="experience" className="py-24 border-t border-slate-800/80 bg-dark-900/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-neon-cyan text-xs font-mono uppercase tracking-widest mb-2.5">
                <Briefcase className="w-4 h-4 text-neon-cyan" />
                <span>Experience & Career Path</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Career Progression
              </h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">
                Engineering milestones, leadership tenures, university education, and industry credentials.
              </p>

              {/* CV Section Tabs */}
              <div className="flex items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-900 border border-slate-800 max-w-md mx-auto">
                <button
                  onClick={() => setActiveCvTab('experience')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'experience'
                      ? 'bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 font-bold shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience</span>
                </button>
                <button
                  onClick={() => setActiveCvTab('education')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'education'
                      ? 'bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 font-bold shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </button>
                <button
                  onClick={() => setActiveCvTab('certs')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'certs'
                      ? 'bg-gradient-to-r from-neon-cyan to-indigo-600 text-dark-950 font-bold shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certs</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Experience */}
            {activeCvTab === 'experience' && (
              <div className="max-w-4xl mx-auto">
                <ExperienceTimeline 
                  experiences={experiences} 
                  educations={educations} 
                  certifications={certifications}
                  profile={profile} 
                />
              </div>
            )}

            {/* Tab 2: Education */}
            {activeCvTab === 'education' && (
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {educations.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-6 rounded-2xl hud-glass hud-glass-hover border border-slate-800 space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{edu.institution}</h4>
                      <p className="text-sm text-neon-cyan font-mono">{edu.degree}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.field_of_study}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-500">
                      <span>{edu.start_year} — {edu.end_year || 'Present'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Certifications */}
            {activeCvTab === 'certs' && (
              <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-6 rounded-2xl hud-glass hud-glass-hover border border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Issuer: <span className="text-slate-200">{cert.issuer}</span></p>
                      {cert.issue_date && (
                        <p className="text-xs text-slate-500 font-mono">Verified: {cert.issue_date}</p>
                      )}
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan hover:text-white pt-2 border-t border-slate-800 font-mono"
                      >
                        <span>View Credential</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Contact Section */}
        <section id="contact" className="py-24 border-t border-slate-800/80 bg-dark-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-neon-cyan text-xs font-mono uppercase tracking-widest mb-2.5">
                    <Radio className="w-4 h-4 text-neon-cyan" />
                    <span>Contact & Inquiries</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Let's Connect & Collaborate
                  </h2>
                  <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                    Have an opportunity, a project in mind, or just want to connect? Reach out anytime.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3.5 p-4 rounded-xl hud-glass border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">EMAIL ADDRESS</p>
                      <a 
                        href={`mailto:${profile?.social_links?.email || 'dzakiluqman@example.com'}`}
                        className="text-sm font-semibold text-white hover:text-neon-cyan transition-colors font-mono"
                      >
                        {profile?.social_links?.email || 'dzakiluqman@example.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-xl hud-glass border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center text-neon-violet shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">LOCATION</p>
                      <p className="text-sm font-semibold text-white font-mono">
                        {profile?.location || 'Kota Magelang, Indonesia'} (UTC+7)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default Home
