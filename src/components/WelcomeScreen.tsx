'use client'

import { useEffect } from 'react'
import { Play, ArrowRight, Workflow, ShieldCheck, Database, Sparkles } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { BrandMark } from './Logo'
import { leakageTotal } from '../data'

/**
 * First-load welcome overlay — the front door of the prototype. It says, in
 * one screen, what Southern Tier is looking at and why, then hands the visitor
 * two clear doors: watch the guided tour, or explore freely. Dismissing it (or
 * starting the tour) sets welcomeOpen=false in the pure reducer.
 */

const highlights = [
  {
    icon: Database,
    title: 'One governed layer',
    body: 'Paychex, PenguinData & QuickBooks kept as systems of record — connected, not replaced.',
  },
  {
    icon: Workflow,
    title: 'Automated onboarding',
    body: 'A new hire provisions accounts, fleet & profile automatically — live in the demo.',
  },
  {
    icon: ShieldCheck,
    title: 'Nothing fails silently',
    body: 'Exceptions route to a person — watch a non-compliant hire get stopped before dispatch.',
  },
]

export function WelcomeScreen() {
  const { welcomeOpen, dismissWelcome, startTour } = useApp()

  /* Esc dismisses; lock background scroll while the overlay is up. */
  useEffect(() => {
    if (!welcomeOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissWelcome()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [welcomeOpen, dismissWelcome])

  if (!welcomeOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* Backdrop */}
      <div
        onClick={dismissWelcome}
        className="absolute inset-0 bg-base-950/80 backdrop-blur-md animate-fade-in"
        aria-hidden="true"
      />

      {/* Card */}
      <div className="edge-accent glass animate-scale-in relative w-full max-w-2xl overflow-hidden rounded-3xl border border-accent/25 shadow-glow">
        {/* Ambient orbs */}
        <span className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-28 -left-16 h-60 w-60 rounded-full bg-brand-red/[0.07] blur-3xl" />

        <div className="relative p-6 sm:p-8">
          {/* Brand row */}
          <div className="flex items-center gap-3">
            <div className="glow-ring relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/30">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-accent/15 opacity-60 blur-md" />
              <BrandMark className="relative h-7 w-7" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[15px] font-bold tracking-tight">
                <span className="text-white">Southern</span>
                <span className="text-accent">Tier</span>
                <span className="text-slate-500"> Telecommunications</span>
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Operations Command Center
              </p>
            </div>
            <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent sm:flex">
              <Sparkles className="h-3 w-3" /> Working prototype
            </span>
          </div>

          {/* Headline */}
          <h1
            id="welcome-title"
            className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-[28px]"
          >
            A working prototype for{' '}
            <span className="text-gradient">professionalizing the back office.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
            Today Paychex, PenguinData &amp; QuickBooks run in silos, with a decade of files loose in
            Google Drive — an estimated{' '}
            <span className="font-semibold text-white">
              ${leakageTotal.toLocaleString('en-US')}/yr
            </span>{' '}
            in preventable leakage. This demo shows the operating model that closes the gap, end to
            end.
          </p>

          {/* Highlights */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = h.icon
              return (
                <div
                  key={h.title}
                  className="rounded-xl border border-white/[0.07] bg-base-900/40 p-3.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/25 bg-gradient-to-br from-accent/20 to-accent/[0.06] text-accent shadow-[0_0_14px_-4px_rgba(47,134,224,0.6)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-2.5 text-[13px] font-semibold text-slate-100">{h.title}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{h.body}</p>
                </div>
              )
            })}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={startTour}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Watch the 90-second tour
            </button>
            <button
              onClick={dismissWelcome}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.07]"
            >
              Explore on my own
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Footnote */}
          <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
            Demo data — interview prototype only. Figures are modeled estimates anchored to Southern
            Tier&apos;s public scale, to be validated in week one.
          </p>
        </div>
      </div>
    </div>
  )
}
