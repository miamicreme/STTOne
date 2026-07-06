'use client'

import { ArrowRight, CheckCircle2, ClipboardList, Laptop, Map, Network, ShieldCheck } from 'lucide-react'
import { Card, SectionHeader, Tag } from '../components/Card'
import { useApp } from '../state/AppContext'

const roadmap = [
  {
    phase: 'Days 1–30',
    title: 'Discover and baseline',
    outcome: 'Understand the business before recommending change.',
    bullets: [
      'Meet with leadership, HR, operations, dispatch, finance, project leads, and field users.',
      'Map how Paychex, PenguinData, QuickBooks, and Google Drive are used today.',
      'Identify duplicate entry, spreadsheet dependency, job-code issues, permissions, and reporting pain.',
      'Deliver a current-state brief, risk list, and first quick-win recommendations.',
    ],
  },
  {
    phase: 'Days 31–60',
    title: 'Govern and stabilize',
    outcome: 'Define ownership and stop silent data failures.',
    bullets: [
      'Confirm sources of truth: Paychex for people, PenguinData for operations, QuickBooks for finance, Drive as legacy document source.',
      'Create source-of-truth rules, validation checks, exception categories, and approval paths.',
      'Prototype the first governed workflow with an audit trail and clear owner handoffs.',
      'Deliver controlled improvements that reduce manual rework without unsafe production changes.',
    ],
  },
  {
    phase: 'Days 61–90',
    title: 'Visibility and implementation path',
    outcome: 'Prepare SouthernTier for Power BI, automation, and AI readiness.',
    bullets: [
      'Finalize the future-state integration layer plan and phased implementation sequence.',
      'Define executive dashboards across operations, finance, fleet, hiring, projects, and customer KPIs.',
      'Document security, access, audit, backup, and change-management requirements.',
      'Present the long-term roadmap and recommend the right ownership model for implementation.',
    ],
  },
]

const commitments = [
  {
    title: 'Commercial structure follows scope',
    body: 'Start with a defined assessment and roadmap phase. The deeper implementation model can be decided after discovery shows the true level of ownership needed.',
    icon: ClipboardList,
  },
  {
    title: 'Read-only discovery first',
    body: 'Early work stays observational and controlled. Nothing touches production without approval, governance, and a clear reason.',
    icon: ShieldCheck,
  },
  {
    title: 'Secure working environment',
    body: 'Company-managed equipment and accounts keep payroll, finance, personnel, and operational data separate, auditable, and secure.',
    icon: Laptop,
  },
]

const scopeAdditions = [
  'Data governance',
  'Business process mapping',
  'One governed integration layer',
  'Executive dashboards',
  'Power BI readiness',
  'AI readiness',
  'Security by default',
  'Documentation throughout',
]

const demoSteps = [
  { page: 'home' as const, label: 'Executive Brief', body: 'The business case and modeled leakage.' },
  { page: 'discovery' as const, label: 'Discovery Map', body: 'How I learn the business before building.' },
  { page: 'architecture' as const, label: 'Operating Model', body: 'The governed layer between existing systems.' },
  { page: 'integration' as const, label: 'Exception Command Center', body: 'How mismatches become visible work.' },
]

export function CEOBoardView() {
  const { setPage, startTour } = useApp()

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.16] via-base-850/70 to-base-900/80 p-6 shadow-glow md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">90-day execution plan</p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              The first phase is simple: understand the business, govern the data, then make the roadmap real.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              This page closes the proposal without clutter. It shows how the engagement starts, what SouthernTier receives in the first 90 days, and how the prototype demonstrates the approach behind the response.
            </p>
          </div>
          <button
            onClick={startTour}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.75)] transition-all hover:brightness-110 sm:w-auto"
          >
            Walk the demo path <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {roadmap.map((phase) => (
          <Card key={phase.phase} className="flex flex-col">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <Tag>{phase.phase}</Tag>
                <h2 className="mt-3 font-display text-xl font-bold text-white">{phase.title}</h2>
              </div>
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <p className="rounded-xl border border-accent/20 bg-accent/[0.06] p-3 text-sm font-medium leading-6 text-slate-200">
              {phase.outcome}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
              {phase.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeader
            title="What leadership should take away"
            subtitle="The response is not a list of features. It is a controlled operating approach."
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <div className="space-y-3">
            {commitments.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Scope built into the foundation"
            subtitle="These are the disciplines that prevent a cleanup from becoming another temporary patch."
            icon={<Network className="h-4 w-4" />}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {scopeAdditions.map((item) => (
              <div key={item} className="rounded-xl border border-white/[0.06] bg-base-900/40 p-3 text-sm font-medium text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          <SectionHeader
            title="Demo path for leadership"
            subtitle="A clean route through the prototype"
            icon={<Map className="h-4 w-4" />}
          />
          <div className="space-y-2">
            {demoSteps.map((step, index) => (
              <button
                key={step.label}
                onClick={() => setPage(step.page)}
                className="group flex w-full gap-3 rounded-xl border border-white/[0.06] bg-base-900/35 p-3 text-left transition-colors hover:border-accent/30 hover:bg-accent/[0.06]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-accent">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">{step.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-400">{step.body}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Close message"
            subtitle="What this page is meant to communicate"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <p className="text-sm leading-7 text-slate-300">
            SouthernTier does not need another disconnected tool. The first phase should produce a clear operating map, source-of-truth decisions, governed exceptions, security expectations, measurable early wins, and a practical implementation path. The demo exists to make that thinking visible before the engagement begins.
          </p>
        </Card>
      </section>
    </div>
  )
}
