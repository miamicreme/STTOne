'use client'

export function DiscoveryAssistant() {
  const steps = [
    ['1', 'Listen first', 'Talk with leadership, HR, dispatch, accounting, project leads, and field operations before recommending a system.'],
    ['2', 'Map the workflow', 'Trace one hire, one job, one invoice, one truck, and one document from start to finish.'],
    ['3', 'Find the breakpoints', 'Identify duplicate entry, weak ownership, manual reports, document sprawl, and silent handoff failures.'],
    ['4', 'Stabilize the data', 'Define sources of truth, validation gates, owner decisions, and the first controlled improvement.'],
  ]

  const questions = [
    ['Leadership', 'What decision do you need faster each week?'],
    ['HR / Payroll', 'Where do new hires, IDs, credentials, and payroll fields fall out of sync?'],
    ['Dispatch', 'Which bad data slows crews, trucks, or scheduling?'],
    ['Accounting', 'Which job-code or vendor mapping problems delay billing?'],
    ['Project Leads', 'Which report is rebuilt manually because systems do not agree?'],
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.12] via-base-850/60 to-base-850/40 p-5 shadow-glow">
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">How I work</p>
        <h1 className="mt-2 max-w-3xl font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          I understand the business before I design the system.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          This demo is not a product suite. It is a simple operating story: learn the business, map the workflow, govern the data, then automate what matters.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {steps.map(([num, title, body]) => (
          <div key={title} data-tour={num === '1' ? 'discovery-start' : undefined} className="rounded-2xl border border-white/[0.07] bg-base-850/55 p-5 shadow-inset">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-display text-sm font-bold text-accent">{num}</span>
            <p className="mt-4 text-sm font-semibold text-white">{title}</p>
            <p className="mt-2 text-xs leading-6 text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-base-850/55 p-5 shadow-inset">
          <h2 className="font-display text-[15px] font-semibold text-slate-100">Discovery interview map</h2>
          <p className="mt-0.5 text-xs text-slate-400">The first pass is operational, not technical.</p>
          <div className="mt-5 space-y-2">
            {questions.map(([role, question]) => (
              <div key={role} className="rounded-xl border border-white/[0.06] bg-base-900/40 p-3">
                <p className="text-[10px] uppercase tracking-wide text-accent">{role}</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-base-850/55 p-5 shadow-inset">
          <h2 className="font-display text-[15px] font-semibold text-slate-100">Output executives can use</h2>
          <p className="mt-0.5 text-xs text-slate-400">A practical blueprint before a major build.</p>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            <p className="rounded-xl border border-white/[0.06] bg-base-900/35 p-3"><span className="font-semibold text-white">Workflow map:</span> where each process starts, breaks, and changes owner.</p>
            <p className="rounded-xl border border-white/[0.06] bg-base-900/35 p-3"><span className="font-semibold text-white">Source-of-truth decisions:</span> which system owns people, operations, finance, documents, and exceptions.</p>
            <p className="rounded-xl border border-white/[0.06] bg-base-900/35 p-3"><span className="font-semibold text-white">First controlled wins:</span> low-risk improvements that prove value before deeper automation.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
