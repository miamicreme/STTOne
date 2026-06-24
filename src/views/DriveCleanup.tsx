import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Copy,
  ShieldAlert,
  HardDrive,
  FileStack,
  ArrowUpRight,
  Lock,
} from 'lucide-react'
import { Card, SectionHeader, CardHeader, CountPill } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import {
  fileVolumes,
  driveByDomain,
  duplicateGroups,
  permissionRisks,
  migrationQueue,
} from '../data'

const toneText: Record<string, string> = {
  neutral: 'text-white',
  warn: 'text-amber-300',
  good: 'text-emerald-300',
  danger: 'text-rose-300',
}

const totalFiles = driveByDomain.reduce((s, d) => s + d.value, 0)

export function DriveCleanup() {
  return (
    <div className="space-y-6">
      {/* File-volume cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {fileVolumes.map((v, i) => (
          <div
            key={v.label}
            className="lift animate-rise rounded-2xl border border-white/[0.07] bg-base-850/60 p-4"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500">{v.label}</p>
            <AnimatedNumber
              value={v.value.toLocaleString()}
              className={`mt-2 block font-display text-[1.9rem] font-bold leading-none tabular ${toneText[v.tone]}`}
            />
            <p className="mt-1.5 text-[11px] text-slate-500">{v.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Donut */}
        <Card>
          <SectionHeader
            title="Files by Document Domain"
            subtitle="58,412 indexed · simulated"
            icon={<HardDrive className="h-4 w-4" />}
          />
          <div className="relative h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={driveByDomain}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  stroke="none"
                >
                  {driveByDomain.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f1729',
                    border: '1px solid #28374f',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={52}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[52px] flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular text-white">
                {(totalFiles / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Total files</span>
            </div>
          </div>
        </Card>

        {/* Duplicate tracker */}
        <Card className="lg:col-span-2" padded={false} tourId="drive-dupes">
          <CardHeader
            title="Duplicate Tracker"
            icon={<Copy className="h-4 w-4 text-amber-400" />}
            action={<CountPill tone="amber">7,936 candidates</CountPill>}
          />
          <div className="divide-y divide-white/[0.05]">
            {duplicateGroups.map((g) => (
              <div key={g.name} className="flex items-center gap-4 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                  <FileStack className="h-4 w-4 text-slate-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{g.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {g.domain} · {g.sizeMb} MB · {g.recommendation}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-xs font-semibold tabular text-amber-300">
                  ×{g.copies}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Permission risk */}
        <Card padded={false}>
          <CardHeader
            title="Permission Risk Panel"
            icon={<ShieldAlert className="h-4 w-4 text-rose-400" />}
            hint="Files shared externally or with overly broad internal access, flagged during the Drive audit. Target is zero external shares for payroll and HR document domains."
            action={<Lock className="h-4 w-4 text-slate-600" />}
          />
          <div className="space-y-2 p-4">
            {permissionRisks.map((r) => (
              <div
                key={r.scope}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-base-800/50 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">{r.scope}</p>
                    <StatusBadge tone={r.level} label={r.level} dot={false} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{r.detail}</p>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold tabular text-slate-200">
                    {r.files.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">files</span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Migration queue */}
        <Card>
          <SectionHeader
            title="Migration Queue"
            subtitle="Drive → system of record"
            icon={<ArrowUpRight className="h-4 w-4" />}
            hint="Progress moving each document domain out of the shared Drive into its authoritative system of record. Once complete, Drive becomes a staging area only — no source-of-truth files."
          />
          <div className="space-y-5 pt-1">
            {migrationQueue.map((m) => (
              <div key={m.domain}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">
                    {m.domain}{' '}
                    <span className="text-xs text-slate-500">→ {m.target}</span>
                  </span>
                  <span className="tabular text-slate-400">
                    {m.progress}% · {m.files.toLocaleString()} files
                  </span>
                </div>
                <ProgressBar value={m.progress} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-accent/20 bg-accent/[0.06] p-3 text-xs text-slate-300">
            <span className="font-semibold text-accent">3,860 files</span> classified, mapped, and
            migration-ready. Estimated <span className="font-semibold text-white">126 admin hrs</span>{' '}
            saved per month once cutover completes.
          </div>
        </Card>
      </div>
    </div>
  )
}
