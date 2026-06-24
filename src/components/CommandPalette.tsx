'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Landmark,
  Network,
  UserPlus,
  HardDrive,
  Activity,
  Truck,
  FolderKanban,
  IdCard,
  Compass,
  Presentation,
  Search,
  CornerDownLeft,
  type LucideIcon,
} from 'lucide-react'
import type { PageKey } from '../data'
import { useApp } from '../state/AppContext'

interface Command {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  keywords?: string
  run: (ctx: ReturnType<typeof useApp>) => void
}

const goto = (page: PageKey, label: string, hint: string, icon: LucideIcon): Command => ({
  id: `go-${page}`,
  label,
  hint,
  icon,
  keywords: 'go to navigate open page',
  run: (ctx) => ctx.setPage(page),
})

const COMMANDS: Command[] = [
  goto('home', 'Executive Home', 'Go to page', LayoutDashboard),
  goto('board', 'CEO / Board View', 'Go to page', Landmark),
  goto('architecture', 'Integration Architecture', 'Go to page', Network),
  goto('newhire', 'New Hire Automation', 'Go to page', UserPlus),
  goto('drive', 'Drive Cleanup Center', 'Go to page', HardDrive),
  goto('integration', 'Integration Health', 'Go to page', Activity),
  goto('fleet', 'Field Ops / Fleet', 'Go to page', Truck),
  goto('projects', 'Project Portfolio', 'Go to page', FolderKanban),
  goto('portal', 'Employee Portal', 'Go to page', IdCard),
  {
    id: 'tour',
    label: 'Start guided tour',
    hint: 'Action',
    icon: Compass,
    keywords: 'play walkthrough demo replay',
    run: (ctx) => ctx.startTour(),
  },
  {
    id: 'boardroom',
    label: 'Toggle Boardroom Mode',
    hint: 'Action',
    icon: Presentation,
    keywords: 'present projector screen share fullscreen',
    run: (ctx) => ctx.toggleBoardroom(),
  },
]

/**
 * ⌘K / Ctrl-K command palette — keyboard-driven navigation and actions.
 * Filter by typing, move with ↑/↓, run with Enter, dismiss with Esc.
 */
export function CommandPalette() {
  const ctx = useApp()
  const { commandOpen, openCommand, closeCommand, toggleCommand } = ctx
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Global shortcut: ⌘K / Ctrl-K toggles; "/" opens when not already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault()
        toggleCommand()
        return
      }
      const typingTarget =
        e.target instanceof HTMLElement &&
        ['input', 'textarea'].includes(e.target.tagName.toLowerCase())
      if (k === '/' && !typingTarget && !commandOpen) {
        e.preventDefault()
        openCommand()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, openCommand, toggleCommand])

  // Reset + focus whenever it opens.
  useEffect(() => {
    if (commandOpen) {
      setQuery('')
      setActive(0)
      // Focus after paint.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [commandOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    return COMMANDS.filter((c) =>
      `${c.label} ${c.hint} ${c.keywords ?? ''}`.toLowerCase().includes(q),
    )
  }, [query])

  // Keep the active row in range and scrolled into view.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)))
  }, [results.length])

  if (!commandOpen) return null

  const run = (cmd?: Command) => {
    if (!cmd) return
    closeCommand()
    cmd.run(ctx)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeCommand()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-base-950/70 backdrop-blur-sm animate-fade-in"
        onClick={closeCommand}
      />

      {/* Panel */}
      <div className="glass animate-scale-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-accent/25 shadow-glow">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages and actions…"
            className="h-12 w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            aria-label="Search commands"
          />
          <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500 sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-500">No matches.</p>
          ) : (
            results.map((cmd, i) => {
              const Icon = cmd.icon
              const isActive = i === active
              return (
                <button
                  key={cmd.id}
                  onClick={() => run(cmd)}
                  onMouseMove={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-accent/[0.14] text-white' : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      isActive
                        ? 'border-accent/30 bg-accent/15 text-accent'
                        : 'border-white/10 bg-white/[0.03] text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{cmd.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-500">
                    {cmd.hint}
                  </span>
                  {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </button>
              )
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5">↑</kbd>
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5">↵</kbd>
            to run
          </span>
        </div>
      </div>
    </div>
  )
}
