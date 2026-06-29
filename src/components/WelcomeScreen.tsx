'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, ArrowRight, Linkedin } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { BrandMark } from './Logo'
import { leakageTotal } from '../data'

const EXIT_MS = 360
const AUTO_ADVANCE_MS = 10000
const STORAGE_KEY = 'stc_welcome_seen'
const MAX_SHOWS = 3
const DEV = import.meta.env.DEV

export function WelcomeScreen() {
  const { welcomeOpen, dismissWelcome, startTour } = useApp()
  const [visible, setVisible] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const actedRef = useRef(false)

  /* Check localStorage on mount — suppress after MAX_SHOWS visits. In dev, always show. */
  useEffect(() => {
    if (DEV) { setShouldShow(true); return }
    try {
      const count = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
      if (count < MAX_SHOWS) {
        localStorage.setItem(STORAGE_KEY, String(count + 1))
        setShouldShow(true)
      } else {
        dismissWelcome()
      }
    } catch {
      setShouldShow(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Fade in once we know we're showing. */
  useEffect(() => {
    if (!shouldShow) return
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [shouldShow])

  const finish = useCallback((action: () => void) => {
    if (actedRef.current) return
    actedRef.current = true
    setVisible(false)
    window.setTimeout(action, EXIT_MS)
  }, [])

  const goTour    = useCallback(() => finish(startTour),    [finish, startTour])
  const goExplore = useCallback(() => finish(dismissWelcome), [finish, dismissWelcome])

  /* Esc dismisses; lock background scroll. */
  useEffect(() => {
    if (!welcomeOpen || !shouldShow) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') goExplore() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [welcomeOpen, shouldShow, goExplore])

  /* Auto-advance unattended links into the tour. */
  useEffect(() => {
    if (!shouldShow) return
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = window.setTimeout(goTour, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [shouldShow, goTour])

  if (!welcomeOpen || !shouldShow) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* Backdrop */}
      <div
        onClick={goExplore}
        className={`absolute inset-0 bg-base-950/85 backdrop-blur-md transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={`glass relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.10] shadow-2xl transition-all duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.97] opacity-0'}`}
      >
        {/* Subtle accent glow — top right only, calm */}
        <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative p-7 sm:p-9">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/30">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-accent/15 opacity-50 blur-md" />
              <BrandMark className="relative h-6 w-6" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[14px] font-bold tracking-tight">
                <span className="text-white">Southern</span><span className="text-accent">Tier</span>
                <span className="text-slate-500"> Telecommunications</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Executive Review</p>
            </div>
          </div>

          {/* Headline */}
          <h1
            id="welcome-title"
            className="mt-7 font-display text-[26px] font-bold leading-tight tracking-tight text-white sm:text-3xl"
          >
            Here's what a modernized<br className="hidden sm:block" /> back office looks like.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            An estimated{' '}
            <span className="font-semibold text-white">${leakageTotal.toLocaleString('en-US')}/yr</span>{' '}
            is slipping through the gaps between Paychex, PenguinData, and QuickBooks.
            This prototype shows the operating model that closes it — built specifically for Southern Tier.
          </p>

          {/* Three pillars — clean, no icon clutter */}
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[
              { label: 'Systems connected', body: 'Your existing tools stay. One governed layer links them.' },
              { label: 'Onboarding automated', body: 'A new hire provisions accounts and fleet in a single pass.' },
              { label: 'Nothing lost silently', body: 'Every exception routes to a person before it becomes a problem.' },
            ].map(p => (
              <div key={p.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3">
                <p className="text-[12px] font-semibold text-slate-100">{p.label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{p.body}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={goTour}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.75)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Take the tour
            </button>
            <button
              onClick={goExplore}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              Explore on my own
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col gap-1.5 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-600">
              Illustrative figures — to be validated in week one.
            </p>
            <a
              href="https://www.linkedin.com/in/kohronburton/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[11px] text-slate-500 transition-colors hover:text-accent"
            >
              <span>Built by <span className="font-medium text-slate-400 group-hover:text-accent">Kohron Burton</span></span>
              <Linkedin className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
