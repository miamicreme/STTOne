interface ProgressBarProps {
  value: number // 0–100
  label?: string
  caption?: string
  tone?: 'accent' | 'emerald' | 'amber' | 'rose'
  size?: 'sm' | 'md'
}

const toneFill: Record<string, string> = {
  accent: 'bg-accent',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
}

function pickTone(value: number): keyof typeof toneFill {
  if (value >= 75) return 'emerald'
  if (value >= 50) return 'accent'
  if (value >= 30) return 'amber'
  return 'rose'
}

export function ProgressBar({ value, label, caption, tone, size = 'md' }: ProgressBarProps) {
  const fill = toneFill[tone ?? pickTone(value)]
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div>
      {(label || caption) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-200">{label}</span>}
          {caption && <span className="tabular text-slate-400">{caption}</span>}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        }`}
      >
        <div
          className={`h-full rounded-full ${fill} transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
