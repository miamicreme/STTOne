import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RadioTower,
  CircleAlert,
  Info,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { Card, SectionHeader, CardHeader, EmptyState } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { ExceptionRow } from '../components/ExceptionRow'
import { Hint } from '../components/Hint'
import { Timeline, type TimelineRow } from '../components/Timeline'
import { systemCards, type ExceptionCategory } from '../data'
import { useApp } from '../state/AppContext'

const categoryLabels: Record<ExceptionCategory, string> = {
  'missing-field': 'Missing field',
  'id-mismatch': 'ID mismatch',
  duplicate: 'Duplicate',
  'accounting-map': 'Accounting map',
  credential: 'Credential',
}

const categoryColor: Record<ExceptionCategory, string> = {
  'missing-field': '#2f86e0',
  'id-mismatch': '#a78bfa',
  duplicate: '#f59e0b',
  'accounting-map': '#f97316',
  credential: '#ef4444',
}

const levelIcon = {
  success: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />,
  info: <Info className="h-3.5 w-3.5 text-sky-400" />,
  warning: <CircleAlert className="h-3.5 w-3.5 text-amber-400" />,
  error: <XCircle className="h-3.5 w-3.5 text-rose-400" />,
}

export function IntegrationHealth() {
  const { exceptions, events, resolveException, runCount } = useApp()

  // Live taxonomy computed from shared exceptions — reflects New Hire runs.
  const taxonomy = (Object.keys(categoryLabels) as ExceptionCategory[])
    .map((key) => ({
      key,
      category: categoryLabels[key],
      count: exceptions.filter((e) => e.category === key).length,
    }))
    .filter((t) => t.count > 0)

  const retryable = exceptions.filter((e) => e.retryable)
  const blocked = exceptions.filter((e) => !e.retryable)

  const timelineRows: TimelineRow[] = events.map((ev) => ({
    id: ev.id,
    title: `${ev.system} · ${ev.message}`,
    time: ev.time,
    tone: ev.level,
    icon: levelIcon[ev.level],
  }))

  return (
    <div className="space-y-6">
      {/* System status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemCards.map((sys) => (
          <Card key={sys.name} hover>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {sys.status === 'healthy' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : sys.status === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                ) : (
                  <RadioTower className="h-4 w-4 text-sky-400" />
                )}
                <span className="text-sm font-semibold text-white">{sys.name}</span>
              </div>
              <StatusBadge tone={sys.status} label={sys.status} pulse={sys.status === 'active'} />
            </div>
            <p className="mt-3 text-xs text-slate-400">{sys.detail}</p>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
              <span>Uptime {sys.uptime}</span>
              <span className="tabular">Sync {sys.lastSync}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="Open Exceptions" value={exceptions.length} tone="rose" hint="Total unresolved items across all integration systems. Each exception blocks a payroll record, a hire, or an invoice until resolved." />
        <MiniStat label="Retryable" value={retryable.length} tone="amber" hint="Exceptions that can be automatically reprocessed on the next sync once the underlying data issue is corrected — typically a missing field or ID mismatch." />
        <MiniStat label="Blocked" value={blocked.length} tone="rose" hint="Exceptions requiring direct human action — typically a missing credential or unresolvable conflict — before the record can move forward." />
        <MiniStat label="Automation Runs" value={runCount} tone="sky" hint="Total New Hire automation runs this session. Each run appends an entry to the audit timeline regardless of outcome." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event feed */}
        <Card className="lg:col-span-2">
          <SectionHeader
            title="Live Event Timeline"
            subtitle="Cross-system sync feed · New Hire runs append here"
            icon={<Activity className="h-4 w-4" />}
          />
          <div className="max-h-[26rem] overflow-y-auto pr-1">
            <Timeline rows={timelineRows} />
          </div>
        </Card>

        {/* Exception taxonomy */}
        <Card>
          <SectionHeader
            title="Exception Taxonomy"
            subtitle="By category · live"
            hint="Distribution of open exceptions by root cause. Credential failures require manual resolution; all other categories support automated retry on the next sync cycle."
          />
          {taxonomy.length === 0 ? (
            <EmptyState title="No open exceptions" className="h-64 py-0" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taxonomy}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2840" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={92}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(47,134,224,0.06)' }}
                    contentStyle={{
                      background: '#0f1729',
                      border: '1px solid #28374f',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
                    {taxonomy.map((t) => (
                      <Cell key={t.key} fill={categoryColor[t.key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Exception queue with retry */}
      <Card padded={false} tourId="intq">
        <CardHeader
          title="Exception Queue"
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          hint="Retryable items reprocess automatically on the next sync once the underlying data issue is corrected. Blocked items require manual intervention before the queue can clear."
          action={
            <span className="text-[11px] text-slate-500">
              {retryable.length} retryable · {blocked.length} blocked
            </span>
          }
        />
        <div className="grid gap-2 p-4 md:grid-cols-2">
          {exceptions.length === 0 ? (
            <EmptyState
              title="Queue is clear"
              subtitle="All systems reconciled."
              className="col-span-full py-10"
            />
          ) : (
            exceptions.map((exc) => (
              <ExceptionRow key={exc.id} exception={exc} onRetry={resolveException} />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone,
  hint,
}: {
  label: string
  value: number
  tone: 'rose' | 'amber' | 'sky'
  hint?: string
}) {
  const color = {
    rose: 'text-rose-300',
    amber: 'text-amber-300',
    sky: 'text-sky-300',
  }[tone]
  return (
    <Card hover>
      <p className="flex items-center gap-1 text-[10.5px] uppercase tracking-[0.12em] text-slate-500">
        {label}
        {hint && <Hint text={hint} />}
      </p>
      <AnimatedNumber
        value={String(value)}
        className={`mt-1 block font-display text-[1.9rem] font-bold leading-none tabular ${color}`}
      />
    </Card>
  )
}
