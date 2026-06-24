'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, X, Compass, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { tourScenes } from '../data'

/**
 * Self-running guided tour. Built for an unattended link: it auto-starts,
 * walks the key screens, and auto-plays the New Hire pipeline (success, then
 * the failure that catches a non-compliant hire before dispatch). Any manual
 * navigation cancels it (see SET_PAGE in the reducer), so the visitor can take
 * over at any time. Skipped automatically for prefers-reduced-motion visitors.
 */
export function TourController() {
  const {
    tour,
    tourPage,
    tourGotoScene,
    tourComplete,
    tourSetPlaying,
    stopTour,
    startTour,
    nhRun,
    welcomeOpen,
  } = useApp()

  const sceneTimer = useRef<number | null>(null)
  const runTimer = useRef<number | null>(null)
  const ranForScene = useRef<number>(-1) // which sceneIndex already fired its NH run
  const autoStarted = useRef(false)
  const [showDone, setShowDone] = useState(false)

  /* Auto-start once per load, after the visitor leaves the welcome overlay —
     unless they prefer reduced motion. The welcome screen is the front door;
     if they choose "Explore on my own", the tour still auto-opens shortly after
     so an unattended link keeps walking itself. */
  useEffect(() => {
    if (autoStarted.current || welcomeOpen) return
    autoStarted.current = true
    // If the visitor launched the tour straight from the welcome CTA, it's
    // already running — don't restart it.
    if (tour.active || tour.completed) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    // Let the landing page settle and the count-ups finish before the tour opens.
    const id = window.setTimeout(() => startTour(), 2800)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcomeOpen])

  /* Reset the per-scene run guard whenever a fresh tour begins at scene 0. */
  useEffect(() => {
    if (tour.active && tour.sceneIndex === 0) ranForScene.current = -1
  }, [tour.active, tour.sceneIndex])

  /* Navigate to the scene's page and gently bring its subject into view.
     Runs whenever the scene changes — even while paused — so the Back/Next
     buttons move the screen too. */
  useEffect(() => {
    if (!tour.active) return
    const scene = tourScenes[tour.sceneIndex]
    if (!scene) {
      tourComplete()
      return
    }

    tourPage(scene.page)

    // The stage is fixed and non-scrolling — each view fits the screen — so the
    // tour no longer scrolls or centers anything (that motion read as the screen
    // "jumping" between scenes). It simply changes the page.

    if (scene.run && ranForScene.current !== tour.sceneIndex) {
      ranForScene.current = tour.sceneIndex
      runTimer.current = window.setTimeout(() => nhRun(scene.run!), 900)
    }

    return () => {
      if (runTimer.current) window.clearTimeout(runTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.sceneIndex])

  /* Auto-advance to the next scene after its dwell time — only while playing.
     Pausing freezes here, so the viewer can read as long as they like. */
  useEffect(() => {
    if (!tour.active || !tour.playing) return
    const scene = tourScenes[tour.sceneIndex]
    if (!scene) return

    sceneTimer.current = window.setTimeout(() => {
      if (tour.sceneIndex + 1 >= tourScenes.length) tourComplete()
      else tourGotoScene(tour.sceneIndex + 1)
    }, scene.ms)

    return () => {
      if (sceneTimer.current) window.clearTimeout(sceneTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.playing, tour.sceneIndex])

  const goPrev = () => tourGotoScene(Math.max(0, tour.sceneIndex - 1))
  const goNext = () => {
    if (tour.sceneIndex + 1 >= tourScenes.length) tourComplete()
    else tourGotoScene(tour.sceneIndex + 1)
  }

  /* Brief "complete" confirmation chip after the tour ends. */
  useEffect(() => {
    if (!tour.completed) return
    setShowDone(true)
    const id = window.setTimeout(() => setShowDone(false), 4500)
    return () => window.clearTimeout(id)
  }, [tour.completed])

  if (!tour.active && !showDone) return null

  /* Completion chip. */
  if (!tour.active && showDone) {
    return (
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        <div className="glass flex items-center gap-3 rounded-2xl border border-emerald-500/25 px-4 py-3 shadow-glow">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="text-sm font-medium text-slate-100">Tour complete — explore freely</span>
          <button
            onClick={startTour}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-3 w-3" /> Replay
          </button>
        </div>
      </div>
    )
  }

  const total = tourScenes.length
  const scene = tourScenes[tour.sceneIndex]

  /* Active control bar. */
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-4">
      <div className="glass w-full max-w-2xl rounded-2xl border border-accent/25 px-3 py-2.5 shadow-glow sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          {/* Live badge */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Compass className="h-3.5 w-3.5" /> Tour
            </span>
          </div>

          {/* Caption */}
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-100 sm:text-sm">
            {scene?.caption}
          </p>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={goPrev}
              disabled={tour.sceneIndex === 0}
              aria-label="Previous step"
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => tourSetPlaying(!tour.playing)}
              aria-label={tour.playing ? 'Pause tour' : 'Play tour'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/15 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/25"
            >
              {tour.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="hidden sm:inline">{tour.playing ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={goNext}
              aria-label="Next step"
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={stopTour}
              aria-label="Exit tour"
              className="ml-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress — current segment fills over its dwell time */}
        <div className="mt-2 flex items-center gap-1.5">
          {tourScenes.map((s, i) => (
            <span
              key={i}
              className={`relative h-1 flex-1 overflow-hidden rounded-full ${
                i < tour.sceneIndex ? 'bg-accent/60' : 'bg-white/10'
              }`}
            >
              {i === tour.sceneIndex && (
                <span
                  key={tour.sceneIndex}
                  className="tour-seg-fill absolute inset-0 rounded-full bg-accent"
                  style={{
                    animationDuration: `${s.ms}ms`,
                    animationPlayState: tour.playing ? 'running' : 'paused',
                  }}
                />
              )}
            </span>
          ))}
        </div>
        <div className="mt-1 text-right text-[10px] tabular text-slate-500">
          {tour.sceneIndex + 1} / {total}
        </div>
      </div>
    </div>
  )
}
