import React, { useState, useEffect } from 'react'
import { useProgress, useGLTF } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import dlLogo from '../assets/images/dl-logo.png'

// Top-level module preloading to trigger instant network fetch of 3D assets
useGLTF.preload('/models/newmodel.glb')
useGLTF.preload('/newmodel.glb')

export const Preloader = () => {
  // Strict Real-Time Resource Tracking via Drei useProgress
  const { progress, loaded, total, active } = useProgress()
  const [isExited, setIsExited] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Lock body scroll while preloading; restore once curtain slide completes
  useEffect(() => {
    if (isAdmin) {
      document.body.style.overflow = 'unset'
      return
    }

    if (!isExited) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isExited, isAdmin])

  // Trigger exit ONLY when all assets are genuinely downloaded (progress === 100, loaded === total, active === false)
  // followed by a 200ms grace period for GPU shader compilation
  useEffect(() => {
    if (isAdmin) {
      setIsExited(true)
      return
    }

    let graceTimer = null

    // Exact state guard: 100% progress, all queued assets resolved, and loading inactive
    const isFullyLoaded = progress === 100 && loaded === total && !active

    if (isFullyLoaded) {
      graceTimer = setTimeout(() => {
        setIsExited(true)
      }, 200)
    }

    return () => {
      if (graceTimer) clearTimeout(graceTimer)
    }
  }, [progress, loaded, total, active, isAdmin])

  // Safety guard for non-3D views or edge network timeouts (zero impact during normal load)
  useEffect(() => {
    if (isAdmin) return
    const safetyTimer = setTimeout(() => {
      setIsExited(true)
    }, 6000)
    return () => clearTimeout(safetyTimer)
  }, [isAdmin])

  if (isAdmin) {
    return null
  }

  // Pure mathematical reflection of real bytes loaded — NO fake intervals or artificial progression
  const roundedProgress = Math.min(Math.max(Math.round(progress), 0), 100)
  const formattedProgress = String(roundedProgress).padStart(2, '0')

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = 'unset'
      }}
    >
      {!isExited && (
        <motion.div
          key="editorial-preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] bg-[#000000] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
          aria-live="polite"
          aria-label="Loading portfolio assets"
        >
          {/* Subtle warm neutral ambient vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

          {/* Top Bar */}
          <header className="relative z-10 w-full flex items-center justify-between">
            {/* Top-Left: Clean 32px dl-logo */}
            <div className="flex items-center gap-3">
              <img
                src={dlLogo}
                alt="DL"
                className="h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallbackEl = document.getElementById('editorial-logo-fallback')
                  if (fallbackEl) fallbackEl.style.display = 'block'
                }}
              />
              <span
                id="editorial-logo-fallback"
                className="hidden font-sans text-sm font-semibold tracking-wider text-slate-200"
              >
                DL
              </span>
            </div>

            {/* Top-Right: Minimal status label */}
            <span className="text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.22em] text-slate-400">
              DZAKII LUQMAN FAID • PORTFOLIO 2026
            </span>
          </header>

          {/* Center Focus: Strict Genuine Loading Percentage Counter */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto">
            <div className="flex items-baseline select-none">
              <span className="text-7xl md:text-9xl font-light tracking-tighter text-slate-100 font-sans tabular-nums leading-none">
                {formattedProgress}
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-500 ml-2 md:ml-3 font-sans">
                %
              </span>
            </div>
          </main>

          {/* Bottom Footer */}
          <footer className="relative z-10 w-full">
            {/* Ultra-thin 1px progress track line */}
            <div className="w-full h-[1px] bg-slate-800/80 relative overflow-hidden mb-3">
              <div
                className="h-full bg-slate-200 transition-all duration-300 ease-out"
                style={{ width: `${roundedProgress}%` }}
              />
            </div>

            {/* Bottom meta text row */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.2em] text-slate-400">
              <span>PRELOADING 3D SCENE & ASSETS</span>
              <span className="text-slate-500 tracking-widest">[ 3D / R3F ]</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
