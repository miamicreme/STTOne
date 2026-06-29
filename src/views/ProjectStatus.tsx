// src/views/ProjectStatus.tsx
// Executive engagement status board — dark command-center theme, two-column desktop,
// single-column mobile. Edit the DATA block weekly; nothing else needs to change.
// Illustrative until the engagement begins on-site.

import { useEffect, useState } from 'react'

/* ================================================================== */
/*  DATA — update these objects each week                             */
/* ================================================================== */

type Rag = 'On Track' | 'At Risk' | 'Blocked'

const BRIEFING = {
  status: 'On Track' as Rag,
  confidence: 'High',
  phase: 'Phase 1 of 3 · Baseline',
  week: 'Week 2',
  day: 9,
  totalDays: 90,
  updated: 'June 27, 2026',
  headline:
    'Discovery is ahead of schedule. The integration layer already caught its first duplicate before it reached payroll. On track for the Day 30 baseline.',
  nextMilestone: 'Day 30 — Baseline & first savings estimate',
  nextMilestoneDay: 30,
}

const NEXT_OUTCOMES = [
  'A baseline report leadership can trust',
  'One agreed source of truth for every number',
  'The first estimate of avoidable cost',
]

const EXCEPTIONS = [
  {
    severity: 'Caught & handled',
    title: 'Duplicate employee record',
    summary: 'Same field tech, two different IDs across Paychex and PenguinData.',
    impact: 'No payroll impact — caught and quarantined before sync.',
    detail:
      'The integration layer flagged a name + SSN-tail match with mismatched employee IDs. The record was held in the exception queue instead of being written through, so dispatch and payroll were never affected.',
    action: 'Needs you to confirm which ID is the correct one.',
    when: 'Today · 9:12 AM',
  },
]

type MState = 'done' | 'current' | 'upcoming'
const MILESTONES: { day: string; title: string; desc: string; state: MState }[] = [
  { day: 'Day 30', title: 'Baseline', desc: 'Know where you stand — and what the disconnect costs today.', state: 'current' },
  { day: 'Day 60', title: 'Connected', desc: 'Systems share data automatically; live leadership reporting.', state: 'upcoming' },
  { day: 'Day 90', title: 'Governed', desc: 'Cleaned up, locked down, and built to stay that way.', state: 'upcoming' },
]

const DECISIONS: { item: string; due: string }[] = [
  { item: 'Confirm Paychex as the official source of employee data', due: 'Day 12' },
  { item: 'Name one person to approve data cleanup', due: 'Day 12' },
  { item: 'Resolve the duplicate-record exception', due: 'This week' },
]

type Kind = 'win' | 'exception' | 'info' | 'decision'
const UPDATES: { when: string; kind: Kind; text: string }[] = [
  { when: 'Today · 9:12 AM', kind: 'exception', text: 'Caught a duplicate employee record before it reached payroll. Quarantined and flagged for review.' },
  { when: 'Yesterday', kind: 'win', text: 'Finished the top-level Google Drive inventory — a decade of files sorted into six categories, sensitive folders flagged.' },
  { when: 'Jun 25', kind: 'info', text: 'Mapped the real hire → field → fleet → billing workflow with dispatch and HR.' },
  { when: 'Jun 24', kind: 'decision', text: 'Recommended Paychex as the employee source of truth — awaiting leadership sign-off.' },
  { when: 'Jun 23', kind: 'win', text: 'Read-only access confirmed to Paychex, PenguinData, and QuickBooks. No production changes.' },
]

const PROTOCOL = [
  { label: 'Capturing system snapshot', sub: 'Freezing current state across Paychex, PenguinData, QuickBooks, and the integration layer.' },
  { label: 'Pausing affected integrations', sub: 'Holding writes in read-only so nothing changes while we look.' },
  { label: 'Contacting Kohron', sub: 'Placing a call and sending an SMS with the snapshot link.' },
  { label: 'Kohron acknowledged', sub: 'Calling you back now.' },
]
const WHILE_YOU_WAIT = [
  'Keep this screen open — Kohron is calling you back now.',
  'No action needed from you. Affected systems are already paused safely.',
  'Payroll, dispatch, and billing are unaffected.',
  'Please hold any new changes until we\'ve spoken.',
]
const DIRECT_LINE = '(305) 555-0142'

