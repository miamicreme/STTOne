'use client'

import { Gauge, ShieldAlert, Map, Flag, CheckCircle2, Loader2, Circle, ArrowRight } from 'lucide-react'
import { Card, SectionHeader, CardHeader } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import {
  boardKpis,
  riskHeatmap,
  riskDimensions,
  riskLabels,
  transformationRoadmap,
  projects,
  type RiskLevel,
  type MilestoneStatus,
} from '../data'
import { useApp } from '../state/AppContext'

const riskCell: Record<RiskLevel, string> = {
  0: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
  1: 'bg-sky-500/15 text-sky-300 ring-sky-500/25',
  2: 'bg-amber-500/15 text-amber-300 ring-amber-500/25',
  3: 'bg-rose-500/15 text-rose-300 ring-rose-500/25',
}

const milestoneMeta: Record<
  MilestoneStatus,
  { icon: typeof CheckCircle2; cls: string; label: string }
> = {
  done: { icon: CheckCircle2, cls: 'text-emerald-400', label: 'Complete' },
  'in-progress': { icon: Loader2, cls: 'text-accent', label: 'In progress' },
  planned: { icon: Circle, cls: 'text-slate-500', label: 'Planned' },
}

export function CEOBoardView() {
  const { exceptions, setPage } = useApp()
  const atRisk = projects.filter((p) => p.status === 'at-risk' || p.status === 'blocked')
  const doneCount = transformationRoadmap.filter((m) => m.status === 'done').length
  const roadmapProgress = Math.round((doneCount / transformationRoadmap.length) * 100)

  return (
    <div className="space-y-6">
      {/* Executive summary hero */}
      <div className="sheen relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.14] via-base-850/50 to-base-850/40 p-6 shadow-glow">
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">
              Board Brief · Q2 2026
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
              Professionalizing the back office, at execution speed.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              A decade of HR, fleet, and project data is being moved out of the Google Drive
              “junk drawer” into a clean stack — Paychex for people, PenguinData for operations,
              QuickBooks for finance — with exception governance instead of silent failures.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-base-900/50 px-4 py-3 sm:w-auto sm:justify-start">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Open Exceptions</p>
              <p className="font-display text-3xl font-bold tabular text-rose-300">
                {exceptions.length}
              </p>
            </div>
            <button
              onClick={() => setPage('integration')}
              className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              Review
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Board KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {boardKpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk heat map */}
        <Card className="lg:col-span-2" tourId="risk">
          <SectionHeader
            title="Regional Risk Heat Map"
            subtitle="Operational risk by region & dimension · simulated"
            icon={<Map className="h-4 w-4" />}
            hint="Operational exposure by region across five dimensions — payroll sync health, fleet coverage, AR billing accuracy, document classification, and schedule fidelity."
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1 text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Region
                  </th>
                  {riskDimensions.map((d) => (
                    <th
                      key={d}
                      className="px-2 py-1 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riskHeatmap.map((row) => (
                  <tr key={row.region}>
                    <td className="whitespace-nowrap px-2 py-1 text-sm font-medium text-slate-200">
                      {row.region}
                    </td>
                    {(['payroll', 'fleet', 'billing', 'docs', 'schedule'] as const).map((dim) => {
                      const lvl = row[dim]
                      return (
                        <td key={dim} className="px-1 py-1">
                          <div
                            title={`${row.region} · ${dim}: ${riskLabels[lvl]}`}
                            className={`flex h-9 items-center justify-center rounded-lg text-[11px] font-semibold ring-1 ring-inset ${riskCell[lvl]}`}
                          >
                            {riskLabels[lvl]}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-3">
            {([0, 1, 2, 3] as RiskLevel[]).map((lvl) => (
              <span key={lvl} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className={`h-3 w-3 rounded ring-1 ring-inset ${riskCell[lvl]}`} />
                {riskLabels[lvl]}
              </span>
            ))}
          </div>
        </Card>

        {/* Transformation roadmap */}
        <Card padded={false} className="flex flex-col">
          <CardHeader
            title="Transformation Roadmap"
            icon={<Flag className="h-4 w-4 text-accent" />}
            below={
              <div className="mt-3">
                <ProgressBar value={roadmapProgress} caption={`${roadmapProgress}% delivered`} size="sm" />
              </div>
            }
          />
          <div className="space-y-3 p-4">
            {transformationRoadmap.map((m) => {
              const meta = milestoneMeta[m.status]
              const Icon = meta.icon
              return (
                <div key={m.title} className="flex gap-3">
                  <Icon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${meta.cls} ${
                      m.status === 'in-progress' ? 'animate-spin' : ''
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-100">{m.title}</p>
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-500">
                        {m.quarter}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{m.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* At-risk portfolio + savings callout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" padded={false}>
          <CardHeader
            title="Programs Needing Board Attention"
            icon={<ShieldAlert className="h-4 w-4 text-amber-400" />}
            action={
              <button
                onClick={() => setPage('projects')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                Full portfolio
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="divide-y divide-white/[0.05]">
            {atRisk.map((p) => (
              <div key={p.name} className="flex items-center gap-4 p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{p.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {p.region} · {p.type} — {p.issue}
                  </p>
                </div>
                {p.complete !== null && (
                  <span className="hidden w-28 shrink-0 sm:block">
                    <ProgressBar value={p.complete} caption={`${p.complete}%`} size="sm" />
                  </span>
                )}
                <span className="shrink-0">
                  <StatusBadge tone={p.status === 'blocked' ? 'blocked' : 'at-risk'} label={p.status} dot={false} />
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <SectionHeader
            title="Modeled Impact"
            icon={<Gauge className="h-4 w-4" />}
            hint="Annualized estimate from reclaimed admin time (126 hrs/mo at blended $25/hr) plus billing leakage reduction once the Drive migration cutover completes. Conservative baseline only."
          />
          <div className="space-y-4">
            <ImpactRow label="Admin hours saved / mo" value="126 hrs" pct={70} />
            <ImpactRow label="Duplicate entry reduction" value="61%" pct={61} />
            <ImpactRow label="Drive classified" value="71%" pct={71} />
            <ImpactRow label="Onboarding cycle cut" value="20%" pct={20} />
          </div>
          <div className="mt-5 rounded-xl border border-accent/20 bg-accent/[0.06] p-3 text-xs text-slate-300">
            Combined <span className="font-semibold text-accent">~$214K/yr</span> modeled impact from
            reclaimed admin time and reduced billing leakage once migration cutover completes.
          </div>
        </Card>
      </div>
    </div>
  )
}

function ImpactRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold tabular text-white">{value}</span>
      </div>
      <ProgressBar value={pct} size="sm" />
    </div>
  )
}
