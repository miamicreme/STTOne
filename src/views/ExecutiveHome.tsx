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
import { Card, SectionHeader, CardHeader, CountPill, EmptyState } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { ExceptionRow } from '../components/ExceptionRow'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Hint } from '../components/Hint'
import { executiveKpis, portfolioByRegion, leakageLines, leakageTotal } from '../data'
import { useApp } from '../state/AppContext'

const chartColors = {
  underground: '#2f86e0',
  aerial: '#a78bfa',
  wireless: '#f59e0b',
  fulfillment: '#22c55e',
}

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode, startTour } = useApp()

  return (
    <div className="space-y-6">
      {/* Executive headline — the number that matters, above the fold */}
      <div className="edge-accent sheen relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-base-850/80 via-base-850/55 to-base-900/70 p-5 shadow-glow sm:p-6">
        {/* Floating accent orbs for depth */}
        <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-brand-red/[0.06] blur-3xl" />
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
              className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Watch the auto-tour
            </button>
          </div>

          {/* Breakdown — reconciles exactly to the headline */}
          <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 lg:w-[26rem] lg:grid-cols-2 lg:gap-2">
            {leakageLines.map((line, i) => (
              <div
                key={line.label}
                className="animate-rise rounded-xl border border-white/[0.07] bg-base-900/50 p-3"
                style={{ animationDelay: `${i * 70}ms` }}
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
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/15 text-accent shadow-[0_0_20px_-6px_rgba(47,134,224,0.7)]">
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
            className="group inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/20 hover:shadow-[0_0_18px_-4px_rgba(47,134,224,0.6)]"
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
          boardroomMode ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
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
                  cursor={{ fill: 'rgba(47,134,224,0.06)' }}
                  contentStyle={{
                    background: '#0f1729',
                    border: '1px solid #28374f',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} height={40} />
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
          <CardHeader
            title="Exception Drawer"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            hint="Cross-system data conflicts or missing records that block payroll or onboarding. Each item must be resolved or retried before the weekly payroll lock."
            action={<CountPill tone="rose">{exceptions.length}</CountPill>}
          />
          <div className="max-h-[19rem] flex-1 space-y-2 overflow-y-auto p-4">
            {exceptions.length === 0 ? (
              <EmptyState
                icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
                title="All clear"
                subtitle="No exceptions before payroll lock."
                className="h-full"
              />
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
