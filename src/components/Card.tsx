import type { ReactNode } from 'react'
import { Hint } from './Hint'

interface CardProps {
  children: ReactNode
  className?: string
  /** Optional padding override */
  padded?: boolean
  /** Subtle lift + glow on hover */
  hover?: boolean
  /** Anchor id for the guided tour (renders data-tour) */
  tourId?: string
}

/** Base surface — subtle border, soft navy glass fill, no heavy shadows. */
export function Card({ children, className = '', padded = true, hover = false, tourId }: CardProps) {
  return (
    <div
      data-tour={tourId}
      className={`rounded-2xl border border-white/[0.07] bg-base-850/55 shadow-inset backdrop-blur-sm ${
        hover ? 'lift' : ''
      } ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: ReactNode
  hint?: string
}

export function SectionHeader({ title, subtitle, action, icon, hint }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        {icon && (
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/25 bg-gradient-to-br from-accent/20 to-accent/[0.06] text-accent shadow-[0_0_14px_-4px_rgba(47,134,224,0.6)]">
            {icon}
          </div>
        )}
        <div>
          <h2 className="flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-tight text-slate-100">
            {title}
            {hint && <Hint text={hint} />}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  /** Colored leading icon (h-4 w-4). */
  icon?: ReactNode
  hint?: string
  /** Right-aligned content — a count, badge, or button. */
  action?: ReactNode
  /** Optional content rendered under the title row, inside the bordered block. */
  below?: ReactNode
}

/**
 * The canonical title bar for list/table cards (use with <Card padded={false}>).
 * Standardizes the border, padding, icon size, and title typography that views
 * used to hand-roll inconsistently.
 */
export function CardHeader({ title, icon, hint, action, below }: CardHeaderProps) {
  return (
    <div className="border-b border-white/[0.07] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <h2 className="truncate font-display text-[15px] font-semibold text-slate-100">{title}</h2>
          {hint && <Hint text={hint} />}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {below}
    </div>
  )
}

type CountTone = 'neutral' | 'rose' | 'amber'

const countToneStyles: Record<CountTone, string> = {
  neutral: 'bg-white/[0.05] text-slate-300',
  rose: 'bg-rose-500/15 text-rose-300',
  amber: 'bg-amber-500/15 text-amber-300',
}

/** Small pill for a header-right count. Use `tone` to flag alert counts. */
export function CountPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: CountTone
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular ${countToneStyles[tone]}`}
    >
      {children}
    </span>
  )
}

/** Small uppercase metadata chip (system names, types, cadences). */
export function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400 ${className}`}
    >
      {children}
    </span>
  )
}

/** Consistent empty / "all clear" placeholder for lists and panels. */
export function EmptyState({
  icon,
  title,
  subtitle,
  className = '',
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {icon && <div className="mb-2 text-slate-500">{icon}</div>}
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
