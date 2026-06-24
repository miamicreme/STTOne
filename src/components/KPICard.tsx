import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPI } from '../data'
import { useApp } from '../state/AppContext'

const trendIcon = {
  up: <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />,
  down: <TrendingDown className="h-3.5 w-3.5 text-rose-400" />,
  flat: <Minus className="h-3.5 w-3.5 text-slate-400" />,
}

export function KPICard({ kpi }: { kpi: KPI }) {
  const { boardroomMode } = useApp()
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-base-850/70 p-5 transition-colors hover:border-accent/30">
      <div className="flex items-center justify-between">
        <p
          className={`font-medium uppercase tracking-wider text-slate-400 ${
            boardroomMode ? 'text-xs' : 'text-[11px]'
          }`}
        >
          {kpi.label}
        </p>
        {kpi.trend && trendIcon[kpi.trend]}
      </div>
      <p
        className={`mt-3 font-bold tabular tracking-tight text-white ${
          boardroomMode ? 'text-5xl' : 'text-4xl'
        }`}
      >
        {kpi.value}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {kpi.delta && (
          <span className="text-xs font-medium text-slate-300">{kpi.delta}</span>
        )}
        {kpi.hint && <span className="text-[11px] text-slate-500">· {kpi.hint}</span>}
      </div>
    </div>
  )
}
