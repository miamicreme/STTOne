'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileSearch,
  Mail,
  MapPin,
  PhoneCall,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'

import { Card, SectionHeader, Tag } from '../components/Card'
import { leadFinderKpis, sttLeadCandidates, type Priority } from '../leadFinderData'

const priorityStyles: Record<Priority, string> = {
  critical: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  high: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  medium: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold tabular text-white">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ExecutiveMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{hint}</p>
    </div>
  )
}

export function STTLeadFinder() {
  const [hasRun, setHasRun] = useState(false)
  const [selectedId, setSelectedId] = useState(sttLeadCandidates[0].id)

  const topLeads = useMemo(() => sttLeadCandidates.slice(0, 4), [])
  const selectedLead = topLeads.find((lead) => lead.id === selectedId) ?? topLeads[0]

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-base-850 via-base-900 to-base-950 shadow-inset">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_.85fr] lg:p-7">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Radar className="h-3.5 w-3.5" />
              Executive Growth Demo
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              One click to find STT's next best prospects.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400 md:text-base md:leading-7">
              This demo turns public signals into a simple executive answer: who STT should pursue,
              why they are a fit, and what leadership should do next.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['No spreadsheet hunting', 'Plain-English recommendations', 'Evidence-backed scores', 'Sales-ready next actions'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Card className="bg-base-950/50">
            <SectionHeader
              title="Lead Finder Scan"
              subtitle="Executive mode: scan, score, summarize, and recommend."
              icon={<Zap className="h-4 w-4" />}
            />
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Search strategy</p>
                <p className="mt-1 text-sm font-semibold text-white">Municipal · Utility · Broadband · Infrastructure</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Operating radius</p>
                <p className="mt-1 text-sm font-semibold text-white">Southwest Florida + expansion markets</p>
              </div>
              <button
                onClick={() => setHasRun(true)}
                className="group flex w-full items-center justify-between rounded-2xl border border-accent/30 bg-accent/18 px-5 py-4 text-left text-sm font-bold text-accent transition-all hover:bg-accent/25 hover:shadow-[0_0_28px_-16px_rgba(47,134,224,0.9)]"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  {hasRun ? 'Scan complete — view recommendations' : 'Find best STT leads'}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              {hasRun && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100/90">
                  <span className="font-semibold text-emerald-200">Done.</span> Found 38 qualified signals and ranked the top 4 executive opportunities.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {leadFinderKpis.map((kpi) => (
          <ExecutiveMetric key={kpi.label} label={kpi.label} value={kpi.value} hint={kpi.hint} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[.85fr_1.4fr]">
        <Card padded={false}>
          <div className="border-b border-white/[0.07] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <h3 className="font-display text-[15px] font-semibold text-slate-100">Executive shortlist</h3>
              </div>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">Top 4</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Ranked by fit, urgency, budget signal, and ease of executive outreach.
            </p>
          </div>
          <div className="space-y-2 p-4">
            {topLeads.map((lead, index) => {
              const active = selectedLead.id === lead.id
              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? 'border-accent/35 bg-accent/[0.09] shadow-[0_0_28px_-18px_rgba(47,134,224,0.9)]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">#{index + 1} recommended</p>
                      <p className="mt-1 truncate text-sm font-bold text-white">{lead.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {lead.location}
                      </p>
                    </div>
                    <div className="rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-center">
                      <p className="text-[9px] uppercase tracking-wide text-slate-500">Fit</p>
                      <p className="text-lg font-bold tabular text-accent">{lead.fitScore}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">{lead.trigger}</p>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Best next lead</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">{selectedLead.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{selectedLead.department} · {selectedLead.location}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${priorityStyles[selectedLead.priority]}`}>
                {selectedLead.priority} priority
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[.7fr_1.3fr]">
              <div className="space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <ScoreBar label="STT fit" value={selectedLead.fitScore} />
                <ScoreBar label="Urgency" value={selectedLead.urgencyScore} />
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Value hypothesis</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedLead.valueHypothesis}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/15 bg-accent/[0.06] p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Executive summary
                </p>
                <p className="text-sm leading-6 text-slate-300">
                  {selectedLead.sttAngle}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <SectionHeader title="What to do next" icon={<CheckCircle2 className="h-4 w-4" />} />
              <p className="text-sm leading-6 text-slate-300">{selectedLead.nextAction}</p>
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Contact path</p>
                <p className="mt-1 text-sm font-semibold text-white">{selectedLead.contactPath}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/30 hover:text-accent">
                  <Mail className="h-3.5 w-3.5" />
                  Draft email
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/30 hover:text-accent">
                  <PhoneCall className="h-3.5 w-3.5" />
                  Call script
                </button>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Why we trust it" icon={<ShieldCheck className="h-4 w-4" />} />
              <div className="space-y-3">
                {selectedLead.evidence.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{item.source}</p>
                      </div>
                      <span className="rounded-md bg-white/[0.05] px-2 py-1 text-xs font-bold tabular text-slate-300">
                        {item.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <SectionHeader title="How the one-click scan works" icon={<FileSearch className="h-4 w-4" />} />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['1', 'Scan public signals', 'Agendas, RFPs, grants, utility boards, and capital plans.'],
            ['2', 'Score best fits', 'Rank prospects by fit, urgency, budget, and relationship path.'],
            ['3', 'Explain the why', 'Show the executive reason, evidence, and confidence.'],
            ['4', 'Create action', 'Generate email, call script, and CRM-ready next step.'],
          ].map(([step, title, detail]) => (
            <div key={step} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-sm font-bold text-accent">
                {step}
              </div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-200">
            <BadgeCheck className="h-4 w-4" />
            Executive message
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            STT's internal data foundation can become an external growth engine. The same architecture that cleans up Drive,
            normalizes project data, and integrates systems can also identify better-fit prospects and support sales execution.
          </p>
        </div>
      </Card>
    </div>
  )
}
