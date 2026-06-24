'use client'

import {
  Network,
  Webhook,
  Clock,
  Zap,
  ShieldCheck,
  Database,
  Workflow,
  Lock,
} from 'lucide-react'
import { Card, SectionHeader } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import {
  systemsOfRecord,
  pipelineJobs,
  governanceGuards,
  type PipelineTrigger,
} from '../data'

const triggerMeta: Record<
  PipelineTrigger,
  { label: string; Icon: typeof Webhook; cls: string }
> = {
  webhook: { label: 'Webhook', Icon: Webhook, cls: 'text-accent' },
  scheduled: { label: 'Scheduled', Icon: Clock, cls: 'text-violet-300' },
  event: { label: 'Event', Icon: Zap, cls: 'text-amber-300' },
}

/* Connector edges for the data-flow diagram. */
const edges: {
  d: string
  warn?: boolean
  label: string
  lx: number
  ly: number
  anchor?: 'start' | 'middle'
}[] = [
  { d: 'M220 99 C300 99 300 170 372 170', label: 'worker.created', lx: 272, ly: 120 },
  { d: 'M220 333 C300 333 300 266 372 266', label: 'scan + classify', lx: 268, ly: 314 },
  { d: 'M568 150 C648 150 648 99 716 99', label: 'sync', lx: 636, ly: 112 },
  { d: 'M568 210 L716 210', label: 'job-cost', lx: 624, ly: 200 },
  { d: 'M568 270 C648 270 648 323 716 323', label: 'events', lx: 632, ly: 302 },
  { d: 'M470 316 L470 348', warn: true, label: 'failures', lx: 480, ly: 338, anchor: 'start' },
]

