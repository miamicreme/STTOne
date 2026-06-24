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
import { Truck, Wrench, Users, Gauge } from 'lucide-react'
import { Card, SectionHeader, CardHeader } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { fleetHealth, fleetKpis, overdueMaintenance, crewBoard } from '../data'

const crewStatusTone: Record<string, 'on-track' | 'active' | 'neutral'> = {
  'on-site': 'on-track',
  mobilizing: 'active',
  standby: 'neutral',
}

export function FieldOps() {
  const totalAssets = fleetHealth.reduce((s, f) => s + f.count, 0)

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {fleetKpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fleet health chart */}
        <Card className="lg:col-span-2">
          <SectionHeader
            title="Fleet Health"
            subtitle={`${totalAssets} mobile assets · by status`}
            icon={<Truck className="h-4 w-4" />}
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetHealth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2840" vertical={false} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#1c2840' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(56,189,248,0.06)' }}
                  contentStyle={{
                    background: '#0f1729',
                    border: '1px solid #28374f',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={64}>
                  {fleetHealth.map((f) => (
                    <Cell key={f.status} fill={f.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Utilization gauge + summary */}
        <Card className="flex flex-col justify-between">
          <SectionHeader
            title="Fleet Utilization"
            icon={<Gauge className="h-4 w-4" />}
            hint="Percentage of the 64-asset fleet on active assignment or en route this week. Target is ≥85%. Assets in scheduled maintenance or standby reduce this figure."
          />
          <div className="flex flex-col items-center py-2">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1c2840" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - 0.81)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold tabular text-white">81%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">utilized</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-center">
            <div>
              <p className="text-2xl font-bold tabular text-white">146</p>
              <p className="text-[11px] text-slate-500">Open work orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular text-amber-300">7</p>
              <p className="text-[11px] text-slate-500">Maintenance due</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overdue maintenance */}
        <Card padded={false}>
          <CardHeader
            title="Overdue & Upcoming Maintenance"
            icon={<Wrench className="h-4 w-4 text-amber-400" />}
            hint="Assets past or within 14 days of a scheduled service interval. High-severity items risk field downtime and should be scheduled immediately; medium-severity within the current sprint."
            action={<span className="text-[11px] text-slate-500">{overdueMaintenance.length} assets</span>}
          />
          <div className="divide-y divide-white/[0.05]">
            {overdueMaintenance.map((m) => (
              <div key={m.asset} className="flex items-center gap-3 p-3.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    m.severity === 'high'
                      ? 'bg-rose-400'
                      : m.severity === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-slate-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{m.asset}</p>
                  <p className="truncate text-xs text-slate-500">
                    {m.type} · {m.region}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium tabular ${
                    m.severity === 'high' ? 'text-rose-300' : 'text-slate-400'
                  }`}
                >
                  {m.dueIn}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Crew board */}
        <Card padded={false}>
          <CardHeader
            title="Crew Board"
            icon={<Users className="h-4 w-4 text-accent" />}
            action={<span className="text-[11px] text-slate-500">{crewBoard.length} crews</span>}
          />
          <div className="space-y-2 p-4">
            {crewBoard.map((c) => (
              <div
                key={c.name}
                className="rounded-lg border border-white/[0.06] bg-base-800/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-100">{c.name}</p>
                  <StatusBadge tone={crewStatusTone[c.status]} label={c.status} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {c.region} · Lead {c.lead} · {c.members} crew
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">▸ {c.assignment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fleet status mini-bars */}
      <Card>
        <SectionHeader title="Fleet Mix" subtitle="Share of mobile assets by status" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fleetHealth.map((f) => (
            <div key={f.status}>
              <ProgressBar
                value={Math.round((f.count / totalAssets) * 100)}
                label={f.status}
                caption={`${f.count} · ${Math.round((f.count / totalAssets) * 100)}%`}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
