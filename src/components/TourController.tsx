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
  } = useApp()

  const sceneTimer = useRef<number | null>(null)
  const runTimer = useRef<number | null>(null)
  const wordTimer = useRef<number | null>(null)
  const ranForScene = useRef<number>(-1)
  const [showDone, setShowDone] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  /* Reset per-scene run guard on fresh tour. */
  useEffect(() => {
    if (tour.active && tour.sceneIndex === 0) ranForScene.current = -1
  }, [tour.active, tour.sceneIndex])

  /* Navigate to scene page and reset word reveal on scene change. */
  useEffect(() => {
    if (!tour.active) return
    const scene = tourScenes[tour.sceneIndex]
    if (!scene) {
      tourComplete()
      return
    }

    tourPage(scene.page)
    // While paused, show the full caption immediately so manual step-through isn't blank.
    setWordCount(tour.playing ? 0 : scene.caption.split(' ').length)

    if (scene.run && ranForScene.current !== tour.sceneIndex) {
      ranForScene.current = tour.sceneIndex
      runTimer.current = window.setTimeout(() => nhRun(scene.run!), 900)
    }

    return () => {
      if (runTimer.current) window.clearTimeout(runTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.sceneIndex])

  /* Word-by-word reveal — advances only while playing. */
  useEffect(() => {
    if (!tour.active) return
    const scene = tourScenes[tour.sceneIndex]
    if (!scene) return

    const words = scene.caption.split(' ')

    if (!tour.playing) {
      if (wordTimer.current) window.clearInterval(wordTimer.current)
      setWordCount(words.length)
      return
    }

    wordTimer.current = window.setInterval(() => {
      setWordCount((n) => {
        if (n >= words.length) {
          window.clearInterval(wordTimer.current!)
          return n
        }
        return n + 1
      })
    }, 55)

    return () => {
      if (wordTimer.current) window.clearInterval(wordTimer.current)
    }
  }, [tour.active, tour.playing, tour.sceneIndex])

  /* Auto-advance after dwell time — only while playing. */
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

  const goPrev = () => {
    setWordCount(0)
    tourGotoScene(Math.max(0, tour.sceneIndex - 1))
  }
  const goNext = () => {
    setWordCount(0)
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
  const words = scene?.caption.split(' ') ?? []
  const visibleCaption = words.slice(0, wordCount).join(' ')
  const isTyping = wordCount < words.length

  /* Active narrator bar. */
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-4">
      <div className="glass relative w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/30 shadow-[0_14px_44px_-12px_rgba(47,134,224,0.45)] ring-1 ring-accent/15">
        {/* CC caption block */}
        <div className="bg-black/55 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-brand-red-soft">
              <Compass className="h-3 w-3" /> Narrator
            </span>
          </div>
          <p className="min-h-[1.6rem] text-base font-semibold leading-snug tracking-wide text-white sm:text-lg">
            {visibleCaption}
            {isTyping && (
              <span className="ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-accent align-middle opacity-80" />
            )}
          </p>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 border-t border-white/[0.06] bg-base-900/60 px-3 py-2 sm:px-4">
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={goPrev}
              disabled={tour.sceneIndex === 0}
              aria-label="Previous step"
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => tourSetPlaying(!tour.playing)}
              aria-label={tour.playing ? 'Pause tour' : 'Play tour'}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-accent to-accent-soft px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(47,134,224,0.85)] transition-all hover:brightness-110 active:scale-[0.97]"
            >
              {tour.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{tour.playing ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={goNext}
              aria-label="Next step"
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Progress segments */}
          <div className="flex flex-1 items-center gap-1">
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

          <span className="shrink-0 text-[10px] tabular text-slate-500">
            {tour.sceneIndex + 1} / {total}
          </span>

          <button
            onClick={stopTour}
            aria-label="Exit tour"
            className="ml-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
