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
import { AlertTriangle, ArrowRight, ShieldCheck, DollarSign, Play } from 'lucide-react'
import { Card, SectionHeader } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { ExceptionRow } from '../components/ExceptionRow'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Hint } from '../components/Hint'
import { executiveKpis, portfolioByRegion, leakageLines, leakageTotal } from '../data'
import { useApp } from '../state/AppContext'

const chartColors = {
  underground: '#38bdf8',
  aerial: '#a78bfa',
  wireless: '#f59e0b',
  fulfillment: '#22c55e',
}

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode, startTour } = useApp()

  return (
    <div className="space-y-6">
      {/* Executive headline — the number that matters, above the fold */}
      <div className="sheen relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-base-850/80 via-base-850/55 to-base-900/70 p-5 shadow-glow sm:p-6">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Big number + CTA */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              <DollarSign className="h-3.5 w-3.5" />
              Preventable annual leakage
              <Hint text="Modeled, simulated figure: the four lines below reconcile exactly to this headline. Recoverable once Paychex is the system of record and exceptions stop failing silently." />
            </div>
            <div className="mt-2 flex items-end gap-2">
              <AnimatedNumber
                value={`$${leakageTotal.toLocaleString('en-US')}`}
                className="font-display text-[2.7rem] font-bold leading-none tracking-tightest text-gradient tabular sm:text-[3.5rem]"
              />
              <span className="mb-1.5 text-lg font-semibold text-slate-400">/yr</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Recoverable across payroll, billing, and admin once Paychex is the source of truth and
              exceptions stop failing silently.
            </p>
            <button
              onClick={startTour}
              className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-4 py-2.5 text-sm font-semibold text-base-950 shadow-[0_8px_24px_-8px_rgba(56,189,248,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Watch the auto-tour
            </button>
          </div>

          {/* Breakdown — reconciles exactly to the headline */}
          <div className="grid w-full shrink-0 grid-cols-2 gap-2 lg:w-[26rem]">
            {leakageLines.map((line) => (
              <div
                key={line.label}
                className="rounded-xl border border-white/[0.07] bg-base-900/50 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-base font-bold tabular text-white">
                    ${Math.round(line.amount / 1000)}K
                  </span>
                  <span className="text-[9.5px] uppercase tracking-wide text-slate-500">
                    {line.system}
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] font-medium leading-tight text-slate-300">
                  {line.label}
                </p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-slate-500">{line.driver}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational pulse banner */}
      <div className="sheen relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.14] via-base-850/50 to-base-850/40 p-5 shadow-glow">
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/15 text-accent shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-base font-semibold tracking-tight text-white">
                17 active programs across 6 regions.
              </p>
              <p className="mt-0.5 text-sm text-amber-300">
                {exceptions.length} exceptions need review before payroll lock.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('integration')}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/20 hover:shadow-[0_0_18px_-4px_rgba(56,189,248,0.6)]"
          >
            Review exceptions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div
        data-tour="kpis"
        className={`grid gap-4 ${
          boardroomMode ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
        }`}
      >
        {executiveKpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
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
        <Card padded={false} className="flex flex-col" tourId="exceptions">
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100">Exception Drawer</h2>
              <Hint text="Cross-system data conflicts or missing records that block payroll or onboarding. Each item must be resolved or retried before the weekly payroll lock." />
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
