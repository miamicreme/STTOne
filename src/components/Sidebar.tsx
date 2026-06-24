import {
  LayoutDashboard,
  UserPlus,
  HardDrive,
  Activity,
  Truck,
  FolderKanban,
  ChevronLeft,
  Signal,
} from 'lucide-react'
import type { PageKey } from '../data'
import { useApp } from '../state/AppContext'

interface NavItem {
  key: PageKey
  label: string
  icon: typeof LayoutDashboard
  badge?: number
}

export function Sidebar() {
  const { page, setPage, sidebarCollapsed, toggleSidebar, exceptions } = useApp()

  const nav: NavItem[] = [
    { key: 'home', label: 'Executive Home', icon: LayoutDashboard },
    { key: 'newhire', label: 'New Hire Automation', icon: UserPlus },
    { key: 'drive', label: 'Drive Cleanup Center', icon: HardDrive },
    { key: 'integration', label: 'Integration Health', icon: Activity, badge: exceptions.length },
    { key: 'fleet', label: 'Field Ops / Fleet', icon: Truck },
    { key: 'projects', label: 'Project Portfolio', icon: FolderKanban },
  ]

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-white/[0.07] bg-base-900/80 transition-all duration-300 ${
        sidebarCollapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-deep shadow-lg shadow-accent/20">
          <Signal className="h-5 w-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight text-white">Southern Tier</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-slate-500">
              Command Center
            </p>
          </div>
        )}
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
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? 'bg-accent/12 font-semibold text-accent'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              {active && (
                <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!sidebarCollapsed && item.badge ? (
                <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold tabular text-rose-300">
                  {item.badge}
                </span>
              ) : null}
              {sidebarCollapsed && item.badge ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Footer / collapse */}
      <div className="border-t border-white/[0.07] p-3">
        {!sidebarCollapsed && (
          <p className="mb-2 px-2 text-[10px] leading-relaxed text-slate-600">
            Built on Execution.
            <br />
            Elevated by Excellence.
          </p>
        )}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] py-2 text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
          {!sidebarCollapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  )
}
