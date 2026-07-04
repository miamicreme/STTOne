'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock3, Construction, ShieldCheck } from 'lucide-react'
import type { ExceptionItem } from '../data'

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000
const STORAGE_KEY = 'stt-system-hold-deadline'

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0'))
}

export function SystemHoldPage({ blockers }: { blockers: ExceptionItem[] }) {
  const hasBlockers = blockers.length > 0
  const [deadline, setDeadline] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!hasBlockers) {
      localStorage.removeItem(STORAGE_KEY)
      setDeadline(0)
      return
    }

    const saved = Number(localStorage.getItem(STORAGE_KEY))
    const validSaved = Number.isFinite(saved) && saved > Date.now()
    const nextDeadline = validSaved ? saved : Date.now() + FOUR_HOURS_MS
    localStorage.setItem(STORAGE_KEY, String(nextDeadline))
    setDeadline(nextDeadline)
  }, [hasBlockers])

  useEffect(() => {
    if (!deadline) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [deadline])

  const remainingMs = Math.max(0, deadline - now)
  const expired = deadline > 0 && remainingMs <= 0
  const [hours, minutes, seconds] = useMemo(() => formatTime(remainingMs), [remainingMs])

  useEffect(() => {
    if (expired) localStorage.removeItem(STORAGE_KEY)
  }, [expired])

  if (!hasBlockers || !deadline || expired) return null

  return (
    <div className="relative z-50 flex min-h-screen items-center justify-center overflow-hidden bg-base-950 px-4 py-8 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,134,224,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.16),transparent_34%)]" />
      <div className="relative w-full max-w-5xl rounded-[2rem] border border-white/[0.08] bg-base-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
          <Construction className="h-4 w-4" />
          Under Modification
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              Systems will be back up shortly.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Active blockers were detected, so this page is temporarily showing while the system stabilizes. It clears when blockers are gone or when the timer reaches zero.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Hours', hours],
                ['Minutes', minutes],
                ['Seconds', seconds],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-center">
                  <p className="font-display text-4xl font-bold tabular-nums text-white md:text-5xl">{value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5">
              <p className="text-sm font-bold text-amber-100">{blockers.length} active blocker{blockers.length === 1 ? '' : 's'}</p>
              <p className="mt-1 text-sm leading-6 text-amber-100/70">{blockers[0]?.title ?? 'System blocker detected'}</p>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-white"><Clock3 className="h-4 w-4 text-accent" /> Real four-hour countdown</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Refreshes do not restart the timer.</p>
            </div>
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-100"><ShieldCheck className="h-4 w-4" /> Conditional only</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">If there are no blockers, users go straight to the app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
