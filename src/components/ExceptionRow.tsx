import { RotateCw, ChevronRight } from 'lucide-react'
import type { ExceptionItem } from '../data'
import { StatusBadge } from './StatusBadge'

interface ExceptionRowProps {
  exception: ExceptionItem
  onRetry?: (id: string) => void
  compact?: boolean
}

export function ExceptionRow({ exception, onRetry, compact = false }: ExceptionRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-base-800/50 p-3 transition-colors hover:border-white/[0.12]">
      <span
        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
          exception.severity === 'high'
            ? 'bg-rose-400'
            : exception.severity === 'medium'
              ? 'bg-amber-400'
              : 'bg-slate-400'
        }`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-100">{exception.title}</p>
          <span className="shrink-0 text-[11px] tabular text-slate-500">{exception.createdAt}</span>
        </div>
        {!compact && <p className="mt-0.5 text-xs text-slate-400">{exception.detail}</p>}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {exception.source}
          </span>
          <StatusBadge tone={exception.severity} label={exception.severity} dot={false} />
          {exception.retryable && onRetry ? (
            <button
              onClick={() => onRetry(exception.id)}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[11px] font-medium text-accent transition-colors hover:bg-accent/20"
            >
              <RotateCw className="h-3 w-3" />
              Retry
            </button>
          ) : (
            <ChevronRight className="ml-auto h-4 w-4 text-slate-600" />
          )}
        </div>
      </div>
    </div>
  )
}
