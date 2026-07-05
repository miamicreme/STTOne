'use client'

import { useApp } from '../state/AppContext'
import type { PageKey } from '../data'

const legacyPages: { page: PageKey; title: string; note: string }[] = [
  { page: 'lead-finder', title: 'STT Lead Finder', note: 'Market and opportunity exploration from the larger prototype.' },
  { page: 'newhire', title: 'New Hire Automation', note: 'Paychex to PenguinData onboarding walkthrough.' },
  { page: 'drive', title: 'Drive Cleanup Center', note: 'Google Drive classification, duplication, and permission cleanup.' },
  { page: 'fleet', title: 'Field Ops / Fleet', note: 'Fleet readiness, maintenance, and crew visibility.' },
  { page: 'projects', title: 'Project Portfolio', note: 'Project-level execution detail and operational status.' },
  { page: 'portal', title: 'Employee Portal', note: 'Field technician view of schedule, truck, certs, and documents.' },
  { page: 'project-status', title: 'Project Status', note: 'Engagement status board and weekly update view.' },
]

export function LegacyDemo() {
  const { setPage } = useApp()

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/[0.07] bg-base-850/55 p-6 shadow-inset">
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-slate-500">Archive</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">Old full demo</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          The main navigation now tells the cleaner executive story. These are the earlier prototype modules kept available for review, but separated so they do not clutter the executive walkthrough.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {legacyPages.map((item) => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className="rounded-2xl border border-white/[0.07] bg-base-850/55 p-5 text-left shadow-inset transition-colors hover:border-accent/30 hover:bg-accent/[0.06]"
          >
            <p className="font-display text-base font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
          </button>
        ))}
      </section>
    </div>
  )
}
