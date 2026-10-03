import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Layers, 
  Sparkles, 
  FolderGit2, 
  Terminal, 
  Mail, 
  MapPin, 
  Calendar,
  ExternalLink,
  Info
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
import Hero from '../../components/public/Hero'
import ProjectCard from '../../components/public/ProjectCard'
import ExperienceTimeline from '../../components/public/ExperienceTimeline'
import SkillBadge from '../../components/public/SkillBadge'
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
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeCvTab, setActiveCvTab] = useState('experience')

  useEffect(() => {
    async function loadPortfolioData() {
      if (!isSupabaseConfigured) {
        // Use rich mock data immediately
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()
        if (profileData) setProfile(profileData)

        // Fetch Published Projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
        if (projectsData && projectsData.length > 0) setProjects(projectsData)

        // Fetch Experiences
        const { data: expData } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false })
        if (expData && expData.length > 0) setExperiences(expData)

        // Fetch Educations
        const { data: eduData } = await supabase
          .from('educations')
          .select('*')
          .order('start_year', { ascending: false })
        if (eduData && eduData.length > 0) setEducations(eduData)

        // Fetch Skills
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })
        if (skillsData && skillsData.length > 0) setSkills(skillsData)

        // Fetch Certifications
        const { data: certsData } = await supabase
          .from('certifications')
          .select('*')
          .order('issue_date', { ascending: false })
        if (certsData && certsData.length > 0) setCertifications(certsData)

      } catch (err) {
        console.warn('Could not fetch all Supabase live tables, utilizing sample data fallback:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  // Categories filter list
  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter((p) => p.category === activeCategory)

  // Skill groupings by category
  const skillCategories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-primary selection:text-white">
      <Navbar />

      {/* Demo Notice Banner if Supabase is in preview mode */}
      {!isSupabaseConfigured && (
        <div className="bg-indigo-950/70 border-b border-indigo-800/60 px-4 py-2 text-center text-xs text-indigo-200 flex items-center justify-center gap-2 mt-16 sm:mt-18">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            <strong>Preview Demo Mode:</strong> Add <code className="bg-indigo-900/80 px-1 py-0.5 rounded text-white">VITE_SUPABASE_URL</code> & <code className="bg-indigo-900/80 px-1 py-0.5 rounded text-white">VITE_SUPABASE_ANON_KEY</code> in <code className="text-white">.env</code> to connect live database.
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero profile={profile} />

        {/* 2. Projects Section */}
        <section id="projects" className="py-24 border-t border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Featured Work</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Crafted with Precision
                </h2>
                <p className="mt-2 text-slate-400 text-base max-w-xl">
                  A curated collection of fullstack web applications, cloud systems, and open-source software architectures.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading published projects..." />
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-dark-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, idx) => (
                  <ProjectCard key={project.id || idx} project={project} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. Interactive CV Section */}
        <section id="experience" className="py-24 border-t border-slate-800/80 bg-dark-900/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Interactive Curriculum Vitae</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Experience & Qualifications
              </h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">
                Track record in software engineering, leadership, academic foundations, and professional accreditations.
              </p>

              {/* CV Section Tabs */}
              <div className="flex items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-900 border border-slate-800 max-w-md mx-auto">
                <button
                  onClick={() => setActiveCvTab('experience')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'experience'
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Work Experience</span>
                </button>
                <button
                  onClick={() => setActiveCvTab('education')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'education'
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </button>
                <button
                  onClick={() => setActiveCvTab('certs')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeCvTab === 'certs'
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificates</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Experience */}
            {activeCvTab === 'experience' && (
              <div className="max-w-4xl mx-auto">
                <ExperienceTimeline experiences={experiences} />
              </div>
            )}

            {/* Tab 2: Education */}
            {activeCvTab === 'education' && (
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {educations.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-6 rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{edu.institution}</h4>
                      <p className="text-sm text-indigo-400 font-medium">{edu.degree}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.field_of_study}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-500">
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
                    className="p-6 rounded-2xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Issued by: <span className="text-slate-300">{cert.issuer}</span></p>
                      {cert.issue_date && (
                        <p className="text-xs text-slate-500 font-mono">Date: {cert.issue_date}</p>
                      )}
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 border-t border-slate-800"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Skills Section */}
        <section id="skills" className="py-24 border-t border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Code className="w-4 h-4" />
                <span>Technical Arsenal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skills & Technologies
              </h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">
                Tools and languages utilized across fullstack development, infrastructure, and databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category) => (
                <div
                  key={category}
                  className="rounded-2xl bg-dark-900/60 border border-slate-800 p-6 space-y-4"
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <h3 className="font-bold text-white text-base tracking-wide">{category}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {skills
                      .filter((s) => s.category === category)
                      .map((skill) => (
                        <SkillBadge key={skill.id || skill.name} skill={skill} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Contact Section */}
        <section id="contact" className="py-24 border-t border-slate-800/80 bg-dark-900/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Get In Touch</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Let's Build Something Exceptional Together
                  </h2>
                  <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                    Whether you have an upcoming project, need architectural consulting, or want to discuss full-time engineering roles, I'd love to hear from you.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">Email Directly</p>
                      <a 
                        href={`mailto:${profile?.social_links?.email || 'dzakiluqman@example.com'}`}
                        className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                      >
                        {profile?.social_links?.email || 'dzakiluqman@example.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">Current Base</p>
                      <p className="text-sm font-semibold text-white">
                        {profile?.location || 'Jakarta, Indonesia'} (GMT+7)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
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
