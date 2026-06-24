import type { ReactNode } from 'react'

export interface TimelineRow {
  id: string
  title: string
  meta?: string
  time: string
  tone: 'success' | 'info' | 'warning' | 'error'
  icon?: ReactNode
}

const dotTone: Record<TimelineRow['tone'], string> = {
  success: 'bg-emerald-400 ring-emerald-400/20',
  info: 'bg-sky-400 ring-sky-400/20',
  warning: 'bg-amber-400 ring-amber-400/20',
  error: 'bg-rose-400 ring-rose-400/20',
}

export function Timeline({ rows }: { rows: TimelineRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
        No events yet.
      </div>
    )
  }
  return (
    <div className="relative pl-1">
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/[0.08]" />
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="relative flex gap-3 pl-5 animate-fade-in">
            <span
              className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ${dotTone[row.tone]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-100">
                  {row.icon}
                  {row.title}
                </p>
                <span className="shrink-0 text-[11px] tabular text-slate-500">{row.time}</span>
              </div>
              {row.meta && <p className="mt-0.5 text-xs text-slate-400">{row.meta}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
