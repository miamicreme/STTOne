import { FolderKanban, AlertTriangle, MapPin } from 'lucide-react'
import { Card, SectionHeader } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { projects, type ProjectPhase, type ProjectStatus } from '../data'

const phaseLabel: Record<ProjectPhase, string> = {
  design: 'Design',
  build: 'Build',
  qc: 'QC',
  closeout: 'Closeout',
}

const phaseOrder: ProjectPhase[] = ['design', 'build', 'qc', 'closeout']

const statusTone: Record<ProjectStatus, 'on-track' | 'at-risk' | 'blocked' | 'active'> = {
  'on-track': 'on-track',
  'at-risk': 'at-risk',
  blocked: 'blocked',
  active: 'active',
}

export function ProjectPortfolio() {
  const atRisk = projects.filter((p) => p.status === 'at-risk' || p.status === 'blocked')

  const avgComplete = Math.round(
    projects.filter((p) => p.complete !== null).reduce((s, p) => s + (p.complete ?? 0), 0) /
      projects.filter((p) => p.complete !== null).length,
  )

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryStat label="Active Programs" value={`${projects.length}`} hint="In portfolio" />
        <SummaryStat label="Avg Completion" value={`${avgComplete}%`} hint="Across active jobs" />
        <SummaryStat label="At Risk" value={`${atRisk.length}`} hint="Need attention" tone="amber" />
        <SummaryStat
          label="Blocked"
          value={`${projects.filter((p) => p.status === 'blocked').length}`}
          hint="Escalate now"
          tone="rose"
        />
      </div>

      {/* Phase funnel */}
      <Card>
        <SectionHeader title="Portfolio by Phase" subtitle="Program count across delivery phases" />
        <div className="grid grid-cols-4 gap-3">
          {phaseOrder.map((ph) => {
            const count = projects.filter((p) => p.phase === ph).length
            return (
              <div
                key={ph}
                className="rounded-lg border border-white/[0.06] bg-base-800/50 p-4 text-center"
              >
                <p className="text-3xl font-bold tabular text-white">{count}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                  {phaseLabel[ph]}
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project table */}
        <Card className="lg:col-span-2" padded={false}>
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-slate-100">Project Portfolio</h2>
            </div>
            <span className="text-[11px] text-slate-500">{projects.length} programs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {projects.map((p) => (
                  <tr key={p.name} className="align-top transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{p.name}</p>
                      <p className="mt-1 flex items-start gap-1 text-xs text-amber-300/90">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        {p.issue}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {p.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[11px] text-slate-300">
                        {p.type}
                      </span>
                    </td>
                    <td className="w-40 px-4 py-3">
                      {p.complete === null ? (
                        <span className="text-xs text-slate-500">Active · n/a</span>
                      ) : (
                        <ProgressBar value={p.complete} caption={`${p.complete}%`} size="sm" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone[p.status]} label={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* At-risk panel */}
        <Card padded={false} className="flex flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100">At-Risk Programs</h2>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold tabular text-amber-300">
              {atRisk.length}
            </span>
          </div>
          <div className="space-y-2 p-4">
            {atRisk.map((p) => (
              <div
                key={p.name}
                className="rounded-lg border border-white/[0.06] bg-base-800/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-100">{p.name}</p>
                  <StatusBadge tone={statusTone[p.status]} label={p.status} dot={false} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {p.region} · {p.type} · {phaseLabel[p.phase]}
                </p>
                <p className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-500/15 bg-amber-500/[0.06] px-2 py-1.5 text-xs text-amber-200/90">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  {p.issue}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function SummaryStat({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint: string
  tone?: 'neutral' | 'amber' | 'rose'
}) {
  const color = {
    neutral: 'text-white',
    amber: 'text-amber-300',
    rose: 'text-rose-300',
  }[tone]
  return (
    <Card>
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{hint}</p>
    </Card>
  )
}
