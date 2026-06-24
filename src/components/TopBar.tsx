'use client'

import { Presentation, Search, Bell, ChevronRight, Menu } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { PageKey } from '../data'

const pageTitles: Record<PageKey, string> = {
  home: 'Executive Home',
  board: 'CEO / Board View',
  newhire: 'New Hire Automation',
  drive: 'Google Drive Cleanup Center',
  integration: 'Integration Health',
  fleet: 'Field Ops / Fleet',
  projects: 'Project Portfolio',
  portal: 'Employee Portal',
}

export function TopBar() {
  const { page, boardroomMode, toggleBoardroom, toggleMobileNav, exceptions } = useApp()

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/[0.07] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile hamburger */}
        {!boardroomMode && (
          <button
            onClick={toggleMobileNav}
            className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="hidden items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:flex">
            <span>Southern Tier Telecommunications</span>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-slate-400">Fort Myers HQ</span>
          </div>
          <h1 className="truncate font-display text-base font-bold tracking-tight text-white sm:text-[19px]">
            {pageTitles[page]}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Operational Pulse chip */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-1.5 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold text-emerald-300">Operational Pulse · Nominal</span>
        </div>

        {/* Fake search */}
        <button className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-slate-500 transition-colors hover:border-white/[0.14] hover:text-slate-300 lg:flex">
          <Search className="h-3.5 w-3.5" />
          <span>Search operations…</span>
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-2 text-slate-400 transition-colors hover:border-white/[0.14] hover:text-slate-200">
          <Bell className="h-4 w-4" />
          {exceptions.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-base-900">
              {exceptions.length}
            </span>
          )}
        </button>

        {/* Boardroom Mode toggle */}
        <button
          onClick={toggleBoardroom}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
            boardroomMode
              ? 'border-accent/40 bg-accent/15 text-accent shadow-[0_0_18px_-4px_rgba(56,189,248,0.6)]'
              : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.14] hover:text-slate-200'
          }`}
        >
          <Presentation className="h-4 w-4" />
          <span className="hidden sm:inline">Boardroom Mode</span>
        </button>
      </div>
    </header>
  )
}
