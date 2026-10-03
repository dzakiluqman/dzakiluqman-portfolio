import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2, Briefcase } from 'lucide-react'

export const ExperienceFormModal = ({ isOpen, onClose, onSave, experience = null, isSaving = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    employment_type: 'Full-time',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: ''
  })

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || '',
        role: experience.role || '',
        location: experience.location || '',
        employment_type: experience.employment_type || 'Full-time',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        is_current: Boolean(experience.is_current),
        description: experience.description || '',
        achievements: Array.isArray(experience.achievements)
          ? experience.achievements.join('\n')
          : (experience.achievements || '')
      })
    } else {
      setFormData({
        company: '',
        role: '',
        location: '',
        employment_type: 'Full-time',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        achievements: ''
      })
    }
  }, [experience, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        end_date: checked ? '' : prev.end_date
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const achievementsArray = formData.achievements
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      ...formData,
      achievements: achievementsArray,
      end_date: formData.is_current ? null : (formData.end_date || null)
    }

    onSave(payload)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {experience ? 'Edit Experience' : 'Add Work Experience'}
              </h3>
              <p className="text-xs text-slate-400">
                Record your professional roles and accomplishments
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Role / Position <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Lead Software Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / Jakarta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Start Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  disabled={formData.is_current}
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>I am currently working in this role (Present)</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Job Overview
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Core responsibilities and team context..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Key Achievements (One per line)
              </label>
              <textarea
                name="achievements"
                rows={4}
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Architected resilient microservices ecosystem...&#10;Reduced cloud compute costs by 30%..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{experience ? 'Update Experience' : 'Save Experience'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ExperienceFormModal
