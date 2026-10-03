import React, { useState, useEffect } from 'react'
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  X,
  Save,
  Loader2
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockExperiences, mockEducations, mockSkills } from '../../lib/mockData'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ExperienceFormModal from '../../components/admin/ExperienceFormModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const AdminCV = () => {
  const [activeTab, setActiveTab] = useState('experience')
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  // Experience modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [isExpSaving, setIsExpSaving] = useState(false)

  // Education modal
  const [isEduModalOpen, setIsEduModalOpen] = useState(false)
  const [editingEdu, setEditingEdu] = useState(null)
  const [eduFormData, setEduFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: 2020,
    end_year: 2024
  })

  // Skill modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Expert',
    icon_name: 'Code'
  })

  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadData = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      const storedExp = localStorage.getItem('dzaki_demo_exp')
      const storedEdu = localStorage.getItem('dzaki_demo_edu')
      const storedSkills = localStorage.getItem('dzaki_demo_skills')

      setExperiences(storedExp ? JSON.parse(storedExp) : mockExperiences)
      setEducations(storedEdu ? JSON.parse(storedEdu) : mockEducations)
      setSkills(storedSkills ? JSON.parse(storedSkills) : mockSkills)
      setLoading(false)
      return
    }

    try {
      const [expRes, eduRes, skillsRes] = await Promise.all([
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('educations').select('*').order('start_year', { ascending: false }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true })
      ])

      if (expRes.data) setExperiences(expRes.data)
      if (eduRes.data) setEducations(eduRes.data)
      if (skillsRes.data) setSkills(skillsRes.data)
    } catch (err) {
      showNotification('Error loading CV records: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Experience handlers
  const handleSaveExp = async (formData) => {
    setIsExpSaving(true)
    try {
      if (!isSupabaseConfigured) {
        let updated
        if (editingExp) {
          updated = experiences.map((e) => e.id === editingExp.id ? { ...e, ...formData } : e)
        } else {
          updated = [{ ...formData, id: `demo-exp-${Date.now()}` }, ...experiences]
        }
        setExperiences(updated)
        localStorage.setItem('dzaki_demo_exp', JSON.stringify(updated))
        setIsExpModalOpen(false)
        showNotification(editingExp ? 'Experience updated' : 'Experience added')
        return
      }

      if (editingExp) {
        const { error } = await supabase.from('experiences').update(formData).eq('id', editingExp.id)
        if (error) throw error
        showNotification('Experience updated successfully')
      } else {
        const { error } = await supabase.from('experiences').insert([formData])
        if (error) throw error
        showNotification('Experience added successfully')
      }

      setIsExpModalOpen(false)
      await loadData()
    } catch (err) {
      showNotification(err.message || 'Failed to save experience', 'error')
    } finally {
      setIsExpSaving(false)
    }
  }

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this work experience record?')) return

    if (!isSupabaseConfigured) {
      const updated = experiences.filter((e) => e.id !== id)
      setExperiences(updated)
      localStorage.setItem('dzaki_demo_exp', JSON.stringify(updated))
      showNotification('Experience deleted')
      return
    }

    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
      setExperiences(experiences.filter((e) => e.id !== id))
      showNotification('Experience removed from Supabase')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  // Education handlers
  const handleOpenEduModal = (edu = null) => {
    setEditingEdu(edu)
    if (edu) {
      setEduFormData({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        start_year: edu.start_year || 2020,
        end_year: edu.end_year || 2024
      })
    } else {
      setEduFormData({
        institution: '',
        degree: 'Bachelor of Science',
        field_of_study: 'Computer Science',
        start_year: new Date().getFullYear() - 4,
        end_year: new Date().getFullYear()
      })
    }
    setIsEduModalOpen(true)
  }

  const handleSaveEdu = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...eduFormData,
        start_year: parseInt(eduFormData.start_year, 10),
        end_year: eduFormData.end_year ? parseInt(eduFormData.end_year, 10) : null
      }

      if (!isSupabaseConfigured) {
        let updated
        if (editingEdu) {
          updated = educations.map((ed) => ed.id === editingEdu.id ? { ...ed, ...payload } : ed)
        } else {
          updated = [{ ...payload, id: `demo-edu-${Date.now()}` }, ...educations]
        }
        setEducations(updated)
        localStorage.setItem('dzaki_demo_edu', JSON.stringify(updated))
        setIsEduModalOpen(false)
        showNotification('Education record saved')
        return
      }

      if (editingEdu) {
        const { error } = await supabase.from('educations').update(payload).eq('id', editingEdu.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('educations').insert([payload])
        if (error) throw error
      }

      setIsEduModalOpen(false)
      showNotification('Education record updated in Supabase')
      await loadData()
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this education entry?')) return

    if (!isSupabaseConfigured) {
      const updated = educations.filter((e) => e.id !== id)
      setEducations(updated)
      localStorage.setItem('dzaki_demo_edu', JSON.stringify(updated))
      showNotification('Education deleted')
      return
    }

    try {
      const { error } = await supabase.from('educations').delete().eq('id', id)
      if (error) throw error
      setEducations(educations.filter((e) => e.id !== id))
      showNotification('Education deleted')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  // Skill handlers
  const handleOpenSkillModal = (skill = null) => {
    setEditingSkill(skill)
    if (skill) {
      setSkillFormData({
        name: skill.name || '',
        category: skill.category || 'Frontend',
        level: skill.level || 'Expert',
        icon_name: skill.icon_name || 'Code'
      })
    } else {
      setSkillFormData({
        name: '',
        category: 'Frontend',
        level: 'Expert',
        icon_name: 'Code'
      })
    }
    setIsSkillModalOpen(true)
  }

  const handleSaveSkill = async (e) => {
    e.preventDefault()
    try {
      if (!isSupabaseConfigured) {
        let updated
        if (editingSkill) {
          updated = skills.map((s) => s.id === editingSkill.id ? { ...s, ...skillFormData } : s)
        } else {
          updated = [{ ...skillFormData, id: `demo-skill-${Date.now()}` }, ...skills]
        }
        setSkills(updated)
        localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
        setIsSkillModalOpen(false)
        showNotification('Skill saved')
        return
      }

      if (editingSkill) {
        const { error } = await supabase.from('skills').update(skillFormData).eq('id', editingSkill.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').insert([skillFormData])
        if (error) throw error
      }

      setIsSkillModalOpen(false)
      showNotification('Skill record updated in Supabase')
      await loadData()
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return

    if (!isSupabaseConfigured) {
      const updated = skills.filter((s) => s.id !== id)
      setSkills(updated)
      localStorage.setItem('dzaki_demo_skills', JSON.stringify(updated))
      showNotification('Skill removed')
      return
    }

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      setSkills(skills.filter((s) => s.id !== id))
      showNotification('Skill deleted')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Curriculum Vitae Management"
          subtitle="Manage work experiences, academic education, and technical competencies"
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {notification && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2 text-xs font-medium ${
                notification.type === 'error'
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'experience'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Work Experience ({experiences.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education ({educations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Technical Skills ({skills.length})</span>
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving CV records..." />
          ) : (
            <>
              {/* TAB 1: WORK EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setEditingExp(null)
                        setIsExpModalOpen(true)
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Work Experience</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{exp.role}</h4>
                            <span className="text-xs text-indigo-400 font-semibold">@ {exp.company}</span>
                            {exp.is_current && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                                Present
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                            <span>{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                            {exp.location && <span>• {exp.location}</span>}
                            <span>• {exp.employment_type}</span>
                          </p>
                          {exp.description && (
                            <p className="text-xs text-slate-300 mt-2 max-w-2xl">{exp.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() => {
                              setEditingExp(exp)
                              setIsExpModalOpen(true)
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenEduModal(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Education Record</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educations.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex justify-between items-start gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-base">{edu.institution}</h4>
                          <p className="text-xs font-semibold text-indigo-400">{edu.degree}</p>
                          <p className="text-xs text-slate-400">{edu.field_of_study}</p>
                          <p className="text-[11px] font-mono text-slate-500 mt-2">
                            {edu.start_year} — {edu.end_year || 'Present'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEduModal(edu)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEdu(edu.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenSkillModal(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Skill</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">{skill.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{skill.category} • {skill.level}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenSkillModal(skill)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Experience Modal */}
      <ExperienceFormModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        onSave={handleSaveExp}
        experience={editingExp}
        isSaving={isExpSaving}
      />

      {/* Education Modal */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingEdu ? 'Edit Education' : 'Add Education Record'}
              </h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdu} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Institution</label>
                <input
                  type="text"
                  required
                  value={eduFormData.institution}
                  onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                  placeholder="e.g. ITB / Stanford University"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Degree</label>
                <input
                  type="text"
                  required
                  value={eduFormData.degree}
                  onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Field of Study</label>
                <input
                  type="text"
                  required
                  value={eduFormData.field_of_study}
                  onChange={(e) => setEduFormData({ ...eduFormData, field_of_study: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-mono">Start Year</label>
                  <input
                    type="number"
                    required
                    value={eduFormData.start_year}
                    onChange={(e) => setEduFormData({ ...eduFormData, start_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-mono">End Year</label>
                  <input
                    type="number"
                    value={eduFormData.end_year || ''}
                    onChange={(e) => setEduFormData({ ...eduFormData, end_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
              </h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                  placeholder="e.g. Next.js, Kubernetes"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Category</label>
                <select
                  value={skillFormData.category}
                  onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Database">Database</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Proficiency Level</label>
                <select
                  value={skillFormData.level}
                  onChange={(e) => setSkillFormData({ ...skillFormData, level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white"
                >
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Beginner">Beginner</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCV
