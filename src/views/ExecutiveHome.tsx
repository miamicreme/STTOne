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
import { AlertTriangle, ArrowRight, Compass, Network, Route, SearchCheck, ShieldCheck } from 'lucide-react'

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

const storySteps = [
  { page: 'discovery' as const, label: 'Discover', body: 'Interview operators and map how work really moves.', icon: SearchCheck },
  { page: 'architecture' as const, label: 'Govern', body: 'Keep core systems and control the handoffs between them.', icon: Network },
  { page: 'integration' as const, label: 'Expose', body: 'Turn bad data into visible exceptions with owners.', icon: AlertTriangle },
  { page: 'board' as const, label: 'Scale', body: 'Move toward reporting, Power BI, automation, and AI.', icon: Route },
]

export function ExecutiveHome() {
  const { exceptions, resolveException, setPage, boardroomMode, startTour } = useApp()

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
      value: `${systemCards.filter(s => s.status === 'healthy' || s.status === 'active').length} / ${systemCards.length}`,
      ok: systemCards.every(s => s.status === 'healthy' || s.status === 'active'),
    },
  ]

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.16] via-base-850/70 to-base-900/80 p-6 shadow-glow md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_.88fr] xl:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              <Compass className="h-3.5 w-3.5" /> Executive operating model
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              From disconnected tools to governed operations, measurable exceptions, and executive visibility.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              This prototype demonstrates the exact engagement approach: understand the business first, keep Paychex, PenguinData, and QuickBooks as systems of record, add one governed layer between them, and prepare SouthernTier for trusted reporting, Power BI, automation, and AI.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={startTour}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.75)] transition-all hover:brightness-110"
              >
                Walk me through it <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage('discovery')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08]"
              >
                Start with discovery
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-base-950/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Modeled 90-day outcome</p>
            <div className="mt-3 flex items-baseline gap-2">
              <AnimatedNumber value={`$${leakageTotal.toLocaleString('en-US')}`} className="font-display text-4xl font-black leading-none tracking-tightest text-gradient tabular" />
              <span className="text-sm font-semibold text-slate-400">/yr preventable leakage</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Illustrative baseline only. Week one validates the numbers, risks, and first controlled wins.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {leakageLines.map((line) => (
                <div key={line.label} className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                  <p className="font-display text-sm font-bold text-white">${Math.round(line.amount / 1000)}K</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{line.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {storySteps.map((step) => {
          const Icon = step.icon
          return (
            <button
              key={step.label}
              onClick={() => setPage(step.page)}
              className="group rounded-2xl border border-white/[0.07] bg-base-850/55 p-4 text-left shadow-inset transition-colors hover:border-accent/30 hover:bg-accent/[0.06]"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-4 w-4 text-accent" />
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <p className="font-display text-sm font-semibold text-white">{step.label}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">{step.body}</p>
            </button>
          )
        })}
      </section>

      <div className="flex flex-wrap gap-3">
        {pulse.map((p) => (
          <div key={p.label} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-base-900/50 px-4 py-2.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${p.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-[12px] font-semibold text-white tabular">{p.value}</span>
            <span className="text-[11px] text-slate-500">{p.label}</span>
          </div>
        ))}
      </div>

      <div data-tour="kpis" className={`grid gap-3 ${boardroomMode ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'}`}>
        {executiveKpis.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} index={i} />)}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card padded={false} className="flex flex-col lg:col-span-2" tourId="exceptions">
          <CardHeader
            title="Current exceptions"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
            hint="Cross-system conflicts that must become visible before they become operational risk."
            action={<CountPill tone="rose">{exceptions.length}</CountPill>}
          />
          <div className="flex-1 space-y-2 p-4">
            {exceptions.length === 0 ? (
              <EmptyState icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />} title="All clear" subtitle="No exceptions before payroll lock." className="h-full" />
            ) : (
              <>
                {exceptions.slice(0, VISIBLE_EXCEPTIONS).map((exc) => (
                  <ExceptionRow key={exc.id} exception={exc} compact onRetry={resolveException} />
                ))}
                {exceptions.length > VISIBLE_EXCEPTIONS && (
                  <button onClick={() => setPage('integration')} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 text-[11px] font-medium text-slate-400 transition-colors hover:border-accent/30 hover:text-accent">
                    +{exceptions.length - VISIBLE_EXCEPTIONS} more in the queue →
                  </button>
                )}
              </>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-[13px] font-bold text-white">Where leadership gets visibility</p>
            <p className="mt-0.5 text-[11px] text-slate-500">24 discipline workstreams · 17 active programs · simulated</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioByRegion} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2840" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#1c2840' }} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(47,134,224,0.06)' }} contentStyle={{ background: '#0f1729', border: '1px solid #28374f', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} height={36} />
                <Bar dataKey="underground" stackId="a" fill={chartColors.underground} name="Underground" radius={[0,0,0,0]} />
                <Bar dataKey="aerial" stackId="a" fill={chartColors.aerial} name="Aerial" />
                <Bar dataKey="wireless" stackId="a" fill={chartColors.wireless} name="Wireless" />
                <Bar dataKey="fulfillment" stackId="a" fill={chartColors.fulfillment} name="Fulfillment" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
