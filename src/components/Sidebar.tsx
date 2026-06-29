'use client'

import {
  LayoutDashboard,
  Landmark,
  UserPlus,
  HardDrive,
  Activity,
  Network,
  Truck,
  FolderKanban,
  IdCard,
  ClipboardList,
  ChevronLeft,
  X,
} from 'lucide-react'
import type { PageKey } from '../data'
import { useApp } from '../state/AppContext'
import { BrandMark } from './Logo'
import { ProfileChip } from './ProfileChip'

interface NavItem {
  key: PageKey
  label: string
  icon: typeof LayoutDashboard
  badge?: number
}

export function Sidebar() {
  const {
    page,
    setPage,
    sidebarCollapsed,
    toggleSidebar,
    exceptions,
    mobileNavOpen,
    closeMobileNav,
  } = useApp()

  const nav: NavItem[] = [
    { key: 'home', label: 'Executive Home', icon: LayoutDashboard },
    { key: 'board', label: 'CEO / Board View', icon: Landmark },
    { key: 'newhire', label: 'New Hire Automation', icon: UserPlus },
    { key: 'drive', label: 'Drive Cleanup Center', icon: HardDrive },
    { key: 'integration', label: 'Integration Health', icon: Activity, badge: exceptions.length },
    { key: 'architecture', label: 'Integration Architecture', icon: Network },
    { key: 'fleet', label: 'Field Ops / Fleet', icon: Truck },
    { key: 'projects', label: 'Project Portfolio', icon: FolderKanban },
    { key: 'portal', label: 'Employee Portal', icon: IdCard },
    { key: 'project-status', label: 'Project Status', icon: ClipboardList },
  ]

  // On desktop, `sidebarCollapsed` shrinks to an icon rail (md+ only). On mobile
  // the sidebar is always full-width and shown/hidden as an off-canvas drawer.
  const collapsedMd = sidebarCollapsed ? 'md:hidden' : ''

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={closeMobileNav}
        className={`fixed inset-0 z-30 bg-base-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`glass fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-white/[0.07] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:static md:z-10 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'md:w-[72px]' : 'md:w-64'}`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-4">
          <div className="glow-ring relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/30">
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-accent/15 opacity-60 blur-md" />
            <BrandMark className="relative h-6 w-6" />
          </div>
          <div className={`min-w-0 leading-tight ${collapsedMd}`}>
            <p className="truncate font-display text-[15px] font-bold tracking-tight">
              <span className="text-white">Southern</span>
              <span className="text-accent">Tier</span>
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Telecommunications
            </p>
          </div>
          {/* Mobile close */}
          <button
            onClick={closeMobileNav}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-100 md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = page === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-accent/[0.18] via-accent/[0.10] to-transparent font-semibold text-accent shadow-[inset_0_0_0_1px_rgba(47,134,224,0.22)]'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                }`}
              >
                {active && (
                  <>
                    <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gradient-to-b from-brand-red via-accent to-accent-glow shadow-[0_0_12px_rgba(47,134,224,0.8)]" />
                    <span className="pointer-events-none absolute -left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-accent/20 blur-xl" />
                  </>
                )}
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${
                    active ? '' : 'group-hover:scale-110'
                  }`}
                />
                <span className={`flex-1 truncate ${collapsedMd}`}>{item.label}</span>
                {item.badge ? (
                  <>
                    <span
                      className={`rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold tabular text-rose-300 ring-1 ring-inset ring-rose-500/20 ${collapsedMd}`}
                    >
                      {item.badge}
                    </span>
                    {sidebarCollapsed && (
                      <span className="absolute right-2 top-2 hidden h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)] md:block" />
                    )}
                  </>
                ) : null}
              </button>
            )
          })}
        </nav>

        {/* Footer / collapse */}
        <div className="border-t border-white/[0.07] p-3">
          {/* Architect credit — links to LinkedIn, collapses to the avatar */}
          <div className="mb-3">
            <ProfileChip collapsed={sidebarCollapsed} />
          </div>
          {/* Collapse is a desktop affordance only */}
          <button
            onClick={toggleSidebar}
            className="hidden w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] py-2 text-xs text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-200 md:flex"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`}
            />
            <span className={collapsedMd}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  )
}