/* ================================================================== */
/*  Style maps                                                        */
/* ================================================================== */

const rag: Record<Rag, { dot: string; text: string; heroBg: string; heroRing: string; bar: string; badge: string }> = {
  'On Track': {
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    heroBg: 'from-emerald-950/60 via-base-850/70 to-base-900/80',
    heroRing: 'ring-emerald-500/20',
    bar: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
  },
  'At Risk': {
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    heroBg: 'from-amber-950/60 via-base-850/70 to-base-900/80',
    heroRing: 'ring-amber-500/20',
    bar: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/25',
  },
  Blocked: {
    dot: 'bg-rose-400',
    text: 'text-rose-300',
    heroBg: 'from-rose-950/60 via-base-850/70 to-base-900/80',
    heroRing: 'ring-rose-500/20',
    bar: 'bg-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/25',
  },
}

const kindConfig: Record<Kind, { dot: string; label: string; labelColor: string }> = {
  win:      { dot: 'bg-emerald-400', label: 'Progress',  labelColor: 'text-emerald-400' },
  exception:{ dot: 'bg-amber-400',   label: 'Exception', labelColor: 'text-amber-400' },
  info:     { dot: 'bg-sky-400',     label: 'Update',    labelColor: 'text-sky-400' },
  decision: { dot: 'bg-violet-400',  label: 'Decision',  labelColor: 'text-violet-400' },
}

/* ================================================================== */
/*  Inline SVG icons                                                  */
/* ================================================================== */

const ShieldIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.69 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.96a2 2 0 0 1 2.11-.45c.74.33 1.53.56 2.34.69A2 2 0 0 1 22 16.92z" />
  </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/* ================================================================== */
/*  Emergency panel                                                   */
/* ================================================================== */

