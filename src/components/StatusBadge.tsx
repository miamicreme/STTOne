import type { ExceptionSeverity, ProjectStatus, SystemStatus } from '../data'

type Tone = SystemStatus | ExceptionSeverity | ProjectStatus | 'neutral'

const toneStyles: Record<string, string> = {
  // System
  healthy: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25',
  warning: 'bg-amber-500/12 text-amber-300 border-amber-500/25',
  active: 'bg-sky-500/12 text-sky-300 border-sky-500/25',
  critical: 'bg-rose-500/12 text-rose-300 border-rose-500/25',
  // Severity
  high: 'bg-rose-500/12 text-rose-300 border-rose-500/25',
  medium: 'bg-amber-500/12 text-amber-300 border-amber-500/25',
  low: 'bg-slate-500/12 text-slate-300 border-slate-500/25',
  // Project status
  'on-track': 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25',
  'at-risk': 'bg-amber-500/12 text-amber-300 border-amber-500/25',
  blocked: 'bg-rose-500/12 text-rose-300 border-rose-500/25',
  neutral: 'bg-slate-500/12 text-slate-300 border-slate-500/25',
}

const dotStyles: Record<string, string> = {
  healthy: 'bg-emerald-400',
  warning: 'bg-amber-400',
  active: 'bg-sky-400',
  critical: 'bg-rose-400',
  high: 'bg-rose-400',
  medium: 'bg-amber-400',
  low: 'bg-slate-400',
  'on-track': 'bg-emerald-400',
  'at-risk': 'bg-amber-400',
  blocked: 'bg-rose-400',
  neutral: 'bg-slate-400',
}

interface StatusBadgeProps {
  tone: Tone
  label: string
  dot?: boolean
  pulse?: boolean
}

export function StatusBadge({ tone, label, dot = true, pulse = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
        toneStyles[tone] ?? toneStyles.neutral
      }`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotStyles[tone] ?? dotStyles.neutral} ${
            pulse ? 'animate-pulse-ring' : ''
          }`}
        />
      )}
      {label}
    </span>
  )
}
