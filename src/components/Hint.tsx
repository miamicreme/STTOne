'use client'
import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface HintProps {
  text: string
  className?: string
  side?: 'top' | 'right'
  width?: string
}

export function Hint({ text, className = '', side = 'top', width = 'w-60' }: HintProps) {
  const [open, setOpen] = useState(false)

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="flex h-4 w-4 items-center justify-center rounded-full text-slate-600 transition-colors hover:text-slate-400 focus:outline-none"
        aria-label="More information"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute z-[60] ${width} rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-xs leading-relaxed text-slate-300 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.9)] ${
            side === 'right'
              ? 'left-full top-1/2 ml-2.5 -translate-y-1/2'
              : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
          }`}
        >
          {text}
          {side === 'top' && (
            <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#080f1d]" />
          )}
          {side === 'right' && (
            <span className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-white/10 bg-[#080f1d]" />
          )}
        </span>
      )}
    </span>
  )
}