export function Architecture() {
  return (
    <div className="space-y-6">
      {/* Architect's note — the POV, always visible for an unattended viewer */}
      <div className="sheen relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.10] via-base-850/55 to-base-850/45 p-5 shadow-glow">
        <div className="relative">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            <Network className="h-3.5 w-3.5" />
            Architect&apos;s note
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            The fastest, lowest-risk path here isn&apos;t a rip-and-replace. Keep Paychex,
            PenguinData, and QuickBooks as the systems of record and put one thin, governed
            integration layer between them — validating, mapping, de-duping, and auditing every
            change. Anything it can&apos;t resolve becomes a visible exception routed to a human,
            never a silent failure, and ingest-time guards keep the data clean so crews can&apos;t
            re-clutter it. If a custom platform ever beats that integration on ROI, it&apos;s a
            deliberate, measured call — not the default.
          </p>
        </div>
      </div>

      {/* Architecture POV + live data-flow diagram */}
      <Card>
        <SectionHeader
          title="Integration Architecture"
          subtitle="One source of truth per domain · a thin, governed integration layer · exceptions over silent failure"
          icon={<Network className="h-4 w-4" />}
        />

        {/* Systems of record */}
        <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {systemsOfRecord.map((s) => (
            <div key={s.system} className="rounded-xl border border-white/[0.07] bg-base-900/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{s.system}</span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {s.owns}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-400">{s.role}</p>
            </div>
          ))}
        </div>

        {/* Data-flow diagram */}
        <div
          data-tour="arch-diagram"
          className="overflow-x-auto rounded-xl border border-white/[0.06] bg-base-900/40 p-3"
        >
          <svg
            viewBox="0 0 920 440"
            className="w-full min-w-[680px]"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Data flow from Paychex and Google Drive through a governed integration and staging layer into PenguinData, QuickBooks, the command center, and an exception queue."
          >
            <defs>
              <marker id="arw" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L6 3 L0 6 z" fill="#38bdf8" />
              </marker>
              <marker id="arw-warn" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L6 3 L0 6 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Edges: faint base pipe + animated flowing dashes */}
            {edges.map((e, i) => (
              <g key={i}>
                <path d={e.d} fill="none" stroke={e.warn ? '#3a2f1a' : '#1c2840'} strokeWidth={4} />
                <path
                  d={e.d}
                  fill="none"
                  stroke={e.warn ? '#f59e0b' : '#38bdf8'}
                  strokeWidth={2}
                  className={e.warn ? 'flow-pipe-warn' : 'flow-pipe'}
                  markerEnd={e.warn ? 'url(#arw-warn)' : 'url(#arw)'}
                />
                <text
                  x={e.lx}
                  y={e.ly}
                  fontSize={10}
                  fill="#64748b"
                  textAnchor={e.anchor ?? 'middle'}
                >
                  {e.label}
                </text>
              </g>
            ))}

            {/* Paychex — source of truth */}
            <g>
              <rect x={44} y={66} width={176} height={66} rx={12} fill="#0f1729" stroke="#28374f" />
              <text x={62} y={94} fontSize={15} fontWeight={700} fill="#f1f5f9">Paychex</text>
              <text x={62} y={113} fontSize={10.5} fill="#94a3b8">People · workers & payroll</text>
              <rect x={44} y={48} width={120} height={18} rx={9} fill="#0b3a52" stroke="#38bdf8" strokeOpacity={0.4} />
              <text x={104} y={61} fontSize={9} fontWeight={700} fill="#7dd3fc" textAnchor="middle" letterSpacing="0.5">
                SOURCE OF TRUTH
              </text>
            </g>

            {/* Google Drive — legacy */}
            <g>
              <rect x={44} y={300} width={176} height={66} rx={12} fill="#0f1729" stroke="#28374f" />
              <text x={62} y={328} fontSize={15} fontWeight={700} fill="#f1f5f9">Google Drive</text>
              <text x={62} y={347} fontSize={10.5} fill="#94a3b8">Legacy documents</text>
            </g>

            {/* Integration & staging layer */}
            <g>
              <rect x={364} y={112} width={212} height={212} rx={16} fill="#38bdf8" fillOpacity={0.06} stroke="#38bdf8" strokeOpacity={0.35} />
              <text x={384} y={150} fontSize={14.5} fontWeight={700} fill="#e8f6ff">Integration &amp;</text>
              <text x={384} y={170} fontSize={14.5} fontWeight={700} fill="#e8f6ff">Staging Layer</text>
              {['Validate', 'Map & match', 'Dedupe', 'Audit log'].map((step, i) => (
                <g key={step}>
                  <circle cx={390} cy={203 + i * 27} r={3} fill="#38bdf8" />
                  <text x={402} y={207 + i * 27} fontSize={12} fill="#cbd5e1">{step}</text>
                </g>
              ))}
            </g>

            {/* Right column destinations */}
            {[
              { y: 70, title: 'PenguinData', sub: 'Operations · dispatch · fleet' },
              { y: 182, title: 'QuickBooks', sub: 'Finance · invoicing' },
              { y: 294, title: 'Command Center', sub: 'Executive visibility' },
            ].map((n) => (
              <g key={n.title}>
                <rect x={716} y={n.y} width={176} height={58} rx={12} fill="#0f1729" stroke="#28374f" />
                <text x={734} y={n.y + 26} fontSize={14} fontWeight={700} fill="#f1f5f9">{n.title}</text>
                <text x={734} y={n.y + 44} fontSize={10} fill="#94a3b8">{n.sub}</text>
              </g>
            ))}

            {/* Exception queue */}
            <g>
              <rect x={364} y={348} width={212} height={52} rx={12} fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeOpacity={0.4} />
              <text x={384} y={372} fontSize={13} fontWeight={700} fill="#fcd34d">Exception Queue</text>
              <text x={384} y={389} fontSize={10} fill="#d6b06a">Routed to a human · never silent</text>
            </g>
          </svg>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Systems of record stay in place. A thin integration layer validates, maps, de-dupes, and
          audits every change — and anything it can&apos;t resolve becomes a visible exception, not a
          silent failure.
        </p>
      </Card>

      {/* Automated pipelines */}
      <Card>
        <SectionHeader
          title="Automated Pipelines"
          subtitle="Webhook-, event-, and schedule-driven sync across the ecosystem"
          icon={<Workflow className="h-4 w-4" />}
        />
        <div className="space-y-2">
          {pipelineJobs.map((job) => {
            const meta = triggerMeta[job.trigger]
            const Icon = meta.Icon
            return (
              <div
                key={job.name}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-white/[0.06] bg-base-900/40 p-3"
              >
                {/* Identity + flow — flexes and truncates */}
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 ${meta.cls}`} />
                  <span className="shrink-0 text-sm font-semibold text-slate-100">{job.name}</span>
                  <span className="truncate font-mono text-[11px] text-slate-400">{job.flow}</span>
                </div>
                {/* Meta — wraps as one coherent group */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                    {meta.label} · {job.cadence}
                  </span>
                  <span className="hidden text-[11px] text-slate-500 sm:inline">{job.throughput}</span>
                  <span className="text-[11px] tabular text-slate-500">{job.lastRun}</span>
                  <StatusBadge tone={job.health} label={job.health} pulse={job.health === 'active'} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Governance guards */}
      <Card>
        <SectionHeader
          title="Automated Governance Guards"
          subtitle="Keeps the system clean by design — crews and office staff can't re-clutter it"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {governanceGuards.map((g) => (
            <div key={g.name} className="rounded-xl border border-white/[0.07] bg-base-900/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                  {g.scope === 'Identity' || g.scope === 'Drive' ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <p className="mt-2.5 text-sm font-semibold text-white">{g.name}</p>
              <p className="mt-1 text-xs leading-snug text-slate-400">Prevents {g.prevents}</p>
              <span className="mt-2.5 inline-block rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                {g.scope}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
