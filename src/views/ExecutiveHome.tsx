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
import { AlertTriangle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react'

import { Card, SectionHeader, CardHeader, CountPill, EmptyState } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { ExceptionRow } from '../components/ExceptionRow'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Hint } from '../components/Hint'
import { executiveKpis, portfolioByRegion, leakageLines, leakageTotal } from '../data'
import { useApp } from '../state/AppContext'

// Cap the drawer so the card fits its cell without scrolling; the rest is one
// quiet tap away on Integration Health.
const VISIBLE_EXCEPTIONS = 4

const chartColors = {
  underground: '#2f86e0',
  aerial: '#a78bfa',
  wireless: '#f59e0b',
  fulfillment: '#22c55e',
}

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode } = useApp()

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
          </div>

          {/* Breakdown — reconciles exactly to the headline */}
          <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 lg:w-[26rem] lg:grid-cols-2 lg:gap-2">
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
            subtitle="24 discipline workstreams across 17 active programs · simulated"
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
                  <ExceptionRow
                    key={exc.id}
                    exception={exc}
                    compact
                    onRetry={resolveException}
                  />
                ))}
                {exceptions.length > VISIBLE_EXCEPTIONS && (
                  <button
                    onClick={() => setPage('integration')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 text-[11px] font-medium text-slate-400 transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    +{exceptions.length - VISIBLE_EXCEPTIONS} more in the queue
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
