import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  /** Optional padding override */
  padded?: boolean
}

/** Base surface — subtle border, soft navy fill, no heavy shadows. */
export function Card({ children, className = '', padded = true }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-white/[0.07] bg-base-850/70 backdrop-blur-sm ${
        padded ? 'p-5' : ''
      } ${className}`}
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
}

export function SectionHeader({ title, subtitle, action, icon }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        {icon && <div className="mt-0.5 text-accent">{icon}</div>}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
