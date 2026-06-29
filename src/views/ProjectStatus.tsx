// src/views/ProjectStatus.tsx
// Executive engagement status board. Edit the DATA block weekly.

import { useState } from 'react'

/* ================================================================== */
/*  DATA — update weekly                                               */
/* ================================================================== */

type Rag = 'On Track' | 'At Risk' | 'Blocked'
type StepState = 'done' | 'active' | 'next'
type Kind = 'win' | 'exception' | 'info' | 'decision'

const BRIEFING = {
  status: 'On Track' as Rag,
  phase: 'Phase 1 of 3 · Baseline',
  week: 'Week 2',
  day: 9,
  totalDays: 90,
  updated: 'June 27, 2026',
  headline: 'Discovery is ahead of schedule. The integration layer already caught its first duplicate before it reached payroll.',
  nextMilestone: 'Day 30 — Baseline report',
  nextMilestoneDay: 30,
}

const KANBAN: { state: StepState; title: string; sub: string }[] = [
  { state: 'done',   title: 'Access & discovery',         sub: 'Week 1 · Days 1–5' },
  { state: 'active', title: 'Map the real workflow',       sub: 'Week 2 · Days 6–10' },
  { state: 'next',   title: 'Source of truth & risk map',  sub: 'Week 3 · Days 11–15' },
  { state: 'next',   title: 'First controlled win',         sub: 'Week 4 · Days 16–20' },
  { state: 'next',   title: 'Review & plan ahead',         sub: 'Days 21–30' },
]

type MState = 'done' | 'current' | 'upcoming'
const MILESTONES: { day: string; label: string; state: MState }[] = [
  { day: 'Day 30', label: 'Baseline',  state: 'current' },
  { day: 'Day 60', label: 'Connected', state: 'upcoming' },
  { day: 'Day 90', label: 'Governed',  state: 'upcoming' },
]

const EXCEPTIONS = [
  {
    title: 'Duplicate employee record',
    severity: 'Caught & handled',
    summary: 'Same field tech — two IDs across Paychex and PenguinData.',
    impact: 'No payroll impact. Quarantined before sync.',
    detail: 'The integration layer flagged a name + SSN-tail match with mismatched employee IDs. The record was held in the exception queue instead of being written through, so dispatch and payroll were never affected.',
    action: 'Confirm which employee ID is correct.',
    when: 'Today · 9:12 AM',
  },
]

const DECISIONS: { item: string; due: string }[] = [
  { item: 'Confirm Paychex as the official source of employee data', due: 'Day 12' },
  { item: 'Name one person to approve data cleanup', due: 'Day 12' },
  { item: 'Resolve the duplicate-record exception', due: 'This week' },
]

const UPDATES: { when: string; kind: Kind; text: string }[] = [
  { when: 'Today · 9:12 AM', kind: 'exception', text: 'Caught a duplicate employee record before payroll. Quarantined.' },
  { when: 'Yesterday',       kind: 'win',       text: 'Google Drive inventory complete — a decade of files sorted and sensitive folders flagged.' },
  { when: 'Jun 25',          kind: 'info',      text: 'Mapped the hire → field → fleet → billing workflow with dispatch and HR.' },
  { when: 'Jun 24',          kind: 'decision',  text: 'Recommended Paychex as the employee source of truth.' },
  { when: 'Jun 23',          kind: 'win',       text: 'Read-only access confirmed to Paychex, PenguinData, and QuickBooks.' },
]

const PROTOCOL = [
  { label: 'Capturing system snapshot',  sub: 'Freezing current state across all systems.' },
  { label: 'Pausing affected writes',    sub: 'Holding integrations in read-only.' },
  { label: 'Contacting Kohron',          sub: 'Call + SMS with snapshot link.' },
  { label: 'Kohron acknowledged',        sub: 'Calling you back now.' },
]
const DIRECT_LINE = '(305) 555-0142'
const WAIT_NOTES = [
  'Keep this screen open — Kohron is calling you back.',
  'No action needed. Affected systems are already paused.',
  'Payroll, dispatch, and billing are unaffected.',
]

/* ================================================================== */
/*  Style maps                                                         */
/* ================================================================== */

