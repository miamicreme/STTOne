'use client'

import { Presentation, Search, Bell, Menu, Compass } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { PageKey } from '../data'

const pageTitles: Record<PageKey, string> = {
  home: 'Executive Home',
  board: 'CEO / Board View',
  architecture: 'Integration Architecture',
  newhire: 'New Hire Automation',
  drive: 'Google Drive Cleanup Center',
  integration: 'Integration Health',
  fleet: 'Field Ops / Fleet',
  projects: 'Project Portfolio',
  portal: 'Employee Portal',
  'project-status': 'Project Status',
}

export function TopBar() {
  const { page, boardroomMode, toggleBoardroom, toggleMobileNav, startTour, openCommand, exceptions } =
    useApp()

  return (
    <header className="glass sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-white/[0.07] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3" data-tour="topbar">
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
        <h1 className="truncate font-display text-base font-bold tracking-tight text-white sm:text-[18px]">
          {pageTitles[page]}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command palette trigger (⌘K) */}
        <button
          onClick={openCommand}
          className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-slate-500 transition-colors hover:border-accent/30 hover:text-slate-300 lg:flex"
          aria-label="Open command palette"
        >
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

        {/* Guided Tour trigger */}
        <button
          onClick={startTour}
          title="Guided Tour"
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2 text-slate-400 transition-all duration-300 hover:border-accent/30 hover:text-accent"
          aria-label="Start guided tour"
        >
          <Compass className="h-4 w-4" />
        </button>

        {/* Boardroom Mode toggle — compact icon */}
        <button
          onClick={toggleBoardroom}
          data-tour="boardroom"
          title="Boardroom Mode"
          aria-label="Toggle boardroom mode"
          aria-pressed={boardroomMode}
          className={`rounded-xl border p-2 transition-all duration-300 ${
            boardroomMode
              ? 'border-accent/40 bg-accent/15 text-accent shadow-[0_0_18px_-4px_rgba(47,134,224,0.6)]'
              : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.14] hover:text-slate-200'
          }`}
        >
          <Presentation className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
