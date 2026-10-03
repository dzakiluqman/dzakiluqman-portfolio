import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ submitting: true, success: false, error: null })

    try {
      if (!isSupabaseConfigured) {
        // Fallback for demo preview mode: simulate instant submission & save locally
        await new Promise((r) => setTimeout(r, 600))
        const demoMessages = JSON.parse(localStorage.getItem('dzaki_demo_messages') || '[]')
        demoMessages.unshift({
          id: `demo-${Date.now()}`,
          sender_name: formData.sender_name,
          sender_email: formData.sender_email,
          subject: formData.subject || 'No Subject',
          message: formData.message,
          is_read: false,
          created_at: new Date().toISOString()
        })
        localStorage.setItem('dzaki_demo_messages', JSON.stringify(demoMessages))

        setStatus({ submitting: false, success: true, error: null })
        setFormData({ sender_name: '', sender_email: '', subject: '', message: '' })
        return
      }

      // Live Supabase submission
      const { error } = await supabase.from('messages').insert([
        {
          sender_name: formData.sender_name,
          sender_email: formData.sender_email,
          subject: formData.subject || null,
          message: formData.message
        }
      ])

      if (error) throw error

      setStatus({ submitting: false, success: true, error: null })
      setFormData({ sender_name: '', sender_email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Submission error:', err)
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Failed to deliver message. Please try again or reach out directly.'
      })
    }
  }

  return (
    <div className="rounded-2xl bg-dark-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Send a Message</h3>
        <p className="text-sm text-slate-400 mt-1">
          Have an inquiry, consulting request, or project proposal? Drop a message below.
        </p>
      </div>

      {status.success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-emerald-300">Message Delivered Successfully!</h4>
            <p className="text-emerald-400/80 text-xs mt-0.5">
              Thank you for reaching out. I'll review your note and respond promptly.
            </p>
          </div>
        </motion.div>
      )}

      {status.error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-rose-300">Submission Error</h4>
            <p className="text-rose-400/80 text-xs mt-0.5">{status.error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sender_name" className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Your Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="sender_name"
              name="sender_name"
              required
              value={formData.sender_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="sender_email" className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              id="sender_email"
              name="sender_email"
              required
              value={formData.sender_email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Project Consultation / Job Opportunity"
            className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
            Message <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, timeline, and requirements..."
            className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={status.submitting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {status.submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
