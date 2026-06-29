'use client'

import { Linkedin } from 'lucide-react'

/**
 * Custom, on-brand profile chip for the sidebar footer. Matches the dark
 * command-center theme and collapses to just the avatar on the icon rail.
 */
export function ProfileChip({ collapsed = false }: { collapsed?: boolean }) {
  const hideWhenCollapsed = collapsed ? 'md:hidden' : ''
  return (
    <a
      href="https://www.linkedin.com/in/kohronburton?trk=profile-badge"
      target="_blank"
      rel="noopener noreferrer"
      title="Kohron Burton — LinkedIn"
      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 transition-colors hover:border-accent/30 hover:bg-white/[0.05]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-deep text-[11px] font-bold text-white shadow-[0_0_14px_-4px_rgba(47,134,224,0.6)]">
        KB
      </span>
      <span className={`min-w-0 flex-1 leading-tight ${hideWhenCollapsed}`}>
        <span className="block truncate text-[13px] font-semibold text-slate-200 transition-colors group-hover:text-white">
          Kohron Burton
        </span>
        <span className="block truncate text-[10px] uppercase tracking-wide text-slate-500">
          Lead Systems Architect
        </span>
      </span>
      <Linkedin className={`h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-accent ${hideWhenCollapsed}`} />
    </a>
  )
}
