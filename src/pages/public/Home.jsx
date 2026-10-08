import React, { useState, useEffect } from 'react'
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
import FeaturedProjects from '../../components/public/FeaturedProjects'
import TechnicalCompetencies from '../../components/public/TechnicalCompetencies'
import CareerProgression from '../../components/public/CareerProgression'
import LetsConnect from '../../components/public/LetsConnect'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const Home = () => {
  const [profile, setProfile] = useState(mockProfile)
  const [projects, setProjects] = useState(mockProjects)
  const [experiences, setExperiences] = useState(mockExperiences)
  const [educations, setEducations] = useState(mockEducations)
  const [skills, setSkills] = useState(mockSkills)
  const [certifications, setCertifications] = useState(mockCertifications)
  
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
        let skillsRes = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true })
        if (skillsRes.error && (skillsRes.error.code === '42703' || skillsRes.error.message?.includes('order_index'))) {
          skillsRes = await supabase
            .from('skills')
            .select('*')
            .order('sort_order', { ascending: true })
        }
        if (skillsRes.data && skillsRes.data.length > 0) setSkills(skillsRes.data)

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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-neon-cyan selection:text-black">
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1 bg-[#000000]">
        {/* 1. 3D Interactive Hero Canvas with 3D Male Avatar */}
        <Hero3D profile={profile} />

        {/* 2. Redesigned Featured Projects Section with Ambient Mesh & Liquid Glass */}
        <FeaturedProjects projects={projects} />

        {/* 3. Technical Competencies Editorial Badges */}
        <TechnicalCompetencies skills={skills} />

        {/* 4. Swiss Editorial Career Progression Timeline */}
        <CareerProgression 
          experiences={experiences} 
          educations={educations} 
          certifications={certifications} 
          profile={profile} 
        />

        {/* 5. Swiss Editorial Let's Connect Showcase */}
        <LetsConnect profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default Home
