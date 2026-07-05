'use client'

import { ClipboardCheck, MessageSquareText, Route, SearchCheck, ShieldCheck } from 'lucide-react'
import { Card, SectionHeader, Tag } from '../components/Card'

const discoverySteps = [
  {
    title: 'Listen to the operators',
    system: 'People first',
    detail: 'Start with leadership, HR, dispatch, field ops, accounting, and project leads before prescribing software.',
  },
  {
    title: 'Map the real workflow',
    system: 'Process map',
    detail: 'Trace one hire, one job, one invoice, one truck, and one document from start to finish.',
  },
  {
    title: 'Find the breakpoints',
    system: 'Risk model',
    detail: 'Identify where records duplicate, job codes drift, documents sprawl, and exceptions disappear.',
  },
  {
    title: 'Stabilize before scaling',
    system: 'Control layer',
    detail: 'Create source-of-truth rules, validation gates, and a visible exception queue before deeper automation.',
  },
]

const interviewMap = [
  ['Leadership', 'What decision do you need faster each week?'],
  ['HR / Payroll', 'Where do new hires, IDs, credentials, and payroll fields fall out of sync?'],
  ['Dispatch / Field Ops', 'Where does bad data slow crews, trucks, or scheduling?'],
  ['Accounting', 'Which job-code or vendor mapping problems delay billing?'],
  ['Project Leads', 'Which reports are rebuilt manually because systems do not agree?'],
]

export function DiscoveryMap() {
  return (
    <div className="space-y-5">
      <div className="edge-accent sheen rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.12] via-base-850/60 to-base-850/40 p-5 shadow-glow">
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">How I work</p>
        <h2 className="mt-2 max-w-3xl font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          I understand the business before I design the system.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          The goal is not to build another disconnected tool. The goal is to learn how SouthernTier
          actually operates, identify where data breaks, and then design the smallest governed layer
          that gives leadership visibility and gives employees a cleaner workflow.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {discoverySteps.map((step, index) => (
          <Card key={step.title} hover tourId={index === 0 ? 'discovery-start' : undefined}>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-display text-sm font-bold text-accent">
                {index + 1}
              </span>
              <Tag>{step.system}</Tag>
            </div>
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="mt-2 text-xs leading-6 text-slate-400">{step.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <Card>
          <SectionHeader
            title="Discovery interview map"
            subtitle="The first pass is operational, not technical"
            icon={<MessageSquareText className="h-4 w-4" />}
          />
          <div className="space-y-2">
            {interviewMap.map(([role, question]) => (
              <div key={role} className="rounded-xl border border-white/[0.06] bg-base-900/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag>{role}</Tag>
                  <span className="text-sm font-medium text-slate-100">{question}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="What comes out of discovery"
            subtitle="A practical blueprint executives can use"
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <Outcome icon={<Route className="h-4 w-4" />} title="Current-state workflow map" body="Where each process starts, where it breaks, and who owns each handoff." />
            <Outcome icon={<SearchCheck className="h-4 w-4" />} title="Source-of-truth decisions" body="Which system owns people, operations, finance, documents, and exceptions." />
            <Outcome icon={<ShieldCheck className="h-4 w-4" />} title="First controlled wins" body="A short list of low-risk improvements that prove value before a bigger build." />
          </div>
        </Card>
      </div>
    </div>
  )
}

function Outcome({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">{body}</p>
      </div>
    </div>
  )
}
