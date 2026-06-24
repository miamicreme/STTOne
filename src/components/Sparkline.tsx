'use client'

import { useId } from 'react'
import { genSeries } from '../utils/anim'

interface SparklineProps {
  seed: string
  trend?: 'up' | 'down' | 'flat'
  width?: number
  height?: number
  className?: string
}

const trendColor = {
  up: '#34d399',
  down: '#fb7185',
  flat: '#2f86e0',
}

/** Lightweight hand-rolled SVG sparkline — gradient area, smooth stroke, end dot. */
export function Sparkline({
  seed,
  trend = 'flat',
  width = 104,
  height = 34,
  className = '',
}: SparklineProps) {
  const id = useId().replace(/:/g, '')
  const data = genSeries(seed, 22, trend)
  const color = trendColor[trend]

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pad = 3
  const stepX = (width - pad * 2) / (data.length - 1)

  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = pad + (height - pad * 2) * (1 - (d - min) / range)
    return [x, y] as const
  })

  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `${line} L${points[points.length - 1][0].toFixed(2)},${height} L${points[0][0].toFixed(2)},${height} Z`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} opacity="0.35">
        <animate attributeName="r" values="2.5;6;2.5" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
