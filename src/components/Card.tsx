import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  /** Optional padding override */
  padded?: boolean
  /** Subtle lift + glow on hover */
  hover?: boolean
}

/** Base surface — subtle border, soft navy glass fill, no heavy shadows. */
export function Card({ children, className = '', padded = true, hover = false }: CardProps) {
  return (
    <div
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
}

export function SectionHeader({ title, subtitle, action, icon }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        {icon && (
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
            {icon}
          </div>
        )}
        <div>
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-slate-100">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
