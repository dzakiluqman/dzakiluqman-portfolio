import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Github, ExternalLink, Calendar, Layers, Star, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockProjects } from '../../lib/mockData'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const ProjectDetail = () => {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      try {
        if (!isSupabaseConfigured) {
          const found = mockProjects.find((p) => p.slug === slug || p.id === slug)
          setProject(found || mockProjects[0])
          setLoading(false)
          return
        }

        // Live Supabase query
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single()

        if (error || !data) {
          // Fallback to mock if not found
          const fallback = mockProjects.find((p) => p.slug === slug || p.id === slug)
          setProject(fallback || null)
        } else {
          setProject(data)
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        const fallback = mockProjects.find((p) => p.slug === slug || p.id === slug)
        setProject(fallback || null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading project details..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 mb-6">The project you are looking for does not exist or has been unpublished.</p>
          <Link
            to="/#projects"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back button */}
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all projects</span>
          </Link>

          {/* Header Title & Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.category && (
                <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {project.category}
                </span>
              )}
              {project.is_featured && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Featured Project</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Links & CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live Project</span>
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
          </div>

          {/* Hero Thumbnail */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-dark-900">
            <img
              src={project.thumbnail_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'}
              alt={project.title}
              className="w-full h-auto max-h-[500px] object-cover object-top"
            />
          </div>

          {/* Details & Tech Stack grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Project Overview & Architecture
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
                <p>
                  {project.content || project.description}
                </p>
                <p>
                  This project was designed with maximum resilience and developer experience in mind. All state mutations and asynchronous workflows are strictly typed and audited.
                </p>
              </div>
            </div>

            {/* Right sidebar info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-indigo-300 border border-slate-700/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-3 text-xs text-slate-400 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>Category</span>
                  <span className="text-white">{project.category || 'Web App'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>Status</span>
                  <span className="text-emerald-400">{project.is_published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Featured</span>
                  <span className="text-white">{project.is_featured ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectDetail
