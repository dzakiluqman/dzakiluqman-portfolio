import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Hero3D from '../../components/3d/Hero3D'
import FeaturedProjects from '../../components/public/FeaturedProjects'
import TechnicalCompetencies from '../../components/public/TechnicalCompetencies'
import CareerProgression from '../../components/public/CareerProgression'
import LetsConnect from '../../components/public/LetsConnect'
import LoadingSpinner from '../../components/common/LoadingSpinner'

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
  
  const [loading, setLoading] = useState(true)

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
            headline: (profileData.headline && profileData.headline !== 'Junior Full-Stack Developer') ? profileData.headline : 'Full-Stack Developer',
            location: profileData.location || prev.location,
            bio: profileData.bio || prev.bio,
            social_links: {
              ...prev.social_links,
              ...(profileData.social_links || {})
            }
          }))
        }

        // 2. Fetch Published Projects purely from Supabase
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
        setProjects(projectsData || [])

        // 3. Fetch Experiences purely from Supabase
        const { data: expData } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false })
        setExperiences(expData || [])

        // 4. Fetch Educations purely from Supabase
        const { data: eduData } = await supabase
          .from('educations')
          .select('*')
          .order('start_year', { ascending: false })
        setEducations(eduData || [])

        // 5. Fetch Skills purely from Supabase
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })
        setSkills(skillsData || [])

        // 6. Fetch Certifications purely from Supabase
        const { data: certsData } = await supabase
          .from('certifications')
          .select('*')
          .order('issue_date', { ascending: false })
        setCertifications(certsData || [])

      } catch (err) {
        console.warn('Supabase fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center font-sans">
        <LoadingSpinner text="Connecting to database..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1 bg-[#000000]">
        {/* 1. 3D Interactive Hero Canvas with 3D Male Avatar */}
        <Hero3D profile={profile} />

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
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default Home
