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
  Minimize2,
  MoreVertical
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

export const AudioPlayer = () => {
  // Track list and state - Purged of dummy data; only real Supabase dynamic records
  const [tracks, setTracks] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isLiveFromSupabase, setIsLiveFromSupabase] = useState(false)
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [pausedAt, setPausedAt] = useState(0)
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // References
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const pausedTimeRef = useRef(0)
  const handleNextRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const currentTrack = tracks.length > 0 ? (tracks[currentTrackIndex] || tracks[0]) : null

  // Close mobile menu on click outside
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isMobileMenuOpen])

  // 1. SCROLL LISTENER (window.scrollY > 100) with rAF throttle & passive listener
  useEffect(() => {
    let ticking = false
    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 100
          setIsScrolledPast(scrolled)
          if (!scrolled) {
            setIsPlaylistOpen(false)
            setIsMobileMenuOpen(false)
          }
          ticking = false
        })
        ticking = true
      }
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  // 2. SUPABASE INTEGRATION (Deferred fetch of tracks table)
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

    // Defer non-critical audio data load to idle callback or timeout
    let timerId
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        loadTracks()
      }, { timeout: 2000 })
      return () => {
        isMounted = false
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleId)
      }
    } else {
      timerId = setTimeout(() => {
        loadTracks()
      }, 500)
      return () => {
        isMounted = false
        clearTimeout(timerId)
      }
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
      if (handleNextRef.current) {
        handleNextRef.current()
      }
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
  }, [])

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // 4. AUDIO CONTROLS
  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      // 1. Persist currentTime on Pause
      const current = audio.currentTime || 0
      pausedTimeRef.current = current
      setPausedAt(current)
      setCurrentTime(current)
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoadingAudio(true)

      // Do NOT reset audioRef.current.src or reload the media element when toggling play/pause on the same active track
      const currentSrc = audio.src || ''
      const trackUrl = currentTrack.audio_url || ''
      const isSameTrack = currentSrc && (
        currentSrc === trackUrl ||
        currentSrc.endsWith(trackUrl) ||
        currentSrc.includes(encodeURI(trackUrl)) ||
        decodeURIComponent(currentSrc).includes(trackUrl)
      )

      if (!isSameTrack) {
        audio.src = trackUrl
      }

      // 2. Resume from Saved Timestamp
      const resumeTime = pausedTimeRef.current || pausedAt || currentTime || 0
      if (typeof resumeTime === 'number' && resumeTime > 0) {
        audio.currentTime = resumeTime
      }

      audio.play()
        .then(() => {
          setIsPlaying(true)
          setIsBarVisible(true) // Automatically show bottom player bar on play
          setPlaybackError(null)
        })
        .catch((err) => {
          console.warn('[AudioPlayer] Playback error:', err)
          setIsPlaying(false)
        })
        .finally(() => {
          setIsLoadingAudio(false)
        })
    }
  }, [isPlaying, currentTrack, pausedAt, currentTime])

  const togglePlayPause = handlePlayPause

  // When switching tracks or loading a new track:
  const handleSelectTrack = useCallback((trackOrIndex, maybeIndex) => {
    let index = typeof trackOrIndex === 'number' ? trackOrIndex : maybeIndex
    let track = typeof trackOrIndex === 'object' && trackOrIndex !== null ? trackOrIndex : tracks[index]

    if (index === undefined || index === null) {
      index = tracks.findIndex((t) => t.id === track?.id || t.audio_url === track?.audio_url)
    }
    if (index < 0 || !track) return

    if (currentTrackIndex === index) {
      handlePlayPause()
      return
    }

    setCurrentTrackIndex(index)
    setPausedAt(0)
    pausedTimeRef.current = 0
    setCurrentTime(0)
    setIsPlaying(true)
    setIsBarVisible(true)
    setPlaybackError(null)

    // Load and play new track from 0:00
    const audio = audioRef.current
    if (audio) {
      setIsLoadingAudio(true)
      audio.src = track.audio_url
      audio.currentTime = 0
      audio.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.warn('[AudioPlayer] Playback error:', err)
          setIsPlaying(false)
        })
        .finally(() => {
          setIsLoadingAudio(false)
        })
    }
  }, [currentTrackIndex, tracks, handlePlayPause])

  const handleNext = useCallback(() => {
    if (!tracks || tracks.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    handleSelectTrack(tracks[nextIndex], nextIndex)
  }, [tracks, currentTrackIndex, handleSelectTrack])

  const handlePrev = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      setPausedAt(0)
      pausedTimeRef.current = 0
      setCurrentTime(0)
    } else {
      if (!tracks || tracks.length === 0) return
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
      handleSelectTrack(tracks[prevIndex], prevIndex)
    }
  }, [tracks, currentTrackIndex, handleSelectTrack])

  // Keep handleNextRef synchronized for handleEnded
  useEffect(() => {
    handleNextRef.current = handleNext
  }, [handleNext])

  const handleSeek = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = clickX / rect.width
    const targetTime = percentage * duration
    audioRef.current.currentTime = targetTime
    setCurrentTime(targetTime)
    setPausedAt(targetTime)
    pausedTimeRef.current = targetTime
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
      <audio ref={audioRef} preload="none" />

      {/* ========================================================================= */}
      {/* COMPONENT A: FLOATING TRIGGER BUTTON (Bottom Right)                       */}
      {/* Restored clean music icon, stripped active indicators, refined hover tip  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isScrolledPast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-4 md:right-6 z-40 select-none"
          >
            <div className="relative group">
              {/* Main Circular Button with Centered Clean Music Icon */}
              <button
                id="audio-player-trigger-btn"
                onClick={() => {
                  setIsPlaylistOpen((prev) => !prev)
                  if (!isBarVisible && isPlaying) setIsBarVisible(true)
                }}
                title={currentTrack ? `Playing: ${currentTrack.title}` : 'Tracks'}
                aria-label="Toggle Audio Player"
                className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center backdrop-blur-xl bg-neutral-950/80 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40 hover:bg-white/15 active:scale-95 transition-all duration-300"
              >
                <Music className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
              </button>

              {/* Floating Tooltip Pill (Desktop Hover) */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block whitespace-nowrap">
                <div className="backdrop-blur-xl bg-neutral-950/90 border border-white/15 text-white text-xs px-3.5 py-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-white/40'}`} />
                  <span className="font-medium">
                    Playing: {currentTrack?.title || 'No Track Selected'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COMPONENT B: FLOATING PLAYLIST POPUP (Bottom Right, Above Trigger)        */}
      {/* Anchored fixed bottom-20 right-4 md:right-6 on ALL viewports              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPlaylistOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm backdrop-blur-xl bg-neutral-950/80 border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 select-none"
          >
            {/* Header: Title & Close Button (Always rendered on all devices) */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white tracking-wide">Tracks</h3>
              <button
                id="close-playlist-popup-btn"
                onClick={() => setIsPlaylistOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Playlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable List of Tracks or Empty State */}
            {tracks.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-zinc-500 shadow-inner">
                  <Music className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-xs font-semibold text-zinc-200">No music tracks available</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[220px] mx-auto">
                  Upload music tracks in Admin CMS to start streaming.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-64 sm:max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {tracks.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex
                  const isCurrentPlaying = isCurrent && isPlaying

                  return (
                    <div
                      key={track.id || idx}
                      onClick={() => handleSelectTrack(track, idx)}
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
                        {/* Dynamic Play / Pause State Icon */}
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300
                          ${isCurrentPlaying
                            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                            : 'bg-white/5 border-white/10 text-white group-hover:bg-white/20 group-hover:border-white/30 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                          }
                        `}>
                          {isCurrentPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COMPONENT C: FLOATING BOTTOM AUDIO PLAYER BAR (Bottom Center)             */}
      {/* Strictly horizontally centered wrapper with flex alignment                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isScrolledPast && isBarVisible && currentTrack && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center items-center pointer-events-none select-none px-4"
          >
            <div className="pointer-events-auto w-full sm:w-[85vw] md:w-[600px] max-w-xl">
              <div className="backdrop-blur-xl bg-neutral-950/85 border border-white/15 shadow-[0_10px_35px_0_rgba(0,0,0,0.65)] rounded-full px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 sm:gap-3.5">
                
                {/* 1. Track Info & Spinning Vinyl Disc */}
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 max-w-[120px] sm:max-w-[160px] md:max-w-none">
                  {/* LEFT ALBUM / VINYL DISC ICON WRAPPER */}
                  <div className="hidden md:flex relative w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/20 p-1 items-center justify-center shrink-0 shadow-sm">
                    <Disc3 className={`w-full h-full text-zinc-300 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-white/80" />
                  </div>

                  <div className="flex flex-col min-w-0 max-w-[120px] sm:max-w-[160px] md:max-w-none">
                    <span className="text-xs sm:text-[13px] font-bold text-white truncate tracking-tight">
                      {currentTrack?.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate">
                      {currentTrack?.artist || 'Dzaki Luqman'}
                    </span>
                  </div>
                </div>

                {/* 2. Playback Control Group & Dynamic Progress */}
                <div className="flex-1 flex flex-col items-center max-w-[220px] sm:max-w-[280px] px-1">
                  
                  {/* Control Buttons Group */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    {/* Previous Button */}
                    <button
                      id="audio-prev-btn"
                      onClick={handlePrev}
                      className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Previous Track"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Play / Pause Toggle Button */}
                    <button
                      id="audio-play-pause-btn"
                      onClick={togglePlayPause}
                      className="p-1.5 sm:p-2 rounded-full bg-white text-black border border-white hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Next Button */}
                    <button
                      id="audio-next-btn"
                      onClick={handleNext}
                      className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Next Track"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar & Timers */}
                  <div className="w-full flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 w-7 sm:w-8 text-right shrink-0">
                      {formatTime(currentTime)}
                    </span>

                    {/* Progress Bar Track with active glow indicator */}
                    <div
                      ref={progressBarRef}
                      onClick={handleSeek}
                      className="relative flex-1 h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden group/bar hover:h-2 transition-all duration-200"
                    >
                      {/* Active Fill */}
                      <div
                        className="h-full bg-gradient-to-r from-zinc-200 via-white to-zinc-100 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all duration-100 relative"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        {/* Glow head */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,1)]" />
                      </div>
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 w-7 sm:w-8 text-left shrink-0">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* 3. Volume Control & Auxiliary Actions */}
                {/* DESKTOP ACTIONS (Inline - Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Volume Toggle / Popover */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      id="audio-volume-toggle-btn"
                      onClick={toggleMute}
                      className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                      aria-label="Volume Control"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
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
                          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 p-2 rounded-2xl backdrop-blur-xl bg-neutral-950/90 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-center gap-1.5 z-50"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-18 sm:w-20 accent-white cursor-pointer"
                          />
                          <span className="text-[9px] font-mono text-zinc-300">
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
                    className={`p-1.5 rounded-full border transition-all duration-300 active:scale-95 ${
                      isPlaylistOpen 
                        ? 'bg-white/20 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                    }`}
                    title="Toggle Playlist"
                    aria-label="Toggle Playlist"
                  >
                    <ListMusic className="w-3.5 h-3.5" />
                  </button>

                  {/* Minimize Bar Button */}
                  <button
                    id="audio-bar-minimize-btn"
                    onClick={() => setIsBarVisible(false)}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95"
                    title="Minimize Player"
                    aria-label="Minimize Player"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* MOBILE SINGLE MENU BUTTON (Visible < md) */}
                <div ref={mobileMenuRef} className="relative flex md:hidden items-center shrink-0">
                  <button 
                    id="audio-mobile-menu-btn"
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)} 
                    className={`p-1.5 rounded-full border transition-all duration-300 active:scale-95 ${
                      isMobileMenuOpen 
                        ? 'bg-white/20 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label="Player Options"
                    title="Player Options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* MOBILE DROPDOWN POPOVER */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-3 right-0 w-48 p-3 rounded-2xl bg-neutral-950/95 border border-white/15 backdrop-blur-2xl shadow-[0_12px_36px_0_rgba(0,0,0,0.7)] flex flex-col gap-2.5 z-50 select-none"
                      >
                        {/* Volume Control Row */}
                        <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                          <button
                            type="button"
                            onClick={toggleMute}
                            aria-label="Toggle Mute"
                            className="text-neutral-400 hover:text-white transition-colors shrink-0"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4 text-rose-400" />
                            ) : volume < 0.5 ? (
                              <Volume1 className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={isMuted ? 0 : volume} 
                            onChange={handleVolumeChange}
                            className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer" 
                          />
                          <span className="text-[10px] font-mono text-zinc-400 shrink-0 w-8 text-right">
                            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                          </span>
                        </div>

                        {/* Playlist Option */}
                        <button 
                          id="mobile-menu-playlist-btn"
                          type="button"
                          onClick={() => { 
                            setIsPlaylistOpen((prev) => !prev); 
                            setIsMobileMenuOpen(false); 
                          }}
                          className={`flex items-center gap-2.5 text-xs font-semibold px-2 py-1.5 rounded-xl transition-all ${
                            isPlaylistOpen 
                              ? 'bg-white/15 text-white' 
                              : 'text-neutral-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <ListMusic className="w-4 h-4 text-zinc-300" />
                          <span>Tracks Playlist</span>
                        </button>

                        {/* Minimize Option */}
                        <button 
                          id="mobile-menu-minimize-btn"
                          type="button"
                          onClick={() => { 
                            setIsBarVisible(false); 
                            setIsMobileMenuOpen(false); 
                          }}
                          className="flex items-center gap-2.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-xl transition-all"
                        >
                          <Minimize2 className="w-4 h-4" />
                          <span>Minimize Player</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Playback Error Warning (if any) */}
              {playbackError && (
                <div className="mt-1.5 text-center text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full py-0.5 px-3">
                  {playbackError}
                </div>
              )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AudioPlayer
