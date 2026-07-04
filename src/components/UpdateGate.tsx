'use client'

import { useEffect, useState } from 'react'

const FOUR_HOURS = 14400000

function fmt(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0'))
}

export function UpdateGate({ children }: { children: React.ReactNode }) {
  const [endAt] = useState(() => Date.now() + FOUR_HOURS)
  const [left, setLeft] = useState(FOUR_HOURS)

  useEffect(() => {
    const id = window.setInterval(() => setLeft(endAt - Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [endAt])

  if (left <= 0) return <>{children}</>

  const [hours, minutes, seconds] = fmt(left)

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-950 px-6 text-center text-white">
      <section className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-base-900 p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Under modification</p>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">
          Construction page
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
          Systems will be back up shortly.
        </p>
        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
          {[
            ['Hours', hours],
            ['Minutes', minutes],
            ['Seconds', seconds],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-display text-4xl font-black tabular-nums">{value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
