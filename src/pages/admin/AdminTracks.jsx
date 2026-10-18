import React, { useState, useEffect, useRef } from 'react'
import {
  Plus,
  Trash2,
  Play,
  Pause,
  Music,
  Disc3,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  FileAudio,
  Clock,
  Sparkles,
  ArrowUpDown,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

/**
 * Converts a File object to a Base64 data URL (useful for Demo mode)
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const AdminTracks = () => {
  const { isDemoMode } = useAuth()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState(null)
  
  // Track Deletion Confirmation State
  const [trackToDelete, setTrackToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Audio Preview State in Table
  const [previewTrackId, setPreviewTrackId] = useState(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef(new Audio())

  // Form State
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('Dzakii Luqman Faid')
  const [audioFile, setAudioFile] = useState(null)
  const [duration, setDuration] = useState('00:00')
  const [orderIndex, setOrderIndex] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [fileDetails, setFileDetails] = useState(null)

  const showNotification = (message, type = 'success', description = '') => {
    setNotification({ message, type, description })
    setTimeout(() => setNotification(null), 6000)
  }

  // Fetch Tracks from Supabase
  const fetchTracks = async () => {
    setLoading(true)
    
    // Check Demo Mode
    if (!isSupabaseConfigured || isDemoMode) {
      const stored = localStorage.getItem('dzaki_demo_tracks')
      if (stored) {
        try {
          setTracks(JSON.parse(stored))
        } catch {
          setTracks([])
        }
      } else {
        setTracks([])
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setTracks(data || [])
    } catch (err) {
      console.error('[AdminTracks] Error fetching tracks:', err)
      showNotification('Failed to load tracks: ' + err.message, 'error')
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracks()

    // Cleanup audio on unmount
    return () => {
      previewAudioRef.current.pause()
      previewAudioRef.current.src = ''
    }
  }, [isDemoMode])

  // Preview Audio playback listener
  useEffect(() => {
    const audio = previewAudioRef.current
    const onEnded = () => {
      setIsPreviewPlaying(false)
      setPreviewTrackId(null)
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  const handleTogglePreview = (track) => {
    const audio = previewAudioRef.current
    if (previewTrackId === track.id && isPreviewPlaying) {
      audio.pause()
      setIsPreviewPlaying(false)
    } else {
      audio.src = track.audio_url
      audio.play()
        .then(() => {
          setPreviewTrackId(track.id)
          setIsPreviewPlaying(true)
        })
        .catch((err) => {
          console.warn('Audio preview error:', err)
          showNotification('Unable to preview audio track.', 'error')
        })
    }
  }

  // 1. AUTOMATIC DURATION CALCULATION LOGIC (Client-Side)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAudioFile(file)
    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'audio/mpeg'
    })

    // Auto-fill Title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setTitle(cleanName)
    }

    // Client-side automatic duration detection
    const audio = new Audio()
    const objectUrl = URL.createObjectURL(file)
    audio.src = objectUrl

    audio.onloadedmetadata = () => {
      const totalSeconds = Math.floor(audio.duration)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

      // Auto-fill duration state (e.g., "04:21")
      setDuration(formattedDuration)
      URL.revokeObjectURL(objectUrl)
    }

    audio.onerror = () => {
      console.warn('[AdminTracks] Could not detect duration from audio file metadata.')
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleOpenModal = () => {
    setTitle('')
    setArtist('Dzakii Luqman Faid')
    setAudioFile(null)
    setDuration('00:00')
    setOrderIndex(tracks.length > 0 ? Math.max(...tracks.map(t => t.order_index || 0)) + 1 : 1)
    setIsActive(true)
    setFileDetails(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isSaving) return
    setIsModalOpen(false)
    setAudioFile(null)
    setFileDetails(null)
  }

  // 2. SUPABASE UPLOAD & INSERT PIPELINE
  const handleSubmitTrack = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      showNotification('Track title is required.', 'error')
      return
    }
    if (!audioFile) {
      showNotification('Please select an audio file (.mp3, .wav, .m4a).', 'error')
      return
    }

    setIsSaving(true)

    try {
      let publicAudioUrl = ''

      // A. Demo Mode Fallback
      if (!isSupabaseConfigured || isDemoMode) {
        publicAudioUrl = await fileToDataUrl(audioFile)
        const newDemoTrack = {
          id: 'demo-track-' + Date.now(),
          title: title.trim(),
          artist: artist.trim() || 'Dzakii Luqman Faid',
          audio_url: publicAudioUrl,
          duration: duration || '03:00',
          order_index: Number(orderIndex) || 0,
          is_active: Boolean(isActive),
          created_at: new Date().toISOString()
        }
        const updated = [...tracks, newDemoTrack].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        setTracks(updated)
        localStorage.setItem('dzaki_demo_tracks', JSON.stringify(updated))
        showNotification('Track added successfully (Demo Mode)!', 'success')
        handleCloseModal()
        setIsSaving(false)
        return
      }

      // B. Real Supabase Storage Upload
      const fileExt = audioFile.name.split('.').pop().toLowerCase()
      const sanitizedName = `track-${Date.now()}.${fileExt}`
      const filePath = sanitizedName

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(filePath, audioFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: audioFile.type || `audio/${fileExt}`
        })

      if (uploadError) {
        console.error('[AdminTracks] Supabase storage upload error:', uploadError)
        throw new Error(
          uploadError.message.includes('Bucket not found')
            ? "Storage bucket 'audio-tracks' not found. Please create the 'audio-tracks' bucket in your Supabase dashboard or run the migration in supabase_schema.sql."
            : uploadError.message
        )
      }

      // C. Retrieve Public URL
      const { data: urlData } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(filePath)

      publicAudioUrl = urlData.publicUrl

      // D. Insert Record into tracks table
      const { data: insertData, error: insertError } = await supabase
        .from('tracks')
        .insert([
          {
            title: title.trim(),
            artist: artist.trim() || 'Dzakii Luqman Faid',
            audio_url: publicAudioUrl,
            duration: duration || '03:00',
            order_index: Number(orderIndex) || 0,
            is_active: Boolean(isActive)
          }
        ])
        .select()

      if (insertError) throw insertError

      showNotification('Track uploaded and saved to Supabase successfully!', 'success')
      handleCloseModal()
      fetchTracks()
    } catch (err) {
      console.error('[AdminTracks] Upload error:', err)
      showNotification('Upload failed: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // 3. TRACK DELETE PIPELINE
  const handleDeleteTrack = async (track) => {
    setIsDeleting(true)

    try {
      // Demo Mode
      if (!isSupabaseConfigured || isDemoMode) {
        const updated = tracks.filter((t) => t.id !== track.id)
        setTracks(updated)
        localStorage.setItem('dzaki_demo_tracks', JSON.stringify(updated))
        showNotification(`Track "${track.title}" deleted (Demo Mode).`, 'success')
        setTrackToDelete(null)
        setIsDeleting(false)
        return
      }

      // Real Supabase Purge: Purge audio file from storage if present
      if (track.audio_url && track.audio_url.includes('audio-tracks')) {
        const segments = track.audio_url.split('/audio-tracks/')
        if (segments.length > 1) {
          const rawPath = segments[1].split('?')[0]
          if (rawPath) {
            const { error: storageError } = await supabase.storage
              .from('audio-tracks')
              .remove([decodeURIComponent(rawPath)])
            if (storageError) {
              console.warn('[AdminTracks] Storage purge note:', storageError.message)
            }
          }
        }
      }

      // Purge row from tracks table
      const { error: dbError } = await supabase
        .from('tracks')
        .delete()
        .eq('id', track.id)

      if (dbError) throw dbError

      showNotification(`Track "${track.title}" deleted successfully!`, 'success')
      setTrackToDelete(null)
      fetchTracks()
    } catch (err) {
      console.error('[AdminTracks] Delete error:', err)
      showNotification('Delete failed: ' + err.message, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Toggle is_active inline in the table
  const handleToggleActive = async (track) => {
    const updatedStatus = !track.is_active

    // Optimistic UI update
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, is_active: updatedStatus } : t))

    if (!isSupabaseConfigured || isDemoMode) {
      const updated = tracks.map(t => t.id === track.id ? { ...t, is_active: updatedStatus } : t)
      localStorage.setItem('dzaki_demo_tracks', JSON.stringify(updated))
      showNotification(`Track set to ${updatedStatus ? 'Active' : 'Inactive'} (Demo Mode)`, 'success')
      return
    }

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ is_active: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', track.id)

      if (error) throw error
      showNotification(`Track "${track.title}" is now ${updatedStatus ? 'Active' : 'Inactive'}.`, 'success')
    } catch (err) {
      console.error('Toggle status error:', err)
      showNotification('Failed to update status: ' + err.message, 'error')
      // Revert optimistic update
      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, is_active: !updatedStatus } : t))
    }
  }

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Soundtrack Management" />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Notification Toast */}
          {notification && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
                notification.type === 'error'
                  ? 'bg-rose-950/70 border-rose-800 text-rose-200'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  {notification.description && (
                    <p className="text-xs opacity-80 mt-0.5">{notification.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Disc3 className="w-5 h-5 text-zinc-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">Audio Lounge Tracks</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 font-mono">
                  {tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'}
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                Upload and manage background audio tracks streamed by the floating portfolio player.
              </p>
            </div>

            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Upload New Track
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-mono tracking-wider">Total Tracks</p>
                <p className="text-2xl font-bold text-white mt-1">{tracks.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                <Music className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-mono tracking-wider">Active in Player</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {tracks.filter((t) => t.is_active).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-mono tracking-wider">Storage Target</p>
                <p className="text-sm font-semibold text-white mt-1.5 flex items-center gap-1.5 font-mono">
                  audio-tracks
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    Bucket
                  </span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tracks Table / List */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <LoadingSpinner text="Loading soundtrack records..." />
              </div>
            ) : tracks.length === 0 ? (
              <div className="py-20 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500 shadow-inner">
                  <Music className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">No Music Tracks Found</h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
                  You haven't uploaded any music tracks yet. Click below to add your first track.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Upload First Track
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Track Info</th>
                      <th className="py-3 px-4">Artist</th>
                      <th className="py-3 px-4 w-28">Duration</th>
                      <th className="py-3 px-4 w-28 text-center">Status</th>
                      <th className="py-3 px-4 w-32 text-center">Preview</th>
                      <th className="py-3 px-4 w-20 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {tracks.map((track, idx) => {
                      const isThisPreviewPlaying = previewTrackId === track.id && isPreviewPlaying

                      return (
                        <tr
                          key={track.id || idx}
                          className="hover:bg-zinc-900/40 transition-colors group"
                        >
                          {/* Order Index */}
                          <td className="py-3.5 px-4 text-center text-xs font-mono text-zinc-500">
                            {track.order_index ?? idx + 1}
                          </td>

                          {/* Title & Storage Link */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
                                <Disc3 className={`w-4 h-4 ${isThisPreviewPlaying ? 'animate-spin text-white' : ''}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                                  {track.title}
                                </p>
                                {track.audio_url && (
                                  <a
                                    href={track.audio_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono truncate max-w-[200px]"
                                  >
                                    View Source
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Artist */}
                          <td className="py-3.5 px-4 text-zinc-300 text-xs">
                            {track.artist || 'Dzakii Luqman Faid'}
                          </td>

                          {/* Duration */}
                          <td className="py-3.5 px-4 font-mono text-xs text-zinc-400">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {track.duration || '00:00'}
                            </span>
                          </td>

                          {/* Status Toggle Switch */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleActive(track)}
                              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all duration-200 ${
                                track.is_active
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                              }`}
                              title="Click to toggle visibility in player"
                            >
                              {track.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>

                          {/* Inline Audio Preview Button */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleTogglePreview(track)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                                isThisPreviewPlaying
                                  ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                              }`}
                            >
                              {isThisPreviewPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span>Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Preview</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Delete Button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setTrackToDelete(track)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                              title="Delete track"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD NEW MUSIC TRACK                                            */}
      {/* With Automatic Client-Side Duration Detection                            */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Upload Soundtrack Record</h2>
                  <p className="text-xs text-zinc-400">Audio file with auto-calculated duration</p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitTrack} className="p-6 space-y-4">
              
              {/* Audio File Upload Dropzone */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Audio File (.mp3, .wav, .m4a) *
                </label>
                <div className="relative border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-5 text-center transition-colors bg-zinc-900/30">
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,audio/mp3,audio/wav,audio/m4a,audio/*"
                    onChange={handleFileChange}
                    disabled={isSaving}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />

                  {audioFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <FileAudio className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white truncate max-w-xs">
                          {fileDetails?.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {fileDetails?.size} • Auto Duration:{' '}
                          <span className="font-mono text-emerald-400 font-semibold">{duration}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                      <p className="text-sm font-medium text-zinc-300">
                        Click or drag audio file here
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Supports MP3, WAV, M4A up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Track Title */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Track Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Coding Beats"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Artist (Default: Dzakii Luqman Faid)
                </label>
                <input
                  type="text"
                  placeholder="Dzakii Luqman Faid"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Grid: Duration (Auto-Calculated) & Order Index */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    Duration (MM:SS)
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="03:45"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isSaving}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400 uppercase">
                      Auto
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    Order Index
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Is Active Toggle Switch */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Active in Audio Player</p>
                  <p className="text-xs text-zinc-400">Stream track in the public floating player</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  disabled={isSaving}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-white' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                      isActive ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="sm" text="" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload & Publish</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                               */}
      {/* Removes row from DB & purges audio file from audio-tracks storage bucket */}
      {/* ========================================================================= */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Music Track?</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{trackToDelete.title}"</strong>?
                This action will delete the database record and purge the audio file from the <span className="font-mono text-zinc-300">audio-tracks</span> storage bucket.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDeleteTrack(trackToDelete)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-rose-950 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTracks
