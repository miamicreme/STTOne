'use client'

import {
  Bot,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

const metrics = [
  { label: 'Employees Interviewed', value: '18 / 24', hint: '75% baseline coverage' },
  { label: 'Transcript Hours', value: '31.5', hint: 'Chat + voice discovery' },
  { label: 'Themes Extracted', value: '46', hint: 'Grouped by department' },
  { label: 'Risks Found', value: '17', hint: 'Ready for validation' },
]

const themes = [
  { topic: 'Duplicate data entry', mentions: 42, departments: 'Ops, HR, Finance', severity: 'High' },
  { topic: 'Spreadsheet dependency', mentions: 37, departments: 'Ops, Dispatch', severity: 'High' },
  { topic: 'Document search delays', mentions: 28, departments: 'Field, Admin', severity: 'Medium' },
  { topic: 'Manual reporting', mentions: 22, departments: 'Finance, Leadership', severity: 'High' },
]

const interviews = [
  {
    person: 'Operations Manager',
    status: 'Complete',
    signal: 'Dispatch Tracker is treated as source of truth even when PenguinData is more current.',
  },
  {
    person: 'HR Coordinator',
    status: 'Complete',
    signal: 'New hire data is emailed to Operations and manually re-keyed into PenguinData.',
  },
  {
    person: 'Accounting Lead',
    status: 'In review',
    signal: 'Friday job-cost report takes four hours and requires QuickBooks export cleanup.',
  },
]

const questions = [
  'Walk me through yesterday from start to finish.',
  'Which information must be correct before crews leave?',
  'Where do you enter the same information twice?',
  'Tell me about the last time a spreadsheet caused a problem.',
  'What report or task would you eliminate if you could?',
]

const insights = [
  {
    label: 'Finding',
    title: 'Dispatch data is duplicated outside PenguinData',
    body: 'Employee interviews point to address, schedule, crew assignment, permit status, and equipment as mission-critical fields that should have governed ownership.',
  },
  {
    label: 'Risk',
    title: 'Two-person spreadsheet knowledge dependency',
    body: 'The Dispatch Tracker has 80+ columns and only two employees understand the formulas well enough to change it safely.',
  },
  {
    label: 'Recommendation',
    title: 'Use AI interviews to focus live discovery',
    body: 'The assistant gathers consistent baseline evidence, then Kohron validates exceptions and complex workflows live with department leads.',
  },
]

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-lg shadow-black/20">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{hint}</p>
    </div>
  )
}

export function DiscoveryAssistant() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.18] via-base-850/80 to-base-900 p-6 shadow-glow sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <Bot className="h-3.5 w-3.5" /> Remote Assessment Module
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Discovery Assistant
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              A structured AI interview layer for remote assessments. Employees can chat or speak through their workflow, while the system extracts transcripts, pain points, systems, risks, and candidate automations for leadership review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-500/20">Baseline interviews</span>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-300 ring-1 ring-sky-500/20">Transcript analysis</span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300 ring-1 ring-violet-500/20">Executive themes</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-base-950/50 p-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <p className="text-sm font-semibold text-white">Employee chat preview</p>
                <p className="text-xs text-slate-500">Guided discovery · 24 minutes</p>
              </div>
              <div className="flex gap-2 text-slate-400">
                <MessageSquareText className="h-4 w-4" />
                <Mic className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="max-w-[85%] rounded-2xl bg-white/[0.06] px-4 py-3 text-slate-300">
                Walk me through yesterday from the time you started work until crews were dispatched.
              </div>
              <div className="ml-auto max-w-[86%] rounded-2xl bg-accent/15 px-4 py-3 text-slate-100 ring-1 ring-accent/20">
                I opened Outlook, PenguinData, and three Google Sheets. Then I compared the Dispatch Tracker against PenguinData before assigning crews.
              </div>
              <div className="max-w-[88%] rounded-2xl bg-white/[0.06] px-4 py-3 text-slate-300">
                Which fields create the biggest operational risk when they are wrong?
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Interview Script</h2>
              <p className="text-sm text-slate-500">Consistent questions with adaptive follow-ups.</p>
            </div>
          </div>
          <ol className="mt-5 space-y-3">
            {questions.map((q, idx) => (
              <li key={q} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-base-950/30 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{idx + 1}</span>
                <span className="text-sm leading-6 text-slate-300">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Top Extracted Themes</h2>
              <p className="text-sm text-slate-500">Aggregated from transcripts before live validation.</p>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Theme</th>
                  <th className="px-4 py-3">Mentions</th>
                  <th className="px-4 py-3">Departments</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {themes.map((t) => (
                  <tr key={t.topic} className="text-slate-300">
                    <td className="px-4 py-3 font-medium text-white">{t.topic}</td>
                    <td className="px-4 py-3 tabular-nums">{t.mentions}</td>
                    <td className="px-4 py-3">{t.departments}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/20">{t.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Transcript Review Queue</h2>
              <p className="text-sm text-slate-500">Kohron reviews and validates evidence before presenting findings.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {interviews.map((i) => (
              <div key={i.person} className="rounded-2xl border border-white/[0.06] bg-base-950/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-white">{i.person}</p>
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10">{i.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{i.signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Guardrails</h2>
              <p className="text-sm text-slate-500">Keeps the remote assessment safe.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="rounded-2xl bg-base-950/30 p-4">Read-only discovery first. No production changes during interview intake.</p>
            <p className="rounded-2xl bg-base-950/30 p-4">Employee responses are evidence, not final truth. Findings require live validation.</p>
            <p className="rounded-2xl bg-base-950/30 p-4">PII and sensitive finance details are flagged and minimized in executive summaries.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
            <Search className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Executive Findings Generated from Discovery</h2>
            <p className="text-sm text-slate-500">Designed to turn remote interviews into an assessment-ready knowledge base.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {insights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/[0.06] bg-base-950/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.label}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4 text-sm leading-6 text-slate-300">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p>
            Positioning: the assistant does not replace Kohron. It gathers consistent baseline information from every employee so Kohron can spend live sessions validating root causes, mapping exceptions, and turning findings into a credible 30/60/90-day roadmap.
          </p>
        </div>
      </section>
    </div>
  )
}
