'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  Database,
  FileSearch,
  Filter,
  Landmark,
  Mail,
  MapPin,
  PhoneCall,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'

import { Card, CardHeader, SectionHeader, Tag } from '../components/Card'
import {
  leadFinderKpis,
  leadFinderPlaybook,
  leadFinderStages,
  searchSources,
  sttLeadCandidates,
  type Priority,
  type SttLeadType,
} from '../leadFinderData'

const leadTypes: Array<SttLeadType | 'All'> = [
  'All',
  'Municipal / Public Works',
  'Utility / Broadband',
  'Transportation / ITS',
  'Emergency Services',
]

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
        <span className="font-semibold tabular text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function MiniKpi({ label, value, delta, hint }: { label: string; value: string; delta: string; hint: string }) {
  return (
    <Card className="min-h-[126px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-accent">{delta}</p>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{hint}</p>
    </Card>
  )
}

export function STTLeadFinder() {
  const [leadType, setLeadType] = useState<SttLeadType | 'All'>('All')
  const [selectedId, setSelectedId] = useState(sttLeadCandidates[0].id)

  const filteredLeads = useMemo(() => {
    return leadType === 'All'
      ? sttLeadCandidates
      : sttLeadCandidates.filter((lead) => lead.type === leadType)
  }, [leadType])

  const selectedLead = filteredLeads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? sttLeadCandidates[0]

  const handleFilter = (type: SttLeadType | 'All') => {
    setLeadType(type)
    const nextLead = type === 'All' ? sttLeadCandidates[0] : sttLeadCandidates.find((lead) => lead.type === type)
    if (nextLead) setSelectedId(nextLead.id)
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-base-850 via-base-900 to-base-950 shadow-inset">
        <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_.8fr] lg:p-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Radar className="h-3.5 w-3.5" />
              STT Lead Finder Demo
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Public-signal lead intelligence for municipal, utility, and infrastructure prospects.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              A specialized growth module for Southern Tier Telecommunications: scan public buying signals,
              rank best-fit organizations, explain the opportunity, and hand sales leadership the next move.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Public records', 'RFPs', 'Council packets', 'Grant triggers', 'AI scoring', 'CRM-ready'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Card className="bg-base-950/50">
            <SectionHeader
              title="MVP scan configuration"
              subtitle="Demo mode: illustrative, no live network calls."
              icon={<Search className="h-4 w-4" />}
            />
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Industry focus</p>
                <p className="mt-1 text-sm font-semibold text-white">Municipal infrastructure + utilities</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Geography</p>
                <p className="mt-1 text-sm font-semibold text-white">Southwest Florida / STT operating radius</p>
              </div>
              <button className="group flex w-full items-center justify-between rounded-xl border border-accent/25 bg-accent/15 px-4 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20">
                Run simulated scan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {leadFinderKpis.map((kpi) => (
          <MiniKpi key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[.95fr_1.35fr]">
        <Card padded={false}>
          <CardHeader
            title="Ranked opportunities"
            icon={<Target className="h-4 w-4 text-accent" />}
            action={<span className="text-xs font-semibold text-slate-400">{filteredLeads.length} shown</span>}
            below={
              <div className="mt-4 flex flex-wrap gap-2">
                {leadTypes.map((type) => {
                  const active = leadType === type
                  return (
                    <button
                      key={type}
                      onClick={() => handleFilter(type)}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                        active
                          ? 'border-accent/40 bg-accent/15 text-accent'
                          : 'border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            }
          />
          <div className="space-y-2 p-4">
            {filteredLeads.map((lead) => {
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
                      <p className="truncate text-sm font-bold text-white">{lead.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {lead.location} · {lead.department}
                      </p>
                    </div>
                    <span className="rounded-lg border border-accent/25 bg-accent/10 px-2 py-1 text-xs font-bold tabular text-accent">
                      {lead.fitScore}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">{lead.trigger}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[lead.priority]}`}>
                      {lead.priority}
                    </span>
                    {lead.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Selected lead</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">{selectedLead.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{selectedLead.type} · {selectedLead.location}</p>
              </div>
              <div className="rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Fit score</p>
                <p className="font-display text-3xl font-bold text-accent">{selectedLead.fitScore}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <ScoreBar label="STT fit" value={selectedLead.fitScore} />
                <ScoreBar label="Urgency" value={selectedLead.urgencyScore} />
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Budget signal</p>
                  <p className="mt-2 text-sm font-medium text-white">{selectedLead.budgetSignal}</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-accent" />
                  AI lead thesis
                </p>
                <p className="text-sm leading-6 text-slate-400">{selectedLead.sttAngle}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <SectionHeader title="Recommended next action" icon={<Workflow className="h-4 w-4" />} />
              <p className="text-sm leading-6 text-slate-300">{selectedLead.nextAction}</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Contact path</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedLead.contactPath}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Value hypothesis</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedLead.valueHypothesis}</p>
                </div>
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
              <SectionHeader title="Evidence and confidence" icon={<ShieldCheck className="h-4 w-4" />} />
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

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card padded={false}>
          <CardHeader title="Source pipeline" icon={<Database className="h-4 w-4 text-accent" />} />
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {searchSources.map((source) => (
              <div key={source.name} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <FileSearch className="h-4 w-4 text-slate-500" />
                  {source.name}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{source.coverage}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{source.signal}</span>
                  <span>{source.cadence}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padded={false}>
          <CardHeader title="Lead pipeline" icon={<Filter className="h-4 w-4 text-accent" />} />
          <div className="space-y-3 p-4">
            {leadFinderStages.map((stage, index) => (
              <div key={stage.stage} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-sm font-bold text-accent">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{stage.stage}</p>
                  <p className="text-xs text-slate-500">{stage.detail}</p>
                </div>
                <span className="text-lg font-bold tabular text-white">{stage.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="What this proves to STT leadership" icon={<Bot className="h-4 w-4" />} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {leadFinderPlaybook.map((item, index) => (
            <div key={item} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-sm font-bold text-accent">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-200">
            <BadgeCheck className="h-4 w-4" />
            Demo message
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            STT's internal data foundation can become an external growth engine: the same architecture that cleans up
            Drive, normalizes project data, and integrates systems can also identify better-fit prospects and support
            sales execution.
          </p>
        </div>
      </Card>
    </div>
  )
}
