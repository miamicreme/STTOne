import { Presentation, Search, Bell } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { PageKey } from '../data'

const pageTitles: Record<PageKey, string> = {
  home: 'Executive Home',
  newhire: 'New Hire Automation',
  drive: 'Google Drive Cleanup Center',
  integration: 'Integration Health',
  fleet: 'Field Ops / Fleet',
  projects: 'Project Portfolio',
}

export function TopBar() {
  const { page, boardroomMode, toggleBoardroom, exceptions } = useApp()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/[0.07] bg-base-900/80 px-6 backdrop-blur-md">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
          <span>Southern Tier Telecommunications</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400">Fort Myers HQ</span>
        </div>
        <h1 className="truncate text-lg font-bold tracking-tight text-white">{pageTitles[page]}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Operational Pulse chip */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-300">Operational Pulse · Nominal</span>
        </div>

        {/* Fake search */}
        <button className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300 lg:flex">
          <Search className="h-3.5 w-3.5" />
          <span>Search operations…</span>
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg border border-white/[0.07] bg-white/[0.02] p-2 text-slate-400 transition-colors hover:text-slate-200">
          <Bell className="h-4 w-4" />
          {exceptions.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {exceptions.length}
            </span>
          )}
        </button>

        {/* Boardroom Mode toggle */}
        <button
          onClick={toggleBoardroom}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
            boardroomMode
              ? 'border-accent/40 bg-accent/15 text-accent'
              : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Presentation className="h-4 w-4" />
          <span className="hidden sm:inline">Boardroom Mode</span>
        </button>
      </div>
    </header>
  )
}
