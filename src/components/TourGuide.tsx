'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Compass, ArrowLeft, ArrowRight, X, Check } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { PageKey } from '../data'

interface TourStep {
  title: string
  body: string
  page: PageKey
  target?: string // data-tour attribute value; omit for a centered step
}

const STEPS: TourStep[] = [
  {
    title: 'Welcome to the Command Center',
    body: 'A short guided tour of how Southern Tier runs workforce, fleet, projects, and data migration from one cockpit. It takes about a minute — use Next and Back to move at your own pace.',
    page: 'home',
  },
  {
    title: 'Find your way around',
    body: 'Move between executive, operational, and field views from the sidebar on desktop, or the menu button on smaller screens. The page title always shows where you are.',
    page: 'home',
    target: 'topbar',
  },
  {
    title: 'Executive KPIs at a glance',
    body: 'Six headline metrics summarize personnel, crews, projects, fleet, payroll-sync health, and Drive migration — each animates up from its current value.',
    page: 'home',
    target: 'kpis',
  },
  {
    title: 'Exceptions before payroll lock',
    body: 'Items that must be cleared before payroll is finalized surface here in real time. Nothing fails silently — every issue is tracked to resolution.',
    page: 'home',
    target: 'exceptions',
  },
  {
    title: 'The signature workflow',
    body: 'Run New Hire Automation to provision a worker across Paychex, PenguinData, and Fleet — validated step by step, with a complete audit trail for every run.',
    page: 'newhire',
    target: 'runhire',
  },
  {
    title: 'See how failures are handled',
    body: 'Enable the failure variant to simulate a missing driver-license class. The run halts at the vehicle-eligibility check and routes the worker straight to an exception queue.',
    page: 'newhire',
    target: 'failtoggle',
  },
  {
    title: 'Everything propagates here',
    body: 'Each automation run updates Integration Health live. Exceptions are categorized, marked retryable or blocked, and tied back to their source system.',
    page: 'integration',
    target: 'intq',
  },
  {
    title: 'Built for the boardroom',
    body: 'Leadership sees ROI, regional risk, and the transformation roadmap in plain executive language — the same data the field sees, framed for decisions.',
    page: 'board',
    target: 'risk',
  },
  {
    title: 'Present with confidence',
    body: 'Boardroom Mode hides navigation and enlarges cards for screen-share and live presentations. Toggle it any time from here.',
    page: 'board',
    target: 'boardroom',
  },
  {
    title: 'You’re ready to explore',
    body: 'Browse any view at your own pace. Every figure shown is simulated demo data for this prototype — safe to click anything.',
    page: 'home',
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function TourGuide() {
  const { tourActive, endTour, page, setPage } = useApp()
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [vw, setVw] = useState(1280)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isMobile = vw < 640

  // Reset to the first step whenever the tour starts.
  useEffect(() => {
    if (tourActive) setStep(0)
  }, [tourActive])

  // Track viewport width for responsive placement.
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Drive navigation for the active step.
  useEffect(() => {
    if (!tourActive) return
    if (current.page !== page) setPage(current.page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourActive, step])

  const measure = useCallback(() => {
    if (!tourActive || !current.target) {
      setRect(null)
      return
    }
    const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [tourActive, current])

  // After a step (and any page change) settles, scroll the target into view and measure.
  useEffect(() => {
    if (!tourActive) return
    const samePage = current.page === page
    const delay = samePage ? 90 : 360
    const t = window.setTimeout(() => {
      if (current.target) {
        const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      window.setTimeout(measure, 260)
    }, delay)
    return () => window.clearTimeout(t)
  }, [tourActive, step, page, current, measure])

  // Keep the spotlight aligned while scrolling/resizing.
  useEffect(() => {
    if (!tourActive) return
    const onMove = () => measure()
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
  }, [tourActive, measure])

  const next = useCallback(() => {
    setStep((s) => (s >= STEPS.length - 1 ? s : s + 1))
  }, [])
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])

  // Keyboard controls.
  useEffect(() => {
    if (!tourActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endTour()
      else if (e.key === 'ArrowRight') isLast ? endTour() : next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tourActive, isLast, next, prev, endTour])

  const bubbleStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (isMobile || !rect) return undefined
    const W = 360
    const M = 16
    const GAP = 14
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    const left = Math.min(Math.max(rect.left, M), vw - W - M)
    if (rect.top + rect.height < vh * 0.55) {
      return { top: rect.top + rect.height + GAP, left, width: W }
    }
    return { bottom: vh - rect.top + GAP, left, width: W }
  }, [isMobile, rect, vw])

  if (!tourActive) return null

  const hasSpotlight = !!rect
  const PAD = 8

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Click-blocking dim. With a spotlight, the cutout div paints the dim via box-shadow. */}
      {!hasSpotlight && <div className="absolute inset-0 bg-base-950/75 backdrop-blur-[2px]" />}
      <div className="absolute inset-0" />

      {/* Spotlight cutout */}
      {hasSpotlight && rect && (
        <div
          className="pointer-events-none absolute rounded-2xl ring-2 ring-accent/70 transition-all duration-300 ease-out"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(7,11,22,0.74)',
          }}
        />
      )}

      {/* Bubble */}
      <div
        className={
          isMobile || !hasSpotlight
            ? 'absolute bottom-4 left-4 right-4 mx-auto max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2'
            : 'absolute'
        }
        style={hasSpotlight ? bubbleStyle : undefined}
      >
        <div className="animate-scale-in rounded-2xl border border-accent/30 bg-base-850 p-5 shadow-glow">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              <Compass className="h-3 w-3" />
              Guided Tour
            </span>
            <button
              onClick={endTour}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
              aria-label="End tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="font-display text-base font-bold tracking-tight text-white">
            {current.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{current.body}</p>

          {/* Progress dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-5 bg-accent' : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium tabular text-slate-500">
              Step {step + 1} of {STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
              {isLast ? (
                <button
                  onClick={endTour}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-soft px-3.5 py-1.5 text-xs font-semibold text-base-950 shadow-[0_6px_18px_-6px_rgba(56,189,248,0.8)] transition-all hover:brightness-110"
                >
                  <Check className="h-3.5 w-3.5" />
                  Finish
                </button>
              ) : (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-soft px-3.5 py-1.5 text-xs font-semibold text-base-950 shadow-[0_6px_18px_-6px_rgba(56,189,248,0.8)] transition-all hover:brightness-110"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
