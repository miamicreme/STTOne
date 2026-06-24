'use client'

import { useCountUp } from '../utils/anim'

/**
 * Renders a KPI value string with its leading numeric portion counting up,
 * preserving any prefix/suffix and the original formatting (commas, decimals).
 * e.g. "58,412", "97.9%", "2.4 days", "81% utilized".
 */
export function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  const match = value.match(/-?[\d,]+(?:\.\d+)?/)
  const raw = match?.[0] ?? ''
  const numeric = raw ? parseFloat(raw.replace(/,/g, '')) : 0
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const grouped = raw.includes(',') || numeric >= 1000

  // Hook is always called (Rules of Hooks); result is ignored when no number present.
  const animated = useCountUp(numeric, 1300)

  if (!match) {
    return <span className={className}>{value}</span>
  }

  const formatted = animated.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  })

  const before = value.slice(0, match.index)
  const after = value.slice((match.index ?? 0) + raw.length)

  return (
    <span className={className}>
      {before}
      {formatted}
      {after}
    </span>
  )
}
