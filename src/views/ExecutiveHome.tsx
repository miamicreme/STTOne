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
import { AlertTriangle, ShieldCheck } from 'lucide-react'

import { Card, CardHeader, CountPill, EmptyState } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { ExceptionRow } from '../components/ExceptionRow'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { executiveKpis, portfolioByRegion, leakageLines, leakageTotal, systemCards } from '../data'
import { useApp } from '../state/AppContext'

const VISIBLE_EXCEPTIONS = 5

const chartColors = {
  underground: '#2f86e0',
  aerial: '#a78bfa',
  wireless: '#f59e0b',
  fulfillment: '#22c55e',
}

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode } = useApp()

  const payrollKpi = executiveKpis.find(k => k.label === 'Payroll Sync Health')
  const syncHealthy = payrollKpi ? parseFloat(payrollKpi.value) >= 95 : true

  const pulse = [
    {
      label: 'Payroll sync',
      value: payrollKpi?.value ?? '—',
      ok: syncHealthy,
    },
    {
      label: 'Open exceptions',
      value: String(exceptions.length),
      ok: exceptions.length === 0,
    },
    {
      label: 'Systems connected',
      value: `${systemCards.filter(s => s.status !== 'error').length} / ${systemCards.length}`,
      ok: systemCards.every(s => s.status !== 'warning' && s.status !== 'error'),
    },
  ]

  return (
    <div className="space-y-5">

      {/* ── Hero banner — single row ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/20 bg-gradient-to-r from-base-850/80 to-base-900/70 px-5 py-3">
        {/* Left — label + number inline */}
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Preventable leakage
          </span>
          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={`$${leakageTotal.toLocaleString('en-US')}`}
              className="font-display text-[1.6rem] font-bold leading-none tracking-tightest text-gradient tabular"
            />
            <span className="text-sm font-semibold text-slate-400">/yr</span>
          </div>
        </div>
        {/* Right — chips in a row */}
        <div className="flex flex-wrap gap-2">
          {leakageLines.map((line) => (
            <div
              key={line.label}
              className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-base-900/60 px-3 py-1.5"
            >
              <span className="font-display text-[13px] font-bold tabular text-white">
                ${Math.round(line.amount / 1000)}K
              </span>
              <span className="text-[10px] text-slate-500">
                {line.label.split(' — ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pulse strip — three traffic-light signals ─────────────────── */}
      <div className="flex flex-wrap gap-3">
        {pulse.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-base-900/50 px-4 py-2.5"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${p.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-[12px] font-semibold text-white tabular">{p.value}</span>
            <span className="text-[11px] text-slate-500">{p.label}</span>
          </div>
        ))}
      </div>

      {/* ── KPI strip ────────────────────────────────────────────────── */}
      <div
        data-tour="kpis"
        className={`grid gap-3 ${
          boardroomMode ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
        }`}
      >
        {executiveKpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* ── Exceptions + Portfolio ────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Exceptions — left, wider, action-first */}
        <Card padded={false} className="flex flex-col lg:col-span-2" tourId="exceptions">
          <CardHeader
            title="Needs attention"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            hint="Cross-system conflicts that must be resolved before payroll lock."
            action={<CountPill tone="rose">{exceptions.length}</CountPill>}
          />
          <div className="flex-1 space-y-2 p-4">
            {exceptions.length === 0 ? (
              <EmptyState
                icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
                title="All clear"
                subtitle="No exceptions before payroll lock."
                className="h-full"
              />
            ) : (
              <>
                {exceptions.slice(0, VISIBLE_EXCEPTIONS).map((exc) => (
                  <ExceptionRow key={exc.id} exception={exc} compact onRetry={resolveException} />
                ))}
                {exceptions.length > VISIBLE_EXCEPTIONS && (
                  <button
                    onClick={() => setPage('integration')}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 text-[11px] font-medium text-slate-400 transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    +{exceptions.length - VISIBLE_EXCEPTIONS} more in the queue →
                  </button>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Portfolio chart — right, 3/5 width */}
        <Card className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-[13px] font-bold text-white">Active Portfolio by Region</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              24 discipline workstreams · 17 active programs · simulated
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioByRegion} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2840" vertical={false} />
                <XAxis
                  dataKey="region"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#1c2840' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(47,134,224,0.06)' }}
                  contentStyle={{
                    background: '#0f1729',
                    border: '1px solid #28374f',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} height={36} />
                <Bar dataKey="underground" stackId="a" fill={chartColors.underground} name="Underground" radius={[0,0,0,0]} />
                <Bar dataKey="aerial"      stackId="a" fill={chartColors.aerial}      name="Aerial" />
                <Bar dataKey="wireless"    stackId="a" fill={chartColors.wireless}    name="Wireless" />
                <Bar dataKey="fulfillment" stackId="a" fill={chartColors.fulfillment} name="Fulfillment" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  )
}
