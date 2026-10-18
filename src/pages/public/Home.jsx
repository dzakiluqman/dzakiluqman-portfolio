import React, { useState, useEffect, Suspense, lazy } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Hero3D from '../../components/3d/Hero3D'

// Code-split below-the-fold sections using dynamic imports
const FeaturedProjects = lazy(() => import('../../components/public/FeaturedProjects'))
const CareerProgression = lazy(() => import('../../components/public/CareerProgression'))
const TechnicalCompetencies = lazy(() => import('../../components/public/TechnicalCompetencies'))
const LetsConnect = lazy(() => import('../../components/public/LetsConnect'))

export const Home = () => {
  const [profile, setProfile] = useState({
    full_name: 'Dzakii Luqman Faid',
    headline: 'Full-Stack Developer',
    location: 'Kota Magelang, Indonesia',
    bio: '',
    social_links: {
      github: 'https://github.com/dzakiluqman',
      linkedin: 'https://linkedin.com/in/dzakiluqman',
      instagram: 'https://www.instagram.com/dzak.ii_/',
      medium: 'https://medium.com/@dzakiluqman275',
      email: 'dzakiluqman275@gmail.com'
    }
  })
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [skills, setSkills] = useState([])
  const [certifications, setCertifications] = useState([])

  useEffect(() => {
    let isMounted = true

    if (!isSupabaseConfigured) {
      return
    }

    // 1. Fetch Profile for hero section
    async function loadHeroProfile() {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle()
        if (profileData && isMounted) {
          setProfile(prev => ({
            ...prev,
            ...profileData,
            full_name: profileData.full_name || prev.full_name,
            headline: (profileData.headline && profileData.headline !== 'Junior Full-Stack Developer') ? profileData.headline : 'Full-Stack Developer',
            location: profileData.location || prev.location,
            bio: profileData.bio || prev.bio,
            social_links: {
              ...prev.social_links,
              ...(profileData.social_links || {})
            }
          }))
        }
      } catch (err) {
        console.warn('Profile fetch error:', err)
      }
    }

    // 2. Defer non-hero sections (projects, experiences, educations, skills, certs) until after initial page paint
    async function loadNonHeroData() {
      try {
        const [
          projectsRes,
          expRes,
          eduRes,
          skillsRes,
          certsRes
        ] = await Promise.all([
          supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
          supabase.from('experiences').select('*').order('start_date', { ascending: false }),
          supabase.from('educations').select('*').order('start_year', { ascending: false }),
          supabase.from('skills').select('*').order('sort_order', { ascending: true }),
          supabase.from('certifications').select('*').order('issue_date', { ascending: false })
        ])

        if (!isMounted) return
        if (projectsRes.data) setProjects(projectsRes.data)
        if (expRes.data) setExperiences(expRes.data)
        if (eduRes.data) setEducations(eduRes.data)
        if (skillsRes.data) setSkills(skillsRes.data)
        if (certsRes.data) setCertifications(certsRes.data)
      } catch (err) {
        console.warn('Non-hero data fetch error:', err)
      }
    }

    loadHeroProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const [shouldRenderSections, setShouldRenderSections] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Fetch Non-hero data
    async function loadNonHeroData() {
      if (!isSupabaseConfigured) return
      try {
        const [
          projectsRes,
          expRes,
          eduRes,
          skillsRes,
          certsRes
        ] = await Promise.all([
          supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
          supabase.from('experiences').select('*').order('start_date', { ascending: false }),
          supabase.from('educations').select('*').order('start_year', { ascending: false }),
          supabase.from('skills').select('*').order('sort_order', { ascending: true }),
          supabase.from('certifications').select('*').order('issue_date', { ascending: false })
        ])

        if (!isMounted) return
        if (projectsRes.data) setProjects(projectsRes.data)
        if (expRes.data) setExperiences(expRes.data)
        if (eduRes.data) setEducations(eduRes.data)
        if (skillsRes.data) setSkills(skillsRes.data)
        if (certsRes.data) setCertifications(certsRes.data)
      } catch (err) {
        console.warn('Non-hero data fetch error:', err)
      }
    }

    const triggerDeferred = () => {
      setShouldRenderSections(true)
      loadNonHeroData()
      window.removeEventListener('scroll', triggerDeferred)
      window.removeEventListener('pointerdown', triggerDeferred)
    }

    window.addEventListener('scroll', triggerDeferred, { passive: true, once: true })
    window.addEventListener('pointerdown', triggerDeferred, { passive: true, once: true })

    const timer = setTimeout(() => {
      setShouldRenderSections(true)
      loadNonHeroData()
    }, 3500)

    return () => {
      isMounted = false
      window.removeEventListener('scroll', triggerDeferred)
      window.removeEventListener('pointerdown', triggerDeferred)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1 bg-[#000000]">
        {/* 1. 3D Interactive Hero Canvas with 3D Male Avatar */}
        <Hero3D profile={profile} />

        {shouldRenderSections && (
          <Suspense fallback={null}>
            {/* 2. Redesigned Featured Projects Section with Ambient Mesh & Liquid Glass */}
            <FeaturedProjects projects={projects} />

            {/* 3. Swiss Editorial Career Progression (3-Tab Switcher: Experience, Education, Certs) */}
            <CareerProgression 
              experiences={experiences} 
              educations={educations} 
              certifications={certifications} 
              profile={profile} 
            />

            {/* 4. Technical Competencies Editorial Badges */}
            <TechnicalCompetencies skills={skills} />

            {/* 5. Swiss Editorial Let's Connect Showcase */}
            <LetsConnect profile={profile} />
          </Suspense>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default Home
