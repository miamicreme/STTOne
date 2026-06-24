'use client'

import { useEffect, useRef, useState } from 'react'

/** Animate a number from 0 → target with an easeOutCubic curve. */
export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + (target - from) * eased
      setValue(next)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

/** Stable FNV-1a hash → seed for deterministic per-label sparklines. */
function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic, gently trending 0..1 series — same input always renders the same. */
export function genSeries(seed: string, n = 22, trend: 'up' | 'down' | 'flat' = 'flat'): number[] {
  let h = hashSeed(seed)
  const rand = () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    return h / 4294967296
  }
  const drift = trend === 'up' ? 0.018 : trend === 'down' ? -0.018 : 0
  const out: number[] = []
  let v = trend === 'up' ? 0.32 : trend === 'down' ? 0.7 : 0.5
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * 0.26 + drift
    v = Math.max(0.08, Math.min(0.94, v))
    out.push(v)
  }
  return out
}