function EmergencyPanel({ onClose, isLoggedIn }: { onClose: () => void; isLoggedIn: boolean }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready')
  const [step, setStep] = useState(0)
  const [gate, setGate] = useState(false)

  useEffect(() => {
    if (phase !== 'running') return
    if (step >= PROTOCOL.length) { setPhase('done'); return }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : 1100)
    return () => clearTimeout(t)
  }, [phase, step])

  const run = () => { setPhase('running'); setStep(0) }
  const trigger = () => (isLoggedIn ? run() : setGate(true))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-base-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-base-850 shadow-2xl sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-[15px] font-bold text-white">Emergency protocol</div>
                <div className="text-xs text-slate-400">Snapshot · contain · contact Kohron</div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <XIcon />
            </button>
          </div>

          {phase === 'ready' && (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-relaxed text-slate-300">
                This captures a full system snapshot, pauses affected integrations in read-only, and contacts Kohron immediately — keeping you posted until he calls back.
              </p>
              <button
                onClick={trigger}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-400 active:scale-[0.98]"
              >
                <ShieldIcon className="h-4 w-4" />
                Trigger emergency snapshot
              </button>
              <p className="text-center text-xs text-slate-500">Sign-in required to trigger a live action.</p>
              {gate && (
                <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-300">
                  Sign in to trigger this. It captures a snapshot and calls Kohron immediately.
                </p>
              )}
              <button
                onClick={run}
                className="w-full text-center text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
              >
                Preview the protocol without triggering →
              </button>
            </div>
          )}

          {phase !== 'ready' && (
            <div className="mt-5 space-y-4">
              <ol className="space-y-3">
                {PROTOCOL.map((p, i) => {
                  const done = i < step || phase === 'done'
                  const active = i === step && phase === 'running'
                  return (
                    <li key={p.label} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                        {done ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <CheckIcon />
                          </span>
                        ) : active ? (
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-rose-400" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        )}
                      </span>
                      <div className={done || active ? '' : 'opacity-40'}>
                        <div className="text-sm font-semibold text-slate-100">{p.label}</div>
                        <div className="text-xs text-slate-400">{p.sub}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>

              {phase === 'done' && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    Kohron is calling you back now
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {WHILE_YOU_WAIT.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`tel:${DIRECT_LINE.replace(/[^0-9]/g, '')}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/[0.06]"
                  >
                    <PhoneIcon />
                    Need him now? Call {DIRECT_LINE}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Main board                                                        */
/* ================================================================== */

export default function ProjectStatus() {
  const s = rag[BRIEFING.status]
  const pct = Math.round((BRIEFING.day / BRIEFING.totalDays) * 100)
  const daysToNext = Math.max(0, BRIEFING.nextMilestoneDay - BRIEFING.day)
  const [openExc, setOpenExc] = useState(true)
  const [emergency, setEmergency] = useState(false)
  const isLoggedIn = false

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            SouthernTier · Modernization Engagement
          </p>
          <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Project Status
          </h1>
          <p className="mt-1 text-sm text-slate-500">Updated {BRIEFING.updated}</p>
        </div>
        <button
          onClick={() => setEmergency(true)}
          aria-label="Emergency protocol"
          title="Emergency: snapshot & alert Kohron"
          className="mt-1 flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-sm text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/[0.08] hover:text-rose-300"
        >
          <ShieldIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Emergency</span>
        </button>
      </div>

      {/* ── Hero status card ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.heroBg} ring-1 ring-inset ${s.heroRing} p-6 sm:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          {/* Left: status + headline */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <div className="flex items-center gap-3">
                <span className={`h-3.5 w-3.5 rounded-full ${s.dot}`} />
                <span className={`font-display text-4xl font-black tracking-tight sm:text-5xl ${s.text}`}>
                  {BRIEFING.status}
                </span>
              </div>
              <span className={`mb-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${s.badge}`}>
                {BRIEFING.confidence} confidence
              </span>
            </div>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              {BRIEFING.headline}
            </p>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                <span>{BRIEFING.phase} · {BRIEFING.week}</span>
                <span>Day {BRIEFING.day} of {BRIEFING.totalDays} · {pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <div className={`h-full rounded-full ${s.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          {/* Right: KPI chips */}
          <div className="flex shrink-0 flex-col gap-3 lg:w-56">
            <KpiChip label="Next milestone" value={BRIEFING.nextMilestone} sub={`in ${daysToNext} days`} />
            <KpiChip
              label="Decisions needed"
              value={String(DECISIONS.length)}
              sub="from leadership"
              accent="amber"
            />
            <KpiChip
              label="Open exceptions"
              value={EXCEPTIONS.length === 0 ? 'None' : String(EXCEPTIONS.length)}
              sub={EXCEPTIONS.length ? 'caught & handled' : 'all clear'}
              accent={EXCEPTIONS.length ? 'amber' : 'emerald'}
            />
          </div>
        </div>
      </div>

      {/* ── Two-column body ──────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── LEFT column (3/5) ─────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-3">

          {/* Exceptions */}
          {EXCEPTIONS.length > 0 && (
            <Section title="Exceptions" count={EXCEPTIONS.length} countTone="amber">
              {EXCEPTIONS.map((e) => (
                <div key={e.title} className="overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
                  <button
                    onClick={() => setOpenExc((v) => !v)}
                    className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-100">{e.title}</span>
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/25">
                            {e.severity}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-400">{e.summary}</p>
                        <p className="mt-1 text-sm font-medium text-emerald-300">{e.impact}</p>
                      </div>
                    </div>
                    <span className="mt-1 shrink-0 text-slate-500">
                      <ChevronIcon open={openExc} />
                    </span>
                  </button>
                  {openExc && (
                    <div className="border-t border-amber-500/15 bg-black/10 px-4 py-4 pl-10">
                      <p className="text-sm leading-relaxed text-slate-400">{e.detail}</p>
                      <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-400">Action needed from you</p>
                        <p className="mt-0.5 text-sm text-slate-200">{e.action}</p>
                      </div>
                      <p className="mt-2 text-right text-xs text-slate-600">{e.when}</p>
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Decisions needed */}
          <Section title="What I need from you" count={DECISIONS.length} countTone="amber">
            <ul className="space-y-2">
              {DECISIONS.map((d, i) => (
                <li
                  key={d.item}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-base-850/60 px-4 py-3.5 transition-colors hover:border-amber-500/20 hover:bg-amber-500/[0.04]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-bold text-amber-300">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-200">{d.item}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/20">
                    {d.due}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* What you'll have at Day 30 */}
          <div className="rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.08] to-accent/[0.03] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              What you&apos;ll have at Day 30
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">in {Math.max(0, 30 - BRIEFING.day)} days</p>
            <ul className="mt-3 space-y-2.5">
              {NEXT_OUTCOMES.map((o) => (
                <li key={o} className="flex items-start gap-3 text-[13px] text-slate-200">
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent ring-1 ring-accent/30">
                    <CheckIcon />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT column (2/5) ────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* 90-day arc */}
          <Section title="The 90-day arc">
            <ol className="relative space-y-0">
              {MILESTONES.map((m, i) => {
                const isLast = i === MILESTONES.length - 1
                const dotColor = m.state === 'done' ? 'bg-emerald-400' : m.state === 'current' ? 'bg-accent' : 'bg-slate-600'
                const cardBg = m.state === 'done'
                  ? 'border-emerald-500/20 bg-emerald-500/[0.05]'
                  : m.state === 'current'
                  ? 'border-accent/30 bg-accent/[0.07] ring-1 ring-inset ring-accent/15'
                  : 'border-white/[0.06] bg-base-850/40'
                return (
                  <li key={m.day} className="relative flex gap-4">
                    {/* Connector line */}
                    {!isLast && (
                      <span className="absolute left-[11px] top-6 h-full w-px bg-white/[0.08]" />
                    )}
                    <span className={`relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 ${dotColor === 'bg-accent' ? 'bg-accent/20' : dotColor === 'bg-emerald-400' ? 'bg-emerald-500/20' : 'bg-white/[0.04]'}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                    </span>
                    <div className={`mb-3 flex-1 rounded-xl border p-4 ${cardBg}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{m.day}</span>
                          <span className="text-sm text-slate-400">· {m.title}</span>
                        </div>
                        {m.state === 'current' && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Now
                          </span>
                        )}
                        {m.state === 'done' && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{m.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Section>

          {/* Recent updates */}
          <Section title="Recent updates">
            <ol className="space-y-0">
              {UPDATES.map((u, i) => {
                const k = kindConfig[u.kind]
                const isLast = i === UPDATES.length - 1
                return (
                  <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    {!isLast && (
                      <span className="absolute left-[5px] top-3 h-full w-px bg-white/[0.07]" />
                    )}
                    <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${k.dot}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${k.labelColor}`}>
                          {k.label}
                        </span>
                        <span className="text-[10px] text-slate-600">·</span>
                        <span className="text-[10px] text-slate-500">{u.when}</span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-300">{u.text}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Section>
        </div>
      </div>

      {/* ── Footer note ──────────────────────────────────────────── */}
      <p className="text-center text-xs text-slate-600">
        Illustrative view · modeled from the job description · real metrics confirmed once we start
      </p>

      {emergency && <EmergencyPanel onClose={() => setEmergency(false)} isLoggedIn={isLoggedIn} />}
    </div>
  )
}

/* ================================================================== */
/*  Small shared sub-components                                       */
/* ================================================================== */

function KpiChip({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: 'amber' | 'emerald'
}) {
  const valColor = accent === 'amber'
    ? 'text-amber-300'
    : accent === 'emerald'
    ? 'text-emerald-300'
    : 'text-white'
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-sm font-bold leading-snug ${valColor}`}>{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  )
}

function Section({
  title,
  count,
  countTone,
  children,
}: {
  title: string
  count?: number
  countTone?: 'amber' | 'emerald' | 'rose'
  children: React.ReactNode
}) {
  const pillColor =
    countTone === 'amber' ? 'bg-amber-500/15 text-amber-300 ring-amber-500/20'
    : countTone === 'rose' ? 'bg-rose-500/15 text-rose-300 ring-rose-500/20'
    : 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20'
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-display text-[15px] font-bold text-white">{title}</h2>
        {count !== undefined && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${pillColor}`}>
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
