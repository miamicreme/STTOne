'use client'

import { ArrowRight, CheckCircle2, ClipboardList, DollarSign, Laptop, Map, Network, ShieldCheck, UserCheck } from 'lucide-react'
import { Card, SectionHeader, Tag } from '../components/Card'
import { useApp } from '../state/AppContext'

const answerCards = [
  {
    question: 'Rate and structure',
    answer: '$15K–$25K fixed-fee assessment and roadmap, depending on final scope and timeline. Ongoing work can become phased implementation, contract-to-hire, or a long-term leadership role after discovery.',
    icon: DollarSign,
  },
  {
    question: 'Fixed-fee vs. hourly',
    answer: 'Fixed-fee for the first defined phase so cost is predictable and delivery risk stays on me. Hourly only where the scope is genuinely open-ended.',
    icon: ClipboardList,
  },
  {
    question: 'Availability',
    answer: 'I can begin promptly after the engagement agreement, onboarding, and required access are complete.',
    icon: CheckCircle2,
  },
  {
    question: 'Similar work',
    answer: '18+ years across enterprise systems, SQL Server, .NET, ETL, modern TypeScript systems, integration, automation, and owner-operated technology businesses. The working prototype is the clearest evidence.',
    icon: UserCheck,
  },
  {
    question: 'References',
    answer: 'Recent work has been through businesses I own and operate, so I am demonstrating the approach through the prototype, architecture, and implementation materials, with a direct executive walkthrough.',
    icon: ShieldCheck,
  },
  {
    question: 'What I need from STT',
    answer: 'Read-only access first, time with the people who use the systems, one executive sponsor, one access/approval contact, and company-managed equipment and accounts for security.',
    icon: Laptop,
  },
]

const roadmap = [
  {
    phase: 'Days 1–30',
    title: 'Discover and baseline',
    outcome: 'Understand the business before recommending change.',
    bullets: [
      'Interview leadership, HR, operations, dispatch, finance, project leads, and field users.',
      'Map how Paychex, PenguinData, QuickBooks, and Google Drive are used today.',
      'Identify duplicate entry, spreadsheet dependency, job-code issues, permissions, and reporting pain.',
      'Deliver an executive current-state brief and prioritized risk/opportunity list.',
    ],
  },
  {
    phase: 'Days 31–60',
    title: 'Govern and stabilize',
    outcome: 'Define ownership and stop silent data failures.',
    bullets: [
      'Confirm systems of record: Paychex for people, PenguinData for operations, QuickBooks for finance, Drive as legacy document source.',
      'Create source-of-truth rules, validation checks, and exception categories.',
      'Build the first governed workflow prototype with audit trail and owner handoffs.',
      'Deliver quick wins that reduce manual rework without touching production unsafely.',
    ],
  },
  {
    phase: 'Days 61–90',
    title: 'Roadmap and executive visibility',
    outcome: 'Prepare the company for Power BI, automation, and AI readiness.',
    bullets: [
      'Finalize the future-state integration layer plan and implementation sequence.',
      'Define executive dashboards across operations, finance, fleet, hiring, projects, and customer KPIs.',
      'Document security, access, audit, backup, and change-management requirements.',
      'Present the long-term implementation roadmap and recommended role structure.',
    ],
  },
]

const demoSteps = [
  { page: 'home' as const, label: 'Executive Brief', body: 'Start with the business case and modeled leakage.' },
  { page: 'discovery' as const, label: 'Discovery Map', body: 'Show how I learn the business before building.' },
  { page: 'architecture' as const, label: 'Operating Model', body: 'Show the governed layer between existing systems.' },
  { page: 'integration' as const, label: 'Exception Command Center', body: 'Show how mismatches become visible work.' },
]

export function CEOBoardView() {
  const { setPage, startTour } = useApp()

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.16] via-base-850/70 to-base-900/80 p-6 shadow-glow md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">Leadership email response</p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Here is the direct answer, the 90-day plan, and the demo path that proves the approach.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              The assignment is bigger than organizing Google Drive. The response is a defined assessment, a governed operating model, and a practical path toward trusted reporting, Power BI, automation, and AI readiness.
            </p>
          </div>
          <button
            onClick={startTour}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,134,224,0.75)] transition-all hover:brightness-110 sm:w-auto"
          >
            Walk the executive demo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {answerCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.question} hover>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="font-display text-sm font-semibold text-white">{card.question}</h2>
              </div>
              <p className="text-sm leading-6 text-slate-400">{card.answer}</p>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <SectionHeader
            title="Recommended additions to scope"
            subtitle="The difference between a cleanup and a scalable foundation"
            icon={<Network className="h-4 w-4" />}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Data governance',
              'Business process mapping',
              'One governed integration layer',
              'Executive dashboards',
              'AI readiness',
              'Security by default',
              'Documentation throughout',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/[0.06] bg-base-900/40 p-3 text-sm font-medium text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Demo path for leadership"
            subtitle="Use this route to understand the proposal quickly"
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
      </section>

      <section className="space-y-4" data-tour="risk">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">90-day execution plan</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Clear phases, clear deliverables, no vague roadmap.</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {roadmap.map((phase) => (
            <Card key={phase.phase} className="flex flex-col">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <Tag>{phase.phase}</Tag>
                  <h3 className="mt-3 font-display text-lg font-bold text-white">{phase.title}</h3>
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
        </div>
      </section>
    </div>
  )
}
