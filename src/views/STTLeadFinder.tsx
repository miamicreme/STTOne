'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Mail,
  MapPin,
  PhoneCall,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'

import { Card, SectionHeader } from '../components/Card'
import { leadFinderKpis, sttLeadCandidates, type Priority } from '../leadFinderData'

const priorityStyles: Record<Priority, string> = {
  critical: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  high: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  medium: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
}

type ArtifactType = 'summary' | 'email' | 'call' | 'brief'
type CrmStage = 'Not scanned' | 'Scanned' | 'Qualified' | 'CRM ready'

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

function generateArtifact(type: ArtifactType, lead: (typeof sttLeadCandidates)[number]) {
  if (type === 'email') {
    return {
      title: 'Mock outreach email',
      body: `Subject: Infrastructure operations visibility conversation\n\nHi ${lead.department} team,\n\nSouthern Tier Telecommunications is working with infrastructure and field operations teams that need cleaner visibility across projects, field documentation, closeout evidence, and executive reporting.\n\nBased on the public signals around ${lead.name}, there may be an opportunity to reduce manual coordination and improve operational visibility without adding another disconnected spreadsheet process.\n\nWould it make sense to schedule a short discovery conversation next week to compare your current workflow against a simple field-to-office reporting model?\n\nBest,\nSouthern Tier Telecommunications`,
    }
  }

  if (type === 'call') {
    return {
      title: 'Mock call script',
      body: `Opening: "We're local infrastructure operators looking for teams that need better field-to-office visibility."\n\nReason for call: ${lead.trigger}\n\nDiscovery question 1: How are field updates, closeout photos, and project exceptions currently getting back to leadership?\n\nDiscovery question 2: Where do projects slow down today — documentation, approvals, crew visibility, reporting, or contractor coordination?\n\nSTT angle: ${lead.sttAngle}\n\nClose: "Would a 20-minute workflow review be useful if we came prepared with a simple visibility model?"`,
    }
  }

  if (type === 'brief') {
    return {
      title: 'Executive lead brief',
      body: `Lead: ${lead.name}\nLocation: ${lead.location}\nDepartment: ${lead.department}\nPriority: ${lead.priority.toUpperCase()}\nFit Score: ${lead.fitScore}/100\nUrgency Score: ${lead.urgencyScore}/100\n\nWhy this matters:\n${lead.sttAngle}\n\nNeed detected:\n${lead.need}\n\nRecommended next action:\n${lead.nextAction}\n\nContact path:\n${lead.contactPath}\n\nValue hypothesis:\n${lead.valueHypothesis}\n\nEvidence:\n${lead.evidence.map((item) => `- ${item.label} (${item.confidence}% confidence)`).join('\n')}`,
    }
  }

  return {
    title: 'Executive summary',
    body: `${lead.name} is the strongest mock opportunity in this scan. ${lead.trigger}\n\nThe system recommends a relationship-first approach focused on operational visibility, field documentation, project closeout, and executive reporting.\n\nBest next move: ${lead.nextAction}`,
  }
}

export function STTLeadFinder() {
  const [hasRun, setHasRun] = useState(false)
  const [selectedId, setSelectedId] = useState(sttLeadCandidates[0].id)
  const [artifactType, setArtifactType] = useState<ArtifactType>('summary')
  const [crmStage, setCrmStage] = useState<CrmStage>('Not scanned')

  const topLeads = useMemo(() => sttLeadCandidates.slice(0, 4), [])
  const selectedLead = topLeads.find((lead) => lead.id === selectedId) ?? topLeads[0]
  const artifact = generateArtifact(artifactType, selectedLead)

  const runScan = () => {
    setHasRun(true)
    setCrmStage('Scanned')
    setArtifactType('summary')
  }

  const resetDemo = () => {
    setHasRun(false)
    setCrmStage('Not scanned')
    setSelectedId(sttLeadCandidates[0].id)
    setArtifactType('summary')
  }

  const selectLead = (id: string) => {
    setSelectedId(id)
    if (hasRun) setArtifactType('summary')
  }

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
              This mock demo turns public signals into a simple executive answer: who STT should pursue,
              why they are a fit, what leadership should do next, and what outreach should say.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['One-click scan', 'Mock data only', 'Plain-English recommendations', 'Sales-ready next actions'].map((tag) => (
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
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">CRM status</p>
                <p className="mt-1 text-sm font-semibold text-white">{crmStage}</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <button
                  onClick={runScan}
                  className="group flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/18 px-5 py-4 text-left text-sm font-bold text-accent transition-all hover:bg-accent/25 hover:shadow-[0_0_28px_-16px_rgba(47,134,224,0.9)]"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    {hasRun ? 'Run scan again' : 'Find best STT leads'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={resetDemo}
                  title="Reset mock demo"
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-slate-400 transition-colors hover:border-white/[0.16] hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              {hasRun && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100/90">
                  <span className="font-semibold text-emerald-200">Done.</span> Found 38 qualified mock signals and ranked the top 4 executive opportunities.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {hasRun ? (
        <>
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
                  Click any lead to update the summary, outreach, call script, and executive brief.
                </p>
              </div>
              <div className="space-y-2 p-4">
                {topLeads.map((lead, index) => {
                  const active = selectedLead.id === lead.id
                  return (
                    <button
                      key={lead.id}
                      onClick={() => selectLead(lead.id)}
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
                    <p className="text-sm leading-6 text-slate-300">{selectedLead.sttAngle}</p>
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
                    <button
                      onClick={() => setArtifactType('email')}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/30 hover:text-accent"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Draft email
                    </button>
                    <button
                      onClick={() => setArtifactType('call')}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/30 hover:text-accent"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      Call script
                    </button>
                    <button
                      onClick={() => setArtifactType('brief')}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-accent/30 hover:text-accent"
                    >
                      <ClipboardList className="h-3.5 w-3.5" />
                      Create executive brief
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCrmStage('Qualified')}
                      className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/15"
                    >
                      Mark qualified
                    </button>
                    <button
                      onClick={() => setCrmStage('CRM ready')}
                      className="rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/15"
                    >
                      Send to CRM
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

          <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <Card>
              <SectionHeader title={artifact.title} icon={<FileSearch className="h-4 w-4" />} />
              <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-base-950/60 p-4 text-xs leading-6 text-slate-300">
                {artifact.body}
              </pre>
            </Card>

            <Card>
              <SectionHeader title="Mock workflow status" icon={<BadgeCheck className="h-4 w-4" />} />
              <div className="space-y-3">
                {[
                  ['Scan public signals', true],
                  ['Rank executive shortlist', hasRun],
                  ['Generate outreach asset', artifactType !== 'summary'],
                  ['Qualify lead', crmStage === 'Qualified' || crmStage === 'CRM ready'],
                  ['Send to CRM', crmStage === 'CRM ready'],
                ].map(([label, complete]) => (
                  <div key={String(label)} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${complete ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <p className={complete ? 'text-sm font-semibold text-white' : 'text-sm text-slate-500'}>{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <SectionHeader title="Ready for one-click demo" icon={<Target className="h-4 w-4" />} />
          <p className="text-sm leading-6 text-slate-400">
            Click <span className="font-semibold text-accent">Find best STT leads</span> to populate the dashboard with mock leads,
            recommended actions, generated outreach, evidence, and CRM status. No live network calls are made.
          </p>
        </Card>
      )}
    </div>
  )
}
