import React, { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import dlLogo from '../assets/images/dl-logo.png'

export const Preloader = () => {
  const { progress } = useProgress()
  const [isExited, setIsExited] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Lock and unlock body scroll during loading and after curtain slide completes
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

  // Listen to 3D asset loading progress: delay ~300ms on 100% then trigger curtain exit
  useEffect(() => {
    if (isAdmin) {
      setIsExited(true)
      return
    }

    let delayTimer = null

    if (progress === 100) {
      delayTimer = setTimeout(() => {
        setIsExited(true)
      }, 300)
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer)
    }
  }, [progress, isAdmin])

  // Safety fallback: if no 3D scene loads or network stalls, smoothly dismiss after 4s
  useEffect(() => {
    if (isAdmin) return

    const fallbackTimer = setTimeout(() => {
      setIsExited(true)
    }, 4000)

    return () => clearTimeout(fallbackTimer)
  }, [isAdmin])

  if (isAdmin) {
    return null
  }

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
          className="fixed inset-0 z-[999] bg-[#080b11] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
          aria-live="polite"
          aria-label="Loading portfolio"
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

          {/* Center Focus: Elegant Large Display Percentage Counter */}
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
