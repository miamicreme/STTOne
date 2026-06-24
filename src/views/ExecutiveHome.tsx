import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react'
import { Card, SectionHeader } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { ExceptionRow } from '../components/ExceptionRow'
import { executiveKpis, portfolioByRegion } from '../data'
import { useApp } from '../state/AppContext'

const chartColors = {
  underground: '#38bdf8',
  aerial: '#a78bfa',
  wireless: '#f59e0b',
  fulfillment: '#22c55e',
}

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode } = useApp()

  return (
    <div className="space-y-6">
      {/* Operational pulse banner */}
      <div className="overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 via-base-850/40 to-base-850/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                17 active programs across 6 regions.
              </p>
              <p className="mt-0.5 text-sm text-amber-300">
                {exceptions.length} exceptions need review before payroll lock.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('integration')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Review exceptions
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div
        className={`grid gap-4 ${
          boardroomMode ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
        }`}
      >
        {executiveKpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Chart + exception drawer */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader
            title="Active Portfolio by Region"
            subtitle="Program count by discipline · simulated"
          />
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioByRegion} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2840" vertical={false} />
                <XAxis
                  dataKey="region"
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
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="underground" stackId="a" fill={chartColors.underground} name="Underground" radius={[0, 0, 0, 0]} />
                <Bar dataKey="aerial" stackId="a" fill={chartColors.aerial} name="Aerial" />
                <Bar dataKey="wireless" stackId="a" fill={chartColors.wireless} name="Wireless" />
                <Bar dataKey="fulfillment" stackId="a" fill={chartColors.fulfillment} name="Fulfillment" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Exception drawer */}
        <Card padded={false} className="flex flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100">Exception Drawer</h2>
            </div>
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold tabular text-rose-300">
              {exceptions.length}
            </span>
          </div>
          <div className="max-h-[19rem] flex-1 space-y-2 overflow-y-auto p-4">
            {exceptions.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <ShieldCheck className="mb-2 h-8 w-8 text-emerald-400" />
                <p className="text-sm font-medium text-slate-200">All clear</p>
                <p className="text-xs text-slate-500">No exceptions before payroll lock.</p>
              </div>
            ) : (
              exceptions.map((exc) => (
                <ExceptionRow
                  key={exc.id}
                  exception={exc}
                  compact
                  onRetry={resolveException}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
