import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Music, 
  Disc3, 
  ListMusic, 
  X, 
  Sparkles,
  Radio,
  Minimize2
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

/**
 * Format raw seconds to MM:SS
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
}

/**
 * Animated Waveform Equalizer Component
 * Displays 4 dynamic oscillating bars when playing, or resting state when paused
 */
const WaveformEqualizer = ({ isPlaying, className = '' }) => {
  return (
    <div className={`flex items-end gap-[3px] h-4.5 px-0.5 ${className}`} aria-label="Audio Equalizer">
      <motion.span
        className="w-1 bg-white rounded-full origin-bottom"
        animate={isPlaying ? { height: ['20%', '95%', '30%', '75%', '20%'] } : { height: '25%' }}
        transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
      />
      <motion.span
        className="w-1 bg-white/90 rounded-full origin-bottom"
        animate={isPlaying ? { height: ['60%', '25%', '100%', '40%', '60%'] } : { height: '40%' }}
        transition={{ repeat: Infinity, duration: 0.72, ease: 'easeInOut', delay: 0.1 }}
      />
      <motion.span
        className="w-1 bg-white/80 rounded-full origin-bottom"
        animate={isPlaying ? { height: ['35%', '80%', '45%', '100%', '35%'] } : { height: '60%' }}
        transition={{ repeat: Infinity, duration: 0.95, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.span
        className="w-1 bg-white/70 rounded-full origin-bottom"
        animate={isPlaying ? { height: ['80%', '30%', '85%', '20%', '80%'] } : { height: '30%' }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut', delay: 0.15 }}
      />
    </div>
  )
}

export const AudioPlayer = () => {
  // Track list and state - Purged of dummy data; only real Supabase dynamic records
  const [tracks, setTracks] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isLiveFromSupabase, setIsLiveFromSupabase] = useState(false)
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [playbackError, setPlaybackError] = useState(null)
  
  // UI visibility state
  const [isScrolledPast, setIsScrolledPast] = useState(false)
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
  const [isBarVisible, setIsBarVisible] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // References
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  const currentTrack = tracks.length > 0 ? (tracks[currentTrackIndex] || tracks[0]) : null

  // 1. SCROLL LISTENER (window.scrollY > 100)
  useEffect(() => {
    const checkScroll = () => {
      const scrolled = window.scrollY > 100
      setIsScrolledPast(scrolled)
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  // 2. SUPABASE INTEGRATION (Fetch ONLY real dynamic records from tracks table)
  useEffect(() => {
    let isMounted = true

    async function loadTracks() {
      try {
        if (!isSupabaseConfigured) {
          // Check local storage for demo tracks if any uploaded in Demo Mode
          const stored = localStorage.getItem('dzaki_demo_tracks')
          if (stored) {
            try {
              const parsed = JSON.parse(stored).filter(t => t.is_active)
              if (isMounted) setTracks(parsed)
              return
            } catch { }
          }
          if (isMounted) setTracks([])
          return
        }

        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true })

        if (error) {
          console.warn('[AudioPlayer] Supabase query notice:', error.message)
          if (isMounted) setTracks([])
        } else if (data && data.length > 0) {
          if (isMounted) {
            setTracks(data)
            setIsLiveFromSupabase(true)
          }
        } else {
          // Clean empty state when no tracks exist
          if (isMounted) setTracks([])
        }
      } catch (err) {
        console.warn('[AudioPlayer] Error fetching tracks:', err)
        if (isMounted) setTracks([])
      }
    }

    loadTracks()

    return () => {
      isMounted = false
    }
  }, [])

  // 3. AUDIO ELEMENT EVENT BINDINGS
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
      setIsLoadingAudio(false)
      setPlaybackError(null)
    }

    const handleEnded = () => {
      handleNext()
    }

    const handleWaiting = () => {
      setIsLoadingAudio(true)
    }

    const handleCanPlay = () => {
      setIsLoadingAudio(false)
      setPlaybackError(null)
    }

    const handleError = (e) => {
      console.warn('[AudioPlayer] Media playback error:', e)
      setIsLoadingAudio(false)
      setPlaybackError('Unable to stream track. Try another track.')
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [currentTrackIndex, tracks])

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Sync track source when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    const previousPlayingState = isPlaying
    audio.src = currentTrack.audio_url
    audio.load()

    if (previousPlayingState) {
      audio.play().catch((err) => {
        console.log('[AudioPlayer] Playback autoplay interaction note:', err)
        setIsPlaying(false)
      })
    }
  }, [currentTrackIndex, tracks])

  // 4. AUDIO CONTROLS
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoadingAudio(true)
      audio.play()
        .then(() => {
          setIsPlaying(true)
          setIsBarVisible(true) // Automatically show bottom player bar on play
          setPlaybackError(null)
        })
        .catch((err) => {
          console.warn('[AudioPlayer] Interaction error:', err)
          setIsPlaying(false)
        })
        .finally(() => {
          setIsLoadingAudio(false)
        })
    }
  }, [isPlaying])

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    setIsPlaying(true)
    setIsBarVisible(true)
  }, [tracks.length])

  const handlePrev = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
      setIsPlaying(true)
      setIsBarVisible(true)
    }
  }, [tracks.length])

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
    setIsBarVisible(true)
  }

  const handleSeek = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = clickX / rect.width
    const targetTime = percentage * duration
    audioRef.current.currentTime = targetTime
    setCurrentTime(targetTime)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Hidden HTML5 Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* ========================================================================= */}
      {/* COMPONENT A: FLOATING TRIGGER BUTTON (Bottom Right)                       */}
      {/* Scroll-triggered: Hidden when window.scrollY <= 100, fades in past 100px */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isScrolledPast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 select-none"
          >
            <div className="relative group">
              {/* Outer Glow Halo when playing */}
              {isPlaying && (
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 blur-md opacity-75 animate-pulse-slow" />
              )}

              {/* Main Circular Button */}
              <button
                id="audio-player-trigger-btn"
                onClick={() => {
                  setIsPlaylistOpen((prev) => !prev)
                  if (!isBarVisible && isPlaying) setIsBarVisible(true)
                }}
                title={isPlaying && currentTrack ? `Playing: ${currentTrack.title}` : tracks.length > 0 ? 'Open Audio Player' : 'No music tracks available'}
                aria-label="Toggle Audio Player"
                className={`
                  relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                  backdrop-blur-xl bg-neutral-950/75 border border-white/15 
                  shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40 hover:bg-white/15
                  active:scale-95 transition-all duration-300
                  ${isPlaylistOpen ? 'ring-2 ring-white/40 bg-white/10' : ''}
                `}
              >
                {isPlaying ? (
                  <WaveformEqualizer isPlaying={isPlaying} />
                ) : (
                  <Music className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                )}

                {/* Live Supabase Pulse Indicator Dot */}
                {isLiveFromSupabase && tracks.length > 0 && (
                  <span 
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                    title="Live connected to Supabase tracks"
                  />
                )}
              </button>

              {/* Floating Tooltip Pill (Desktop Hover) */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block whitespace-nowrap">
                <div className="backdrop-blur-xl bg-neutral-950/85 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-white/40'}`} />
                  <span className="font-medium">
                    {isPlaying && currentTrack 
                      ? `Playing: ${currentTrack.title}` 
                      : tracks.length > 0 
                        ? 'Ambient Soundtrack' 
                        : 'No music tracks available'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COMPONENT B: FLOATING PLAYLIST POPUP (Bottom Right, Above Trigger)        */}
      {/* Liquid Glass Card displaying tracks fetched from Supabase                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPlaylistOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 max-w-sm select-none"
          >
            <div className="backdrop-blur-xl bg-neutral-950/85 border border-white/10 shadow-[0_12px_40px_0_rgba(0,0,0,0.65)] rounded-2xl overflow-hidden p-4 sm:p-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <ListMusic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                      Soundtrack
                      {isLiveFromSupabase && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Supabase
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Atmospheric code & design beats
                    </p>
                  </div>
                </div>

                {/* Close Button with Glowing Hover State */}
                <button
                  id="close-playlist-popup-btn"
                  onClick={() => setIsPlaylistOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-300"
                  aria-label="Close Playlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable List of Tracks or Empty State */}
              {tracks.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-500 shadow-inner">
                    <Music className="w-6 h-6 opacity-60" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-200">No music tracks available</p>
                  <p className="text-[11px] text-zinc-500 mt-1 max-w-[220px] mx-auto">
                    Upload music tracks in Admin CMS to start streaming.
                  </p>
                </div>
              ) : (
                <div className="mt-3.5 space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {tracks.map((track, idx) => {
                    const isCurrent = idx === currentTrackIndex
                    const isCurrentPlaying = isCurrent && isPlaying

                    return (
                      <div
                        key={track.id || idx}
                        onClick={() => handleSelectTrack(idx)}
                        className={`
                          group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer
                          border transition-all duration-300
                          ${isCurrent 
                            ? 'bg-white/15 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                            : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.18)]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {/* Play/Equalizer Indicator Icon */}
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300
                            ${isCurrentPlaying
                              ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                              : 'bg-white/5 border-white/10 text-white group-hover:bg-white/20 group-hover:border-white/30'
                            }
                          `}>
                            {isCurrentPlaying ? (
                              <WaveformEqualizer isPlaying={true} className="text-black" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </div>

                          {/* Title & Artist */}
                          <div className="min-w-0">
                            <p className={`text-xs font-medium truncate ${isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                              {track.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {track.artist || 'Dzaki Luqman'}
                            </p>
                          </div>
                        </div>

                        {/* Duration String */}
                        <div className="shrink-0 text-right">
                          <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200">
                            {track.duration || '03:00'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Bottom Quick Controls & Player Bar Launcher */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'} Available</span>
                </div>

                {tracks.length > 0 && (
                  <button
                    onClick={() => setIsBarVisible((prev) => !prev)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 flex items-center gap-1.5"
                  >
                    <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                    {isBarVisible ? 'Hide Controls' : 'Show Controls'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COMPONENT C: FLOATING BOTTOM AUDIO PLAYER BAR (Bottom Center)             */}
      {/* Pill-shaped liquid glass bar positioned fixed bottom-6 left-1/2           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBarVisible && currentTrack && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95vw] sm:w-[90vw] md:w-[700px] max-w-2xl select-none"
          >
            <div className="backdrop-blur-xl bg-neutral-950/80 border border-white/15 shadow-[0_12px_45px_0_rgba(0,0,0,0.7)] rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                
                {/* 1. Track Info & Spinning Vinyl Disc */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[130px] sm:max-w-[200px]">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-md">
                    <Disc3 className={`w-full h-full text-zinc-300 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    <span className="absolute w-2 h-2 rounded-full bg-white/80" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate tracking-tight">
                      {currentTrack.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                      {currentTrack.artist || 'Dzaki Luqman'}
                    </p>
                  </div>
                </div>

                {/* 2. Playback Control Group & Dynamic Progress */}
                <div className="flex-1 flex flex-col items-center max-w-xs sm:max-w-sm px-1 sm:px-2">
                  
                  {/* Control Buttons Group */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    {/* Previous Button */}
                    <button
                      id="audio-prev-btn"
                      onClick={handlePrev}
                      className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Previous Track"
                    >
                      <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Play / Pause Toggle Button */}
                    <button
                      id="audio-play-pause-btn"
                      onClick={togglePlayPause}
                      className="p-2 sm:p-2.5 rounded-full bg-white text-black border border-white hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Next Button */}
                    <button
                      id="audio-next-btn"
                      onClick={handleNext}
                      className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Next Track"
                    >
                      <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Progress Bar & Timers */}
                  <div className="w-full flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 w-8 sm:w-9 text-right shrink-0">
                      {formatTime(currentTime)}
                    </span>

                    {/* Progress Bar Track with active glow indicator */}
                    <div
                      ref={progressBarRef}
                      onClick={handleSeek}
                      className="relative flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden group/bar hover:h-2.5 transition-all duration-200"
                    >
                      {/* Active Fill */}
                      <div
                        className="h-full bg-gradient-to-r from-zinc-200 via-white to-zinc-100 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all duration-100 relative"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        {/* Glow head */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400 w-8 sm:w-9 text-left shrink-0">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* 3. Volume Control & Auxiliary Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Volume Toggle / Popover */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      id="audio-volume-toggle-btn"
                      onClick={toggleMute}
                      className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Volume Control"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>

                    {/* Volume Slider Popover */}
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl backdrop-blur-xl bg-neutral-950/90 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-center gap-2 z-50"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 sm:w-24 accent-white cursor-pointer"
                          />
                          <span className="text-[10px] font-mono text-zinc-300">
                            {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Playlist Toggle in Bar */}
                  <button
                    id="audio-bar-playlist-btn"
                    onClick={() => setIsPlaylistOpen((prev) => !prev)}
                    className={`p-1.5 sm:p-2 rounded-full border transition-all duration-300 active:scale-95 ${
                      isPlaylistOpen 
                        ? 'bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                    }`}
                    title="Toggle Playlist"
                    aria-label="Toggle Playlist"
                  >
                    <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Minimize Bar Button */}
                  <button
                    id="audio-bar-minimize-btn"
                    onClick={() => setIsBarVisible(false)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                    title="Minimize Player"
                    aria-label="Minimize Player"
                  >
                    <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Playback Error Warning (if any) */}
              {playbackError && (
                <div className="mt-2 text-center text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full py-0.5 px-3">
                  {playbackError}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AudioPlayer
