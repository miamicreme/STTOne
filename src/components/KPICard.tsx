'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPI } from '../data'
import { useApp } from '../state/AppContext'
import { AnimatedNumber } from './AnimatedNumber'
import { Sparkline } from './Sparkline'

const trendMeta = {
  up: { icon: TrendingUp, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  down: { icon: TrendingDown, cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  flat: { icon: Minus, cls: 'text-slate-400 bg-white/[0.04] border-white/10' },
}

export function KPICard({ kpi, index = 0 }: { kpi: KPI; index?: number }) {
  const { boardroomMode } = useApp()
  const trend = kpi.trend ?? 'flat'
  const meta = trendMeta[trend]
  const Icon = meta.icon

  return (
    <div
      className="edge-accent glow-ring lift group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-base-850/60 p-5 animate-rise"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Accent wash that intensifies on hover */}
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between gap-2">
        <p
          className={`font-medium uppercase tracking-[0.12em] text-slate-400 ${
            boardroomMode ? 'text-xs' : 'text-[10.5px]'
          }`}
        >
          {kpi.label}
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${meta.cls}`}
        >
          <Icon className="h-3 w-3" />
          {kpi.delta && <span className="tabular">{kpi.delta}</span>}
        </span>
      </div>

      <div className="relative mt-3 flex min-w-0 items-end justify-between gap-3">
        <AnimatedNumber
          value={kpi.value}
          className={`min-w-0 whitespace-nowrap font-display font-bold leading-none tracking-tightest text-white tabular transition-colors duration-500 group-hover:text-gradient ${
            boardroomMode
              ? 'text-[2.4rem] sm:text-[3.4rem]'
              : 'text-[1.9rem] sm:text-[2.6rem]'
          }`}
        />
        <Sparkline
          seed={kpi.label}
          trend={trend}
          className="mb-1 hidden shrink-0 opacity-80 sm:block xl:hidden"
        />
      </div>

      {kpi.hint && (
        <div className="relative mt-2.5 flex items-center gap-2">
          <span className="truncate text-[11px] text-slate-500">{kpi.hint}</span>
        </div>
      )}

      {/* Animated baseline accent — sweeps in on hover */}
      <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  )
}
