import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export const LetsConnect = ({ profile }) => {
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
        await new Promise((r) => setTimeout(r, 500))
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
      console.error('Contact submission error:', err)
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Failed to transmit message. Please try again or reach out directly via email.'
      })
    }
  }

  const email = profile?.social_links?.email || 'dzakiluqman275@gmail.com'
  const github = profile?.social_links?.github || 'https://github.com/dzakiluqman'
  const linkedin = profile?.social_links?.linkedin || 'https://linkedin.com/in/dzakiluqman'
  const instagram = profile?.social_links?.instagram || 'https://www.instagram.com/dzak.ii_/'
  const location = profile?.location || 'Kota Magelang, Indonesia'

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: High-Impact Typography & Clean Direct Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-zinc-100 tracking-tight font-sans leading-tight">
                Let's build something <span className="font-semibold text-white">extraordinary</span> together.
              </h2>
              <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed font-sans max-w-xl">
                Available for technical architecture consulting, software engineering leadership, 
                and select digital product collaborations.
              </p>
            </div>

            {/* Direct Channels & Social Links */}
            <div className="space-y-4 pt-2">
              {/* Email Link */}
              <a
                href={`mailto:${email}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <span className="block text-xs font-sans text-zinc-500 uppercase tracking-wider">
                    Direct Inquiry
                  </span>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors font-sans">
                    {email}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
              </a>

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300">
                <span className="block text-xs font-sans text-zinc-500 uppercase tracking-wider">
                  Location & Timezone
                </span>
                <span className="text-sm font-medium text-zinc-200 font-sans">
                  {location} (UTC+7)
                </span>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors duration-200 font-sans"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                </a>
                <span className="text-zinc-700">·</span>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors duration-200 font-sans"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                </a>
                <span className="text-zinc-700">·</span>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors duration-200 font-sans"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Sleek Liquid-Glass Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/[0.03] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl transition-all duration-300">
              {/* Success Notification */}
              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-white/10 border border-white/20 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-sans">
                    <p className="font-medium text-white">Message Delivered Successfully</p>
                    <p className="text-zinc-300 mt-0.5">
                      Thank you for reaching out. I will review your message and respond promptly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Notification */}
              {status.error && (
                <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-700 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-sans">
                    <p className="font-medium text-zinc-200">Submission Notice</p>
                    <p className="text-zinc-400 mt-0.5">{status.error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="sender_name" 
                      className="block text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider mb-2"
                    >
                      Your Name <span className="text-zinc-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="sender_name"
                      name="sender_name"
                      required
                      value={formData.sender_name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="sender_email" 
                      className="block text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider mb-2"
                    >
                      Email Address <span className="text-zinc-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="sender_email"
                      name="sender_email"
                      required
                      value={formData.sender_email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all font-sans text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="subject" 
                    className="block text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Engineering Consultation"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all font-sans text-sm"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider mb-2"
                  >
                    Message <span className="text-zinc-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your project scope, timeline, and engineering needs..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all font-sans text-sm resize-y"
                  />
                </div>

                {/* Subtle Glassmorphic Action Button */}
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 font-sans flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {status.submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LetsConnect
