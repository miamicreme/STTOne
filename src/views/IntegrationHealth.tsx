import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Info,
  RadioTower,
  XCircle,
  CheckCircle,
  ClipboardList,
  Activity,
} from 'lucide-react'
import { Card, SectionHeader, CardHeader, EmptyState } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { ExceptionRow } from '../components/ExceptionRow'
import { Timeline, type TimelineRow } from '../components/Timeline'
import { systemCards } from '../data'
import { useApp } from '../state/AppContext'

const levelIcon = {
  success: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />,
  info: <Info className="h-3.5 w-3.5 text-sky-400" />,
  warning: <CircleAlert className="h-3.5 w-3.5 text-amber-400" />,
  error: <XCircle className="h-3.5 w-3.5 text-rose-400" />,
}

const categoryLabel: Record<string, string> = {
  'missing-field': 'Missing field',
  'id-mismatch': 'ID mismatch',
  duplicate: 'Duplicate',
  'accounting-map': 'Accounting map',
  credential: 'Credential',
}

export function IntegrationHealth() {
  const { exceptions, events, resolveException, runCount } = useApp()

  const retryable = exceptions.filter((e) => e.retryable)
  const blocked = exceptions.filter((e) => !e.retryable)
  const highPriority = exceptions.find((e) => e.severity === 'high') ?? exceptions[0]

  const timelineRows: TimelineRow[] = events.slice(0, 4).map((ev) => ({
    id: ev.id,
    title: `${ev.system} · ${ev.message}`,
    time: ev.time,
    tone: ev.level,
    icon: levelIcon[ev.level],
  }))

  const systemsHealthy = systemCards.filter((sys) => sys.status === 'healthy').length

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.14] via-base-850/65 to-base-900/75 p-5 shadow-glow md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">Exception command center</p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
              Make bad data visible before it becomes payroll, billing, or operational risk.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              This page is the control room: systems stay connected, exceptions get owners, and nothing breaks silently.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-white/[0.08] bg-base-950/35 p-3 sm:w-auto sm:min-w-[360px]">
            <CommandStat label="Open" value={exceptions.length} tone="rose" />
            <CommandStat label="Retryable" value={retryable.length} tone="amber" />
            <CommandStat label="Blocked" value={blocked.length} tone="rose" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <Card padded={false} tourId="intq">
          <CardHeader
            title="Priority exception queue"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            action={<span className="text-[11px] text-slate-500">{retryable.length} retryable · {blocked.length} blocked</span>}
          />
          <div className="space-y-3 p-4">
            {highPriority ? (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-500/[0.07] p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-300">Highest priority</p>
                  <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-200">
                    {categoryLabel[highPriority.category] ?? highPriority.category}
                  </span>
                </div>
                <ExceptionRow exception={highPriority} onRetry={resolveException} />
              </div>
            ) : (
              <EmptyState title="Queue is clear" subtitle="All systems reconciled." className="py-10" />
            )}

            {exceptions.length > 1 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Next items</p>
                {exceptions.slice(1, 4).map((exc) => (
                  <ExceptionRow key={exc.id} exception={exc} compact onRetry={resolveException} />
                ))}
                {exceptions.length > 4 && (
                  <p className="rounded-xl border border-white/[0.06] bg-base-950/35 px-3 py-2 text-xs text-slate-400">
                    +{exceptions.length - 4} lower-priority items held behind the same governance workflow.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeader
              title="What this proves"
              subtitle="A governed layer turns silent failures into owned work."
              icon={<ClipboardList className="h-4 w-4" />}
            />
            <div className="space-y-2 text-sm leading-6 text-slate-300">
              {[
                'Paychex, PenguinData, QuickBooks, and Google Drive keep their jobs.',
                'Every mismatch gets categorized, logged, and routed to a responsible owner.',
                'Retryable items can be reprocessed; blocked items require human decision.',
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader
              title="System pulse"
              subtitle={`${systemsHealthy} of ${systemCards.length} systems healthy · ${runCount} automation runs this session`}
              icon={<RadioTower className="h-4 w-4" />}
            />
            <div className="space-y-2">
              {systemCards.map((sys) => (
                <div key={sys.name} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{sys.name}</p>
                    <p className="truncate text-xs text-slate-500">{sys.detail}</p>
                  </div>
                  <StatusBadge tone={sys.status} label={sys.status} pulse={sys.status === 'active'} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]">
        <Card>
          <SectionHeader
            title="Latest system events"
            subtitle="Most recent cross-system activity"
            icon={<Activity className="h-4 w-4" />}
          />
          <Timeline rows={timelineRows} />
        </Card>

        <Card>
          <SectionHeader
            title="Executive takeaway"
            subtitle="The point of the command center"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <p className="text-sm leading-7 text-slate-300">
            The goal is not to show every technical event on one screen. The goal is to give leadership confidence that exceptions are visible, assigned, auditable, and recoverable before they affect payroll, billing, field operations, or reporting.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            Exceptions become managed work <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      </section>
    </div>
  )
}

function CommandStat({ label, value, tone }: { label: string; value: number; tone: 'rose' | 'amber' }) {
  const color = tone === 'rose' ? 'text-rose-300' : 'text-amber-300'
  return (
    <div className="rounded-xl border border-white/[0.06] bg-base-950/35 p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-2xl font-black tabular ${color}`}>{value}</p>
    </div>
  )
}