const rag: Record<Rag, { dot: string; text: string; bar: string; heroBg: string; heroRing: string; badge: string }> = {
  'On Track': { dot: 'bg-emerald-400', text: 'text-emerald-300', bar: 'bg-emerald-400', heroBg: 'from-emerald-950/50 via-base-850/60 to-base-900/80', heroRing: 'ring-emerald-500/15', badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25' },
  'At Risk':  { dot: 'bg-amber-400',   text: 'text-amber-300',   bar: 'bg-amber-400',   heroBg: 'from-amber-950/50 via-base-850/60 to-base-900/80',   heroRing: 'ring-amber-500/15',   badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/25'   },
  Blocked:    { dot: 'bg-rose-400',    text: 'text-rose-300',    bar: 'bg-rose-400',    heroBg: 'from-rose-950/50 via-base-850/60 to-base-900/80',    heroRing: 'ring-rose-500/15',    badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/25'    },
}

const kindCfg: Record<Kind, { dot: string; label: string; color: string }> = {
  win:       { dot: 'bg-emerald-400', label: 'Progress',  color: 'text-emerald-400' },
  exception: { dot: 'bg-amber-400',   label: 'Exception', color: 'text-amber-400'   },
  info:      { dot: 'bg-sky-400',     label: 'Update',    color: 'text-sky-400'     },
  decision:  { dot: 'bg-violet-400',  label: 'Decision',  color: 'text-violet-400'  },
}

const kanbanCfg: Record<StepState, { col: string; dot: string; ring: string; label: string }> = {
  done:   { col: 'border-emerald-500/20 bg-emerald-500/[0.04]', dot: 'bg-emerald-400',    ring: '',                         label: 'Done'   },
  active: { col: 'border-accent/30 bg-accent/[0.06] ring-1 ring-inset ring-accent/10',    dot: 'bg-accent animate-pulse', ring: '', label: 'Active' },
  next:   { col: 'border-white/[0.06] bg-white/[0.02]',         dot: 'bg-slate-600',      ring: '',                         label: 'Up next' },
}

/* ================================================================== */
/*  Inline SVG icons                                                   */
/* ================================================================== */

const Shield = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4M12 16h.01" />
  </svg>
)
const Check = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
const Chevron = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)
const Close = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
const Phone = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.69 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.96a2 2 0 0 1 2.11-.45c.74.33 1.53.56 2.34.69A2 2 0 0 1 22 16.92z" />
  </svg>
)

/* ================================================================== */
/*  Emergency panel                                                    */
/* ================================================================== */

