import type { ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Info,
  RadioTower,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { Card, CardHeader, EmptyState, SectionHeader } from '../components/Card'
import { ExceptionRow } from '../components/ExceptionRow'
import { StatusBadge } from '../components/StatusBadge'
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

const resolutionSteps = [
  { label: 'Detect', body: 'Catch the mismatch at the governed layer.' },
  { label: 'Assign', body: 'Route it to the system owner or business owner.' },
  { label: 'Recover', body: 'Retry clean records and escalate blocked decisions.' },
]

export function IntegrationHealth() {
  const { exceptions, events, resolveException, runCount } = useApp()

  const retryable = exceptions.filter((e) => e.retryable)
  const blocked = exceptions.filter((e) => !e.retryable)
  const highPriority = exceptions.find((e) => e.severity === 'high') ?? exceptions[0]
  const nextItems = exceptions.filter((e) => e.id !== highPriority?.id).slice(0, 2)
  const hiddenItems = Math.max(0, exceptions.length - 1 - nextItems.length)
  const systemsHealthy = systemCards.filter((sys) => sys.status === 'healthy').length
  const latestEvents: TimelineRow[] = events.slice(0, 3).map((ev) => ({
    id: ev.id,
    title: `${ev.system} · ${ev.message}`,
    time: ev.time,
    tone: ev.level,
    icon: levelIcon[ev.level],
  }))

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.14] via-base-850/65 to-base-900/75 p-5 shadow-glow md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.12fr_.88fr] xl:items-end">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">Exception command center</p>
            <h1 className="mt-2 max-w-4xl font-display text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
              Bad data becomes owned work before it becomes business risk.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Detect the mismatch, assign the owner, retry what can be retried, and escalate what needs a decision.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.08] bg-base-950/35 p-3">
            <CommandStat label="Open" value={exceptions.length} tone="rose" />
            <CommandStat label="Retry" value={retryable.length} tone="amber" />
            <CommandStat label="Blocked" value={blocked.length} tone="rose" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <Card padded={false} tourId="intq" className="overflow-hidden">
          <CardHeader
            title="Priority exception"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            action={<span className="text-[11px] text-slate-500">{retryable.length} retryable · {blocked.length} blocked</span>}
          />
          <div className="space-y-3 p-4">
            {highPriority ? (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-500/[0.06] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-300">Needs owner decision</p>
                  <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-200">
                    {categoryLabel[highPriority.category] ?? highPriority.category}
                  </span>
                </div>
                <ExceptionRow exception={highPriority} onRetry={resolveException} />
              </div>
            ) : (
              <EmptyState title="Queue is clear" subtitle="All systems reconciled." className="py-10" />
            )}

            {nextItems.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-base-950/25 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Next in line</p>
                  {hiddenItems > 0 && <span className="text-[11px] text-slate-500">+{hiddenItems} held</span>}
                </div>
                <div className="space-y-2">
                  {nextItems.map((exc) => (
                    <ExceptionRow key={exc.id} exception={exc} compact onRetry={resolveException} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <Card>
            <SectionHeader
              title="Resolution path"
              subtitle="The operating model in three moves"
              icon={<ClipboardList className="h-4 w-4" />}
            />
            <div className="grid gap-2">
              {resolutionSteps.map((step, index) => (
                <div key={step.label} className="flex gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-[11px] font-black text-accent">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-400">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader
              title="Executive readout"
              subtitle="What leadership needs to know"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            <div className="grid gap-2">
              <ProofPoint icon={<ShieldCheck className="h-4 w-4" />} title="Visible" body="No silent failures between systems." />
              <ProofPoint icon={<UserCheck className="h-4 w-4" />} title="Owned" body="Every exception has an accountable next action." />
              <ProofPoint icon={<CheckCircle2 className="h-4 w-4" />} title="Recoverable" body="Clean records move again after correction." />
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <SectionHeader
            title="System pulse"
            subtitle={`${systemsHealthy} of ${systemCards.length} healthy · ${runCount} automation runs`}
            icon={<RadioTower className="h-4 w-4" />}
          />
          <div className="grid gap-2 sm:grid-cols-2">
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

        <Card>
          <SectionHeader
            title="Latest events"
            subtitle="Recent activity only — no noisy feed"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <div className="grid gap-4 xl:grid-cols-[.95fr_1.05fr]">
            <Timeline rows={latestEvents} />
            <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-4">
              <p className="text-sm font-semibold text-white">Executive takeaway</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                This is the difference between connected systems and governed operations: every mismatch is visible, auditable, recoverable, and assigned before it damages payroll, billing, field work, or reporting.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                Exceptions become managed work <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

function ProofPoint({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">{body}</p>
      </div>
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