function EmergencyPanel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(-1)
  const running = step >= 0 && step < PROTOCOL.length
  const done = step >= PROTOCOL.length

  const run = () => {
    setStep(0)
    const tick = (i: number) => {
      if (i >= PROTOCOL.length) return
      setTimeout(() => { setStep(i + 1); tick(i + 1) }, i === 0 ? 700 : 1100)
    }
    tick(0)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-base-950/80 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-base-850 shadow-2xl sm:max-w-md sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-[15px] font-bold text-white">Emergency protocol</div>
                <div className="text-xs text-slate-400">Snapshot · contain · contact Kohron</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"><Close /></button>
          </div>

          {step === -1 && (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-relaxed text-slate-300">
                Captures a full system snapshot, pauses affected integrations in read-only, and contacts Kohron immediately.
              </p>
              <button onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400 active:scale-[0.98]">
                <Shield className="h-4 w-4" />Trigger emergency snapshot
              </button>
              <button onClick={run} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 hover:underline underline-offset-2">
                Preview without triggering →
              </button>
            </div>
          )}

          {(running || done) && (
            <div className="mt-5 space-y-4">
              <ol className="space-y-3">
                {PROTOCOL.map((p, i) => {
                  const isDone = i < step || done
                  const isActive = i === step && running
                  return (
                    <li key={p.label} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                        {isDone ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"><Check /></span>
                        ) : isActive ? (
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-rose-400" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        )}
                      </span>
                      <div className={isDone || isActive ? '' : 'opacity-40'}>
                        <div className="text-sm font-semibold text-slate-100">{p.label}</div>
                        <div className="text-xs text-slate-400">{p.sub}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>
              {done && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    Kohron is calling you back now
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {WAIT_NOTES.map(w => (
                      <li key={w} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />{w}
                      </li>
                    ))}
                  </ul>
                  <a href={`tel:${DIRECT_LINE.replace(/\D/g,'')}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-white/[0.06]">
                    <Phone />Call {DIRECT_LINE}
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
/*  Main board                                                         */
/* ================================================================== */

export default function ProjectStatus() {
  const s = rag[BRIEFING.status]
  const pct = Math.round((BRIEFING.day / BRIEFING.totalDays) * 100)
  const daysToNext = Math.max(0, BRIEFING.nextMilestoneDay - BRIEFING.day)
  const [decisionsOpen, setDecisionsOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [emergency, setEmergency] = useState(false)

  const done   = KANBAN.filter(k => k.state === 'done')
  const active = KANBAN.filter(k => k.state === 'active')
  const next   = KANBAN.filter(k => k.state === 'next')

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">SouthernTier · Modernization</p>
          <h1 className="mt-0.5 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">Project Status</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Updated {BRIEFING.updated}</span>
          <button
            onClick={() => setEmergency(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/[0.08] hover:text-rose-300"
          >
            <Shield className="h-4 w-4" /><span className="hidden sm:inline">Emergency</span>
          </button>
        </div>
      </div>

      {/* ── Status hero ─────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.heroBg} ring-1 ring-inset ${s.heroRing} px-6 py-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status + headline */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${s.dot}`} />
              <span className={`font-display text-2xl font-black tracking-tight sm:text-3xl ${s.text}`}>{BRIEFING.status}</span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${s.badge}`}>
                {BRIEFING.phase}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{BRIEFING.headline}</p>
          </div>
          {/* Quick stats */}
          <div className="flex shrink-0 gap-3">
            <Stat label="Day" value={`${BRIEFING.day}`} sub={`of ${BRIEFING.totalDays}`} />
            <Stat label="Next milestone" value={`${daysToNext}d`} sub={BRIEFING.nextMilestone.split('—')[0].trim()} />
            {EXCEPTIONS.length > 0 && (
              <Stat label="Exceptions" value={String(EXCEPTIONS.length)} sub="action needed" tone="amber" />
            )}
            {DECISIONS.length > 0 && (
              <Stat label="Decisions" value={String(DECISIONS.length)} sub="from leadership" tone="amber" />
            )}
          </div>
        </div>

        {/* Progress rail */}
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div className={`h-full rounded-full ${s.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-600">
            <span>Day 1</span><span>{pct}% complete</span><span>Day 90</span>
          </div>
        </div>
      </div>

      {/* ── 90-day timeline ─────────────────────────────────────────── */}
      <div className="relative flex items-stretch gap-0 overflow-hidden rounded-2xl border border-white/[0.06]">
        {/* Connecting line */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.06]" />
        {MILESTONES.map((m, i) => {
          const dotColor = m.state === 'done' ? 'bg-emerald-400' : m.state === 'current' ? 'bg-accent' : 'bg-slate-600'
          const bg = m.state === 'current' ? 'bg-accent/[0.06]' : m.state === 'done' ? 'bg-emerald-500/[0.04]' : 'bg-white/[0.02]'
          const border = i > 0 ? 'border-l border-white/[0.06]' : ''
          const labelColor = m.state === 'current' ? 'text-accent' : m.state === 'done' ? 'text-emerald-300' : 'text-slate-500'
          return (
            <div key={m.day} className={`relative flex flex-1 flex-col items-center py-4 ${bg} ${border}`}>
              <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-base-900`}>
                <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
              </span>
              <span className={`mt-2 text-xs font-bold ${labelColor}`}>{m.day}</span>
              <span className="mt-0.5 text-[11px] text-slate-400">{m.label}</span>
              {m.state === 'current' && (
                <span className="mt-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Now</span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Exceptions — always open ─────────────────────────────────── */}
      {EXCEPTIONS.length > 0 && (
        <div className="space-y-2">
          <Label text="Exceptions" count={EXCEPTIONS.length} tone="amber" />
          {EXCEPTIONS.map(e => (
            <div key={e.title} className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04]">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{e.title}</span>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/25">{e.severity}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{e.summary}</p>
                      <p className="mt-0.5 text-sm font-medium text-emerald-300">{e.impact}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600">{e.when}</span>
                </div>
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Action needed</p>
                  <p className="mt-1 text-sm text-slate-200">{e.action}</p>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Kanban ──────────────────────────────────────────────────── */}
      <div>
        <Label text="Work state" />
        <div className="mt-2 grid grid-cols-3 gap-3">
          {/* Done */}
          <KanbanCol label="Done" tone="emerald" items={done} state="done" />
          {/* In progress */}
          <KanbanCol label="In Progress" tone="accent" items={active} state="active" />
          {/* Up next */}
          <KanbanCol label="Up Next" tone="slate" items={next} state="next" />
        </div>
      </div>

      {/* ── Decisions — collapsed by default ───────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <button
          onClick={() => setDecisionsOpen(v => !v)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-bold text-white">Decisions needed from you</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-inset ring-amber-500/20">
              {DECISIONS.length}
            </span>
          </div>
          <span className="text-slate-500"><Chevron open={decisionsOpen} /></span>
        </button>
        {decisionsOpen && (
          <div className="border-t border-white/[0.06] px-5 py-4">
            <ul className="space-y-2">
              {DECISIONS.map((d, i) => (
                <li key={d.item} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-base-850/50 px-4 py-3 transition-colors hover:border-amber-500/20 hover:bg-amber-500/[0.04]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-bold text-amber-300">{i + 1}</span>
                    <span className="text-sm text-slate-200">{d.item}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/20">{d.due}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Recent updates — collapsed to 2, expand for all ─────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <span className="font-display text-[15px] font-bold text-white">Recent updates</span>
          {UPDATES.length > 2 && (
            <button onClick={() => setUpdatesOpen(v => !v)} className="text-xs text-slate-500 transition-colors hover:text-slate-300">
              {updatesOpen ? 'Show less' : `+${UPDATES.length - 2} more`}
            </button>
          )}
        </div>
        <div className="border-t border-white/[0.06] px-5 py-4">
          <ol className="space-y-0">
            {(updatesOpen ? UPDATES : UPDATES.slice(0, 2)).map((u, i, arr) => {
              const k = kindCfg[u.kind]
              return (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < arr.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-white/[0.07]" />}
                  <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${k.dot}`} />
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${k.color}`}>{k.label}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-500">{u.when}</span>
                    </div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-300">{u.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-700">Illustrative · modeled from job description · real metrics confirmed on-site</p>

      {emergency && <EmergencyPanel onClose={() => setEmergency(false)} />}
    </div>
  )
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'amber' }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className={`font-display text-lg font-bold leading-none ${tone === 'amber' ? 'text-amber-300' : 'text-white'}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-slate-500">{sub}</p>
    </div>
  )
}

function Label({ text, count, tone }: { text: string; count?: number; tone?: 'amber' }) {
  const pill = tone === 'amber' ? 'bg-amber-500/15 text-amber-300 ring-amber-500/20' : 'bg-white/10 text-slate-300 ring-white/10'
  return (
    <div className="mb-2 flex items-center gap-2">
      <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500">{text}</h2>
      {count !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${pill}`}>{count}</span>
      )}
    </div>
  )
}

function KanbanCol({ label, tone, items, state }: {
  label: string
  tone: 'emerald' | 'accent' | 'slate'
  items: typeof KANBAN
  state: StepState
}) {
  const headerColor = tone === 'emerald' ? 'text-emerald-400' : tone === 'accent' ? 'text-accent' : 'text-slate-500'
  const cfg = kanbanCfg[state]
  return (
    <div className="space-y-2">
      <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${headerColor}`}>{label}</p>
      {items.length === 0 ? (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] px-3 py-4 text-center text-[11px] text-slate-700">—</div>
      ) : (
        items.map(item => (
          <div key={item.title} className={`rounded-xl border px-3 py-3 ${cfg.col}`}>
            <div className="flex items-start gap-2">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
              <div>
                <p className="text-[13px] font-semibold leading-snug text-slate-100">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{item.sub}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
