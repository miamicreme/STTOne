'use client'

// Self-contained executive Gantt — pure CSS/Tailwind, no chart library.
// Dates are computed from a fixed origin; update GANTT_ORIGIN and the task
// `day` / `dur` offsets each engagement cycle.

const GANTT_ORIGIN = '2026-07-01'
const TOTAL_DAYS = 91 // Jul 1 – Sep 29 inclusive

type GState = 'done' | 'active' | 'upcoming'

interface GTask {
  label: string
  day: number  // offset from GANTT_ORIGIN
  dur: number  // duration in days
  state: GState
}

interface GPhase {
  label: string
  sub: string
  hue: 'emerald' | 'accent' | 'violet'
  tasks: GTask[]
}

const PHASES: GPhase[] = [
  {
    label: 'Onboarding',
    sub: 'Days 1 – 30',
    hue: 'emerald',
    tasks: [
      { label: 'Meet team & set up dev environment', day: 0,  dur: 10, state: 'done'     },
      { label: 'Study existing systems & docs',      day: 5,  dur: 15, state: 'active'   },
      { label: 'Complete initial training modules',  day: 11, dur: 15, state: 'upcoming' },
    ],
  },
  {
    label: 'Contribution',
    sub: 'Days 31 – 60',
    hue: 'accent',
    tasks: [
      { label: 'Fix minor bugs and write tests', day: 25, dur: 20, state: 'upcoming' },
      { label: 'Participate in code reviews',    day: 45, dur: 10, state: 'upcoming' },
      { label: 'Deliver first small feature',    day: 55, dur: 15, state: 'upcoming' },
    ],
  },
  {
    label: 'Leadership',
    sub: 'Days 61 – 90',
    hue: 'violet',
    tasks: [
      { label: 'Lead development of a key feature',           day: 62, dur: 23, state: 'upcoming' },
      { label: 'Propose process / architecture improvements', day: 84, dur:  7, state: 'upcoming' },
    ],
  },
]

// Month tick positions as % of TOTAL_DAYS
const MONTHS = [
  { label: 'Jul',    pct: 0 },
  { label: 'Aug',    pct: (31 / TOTAL_DAYS) * 100 },
  { label: 'Sep',    pct: (62 / TOTAL_DAYS) * 100 },
  { label: '',       pct: 100 },
]

// Phase boundary ticks
const PHASE_TICKS = [
  { pct: (30 / TOTAL_DAYS) * 100,  label: 'Day 30' },
  { pct: (60 / TOTAL_DAYS) * 100,  label: 'Day 60' },
  { pct: (90 / TOTAL_DAYS) * 100,  label: 'Day 90' },
]

const barColor: Record<GPhase['hue'], Record<GState, string>> = {
  emerald: {
    done:     'bg-emerald-500',
    active:   'bg-emerald-400',
    upcoming: 'bg-emerald-900/60 ring-1 ring-inset ring-emerald-500/30',
  },
  accent: {
    done:     'bg-accent',
    active:   'bg-accent',
    upcoming: 'bg-accent/10 ring-1 ring-inset ring-accent/30',
  },
  violet: {
    done:     'bg-violet-500',
    active:   'bg-violet-400',
    upcoming: 'bg-violet-900/60 ring-1 ring-inset ring-violet-500/30',
  },
}

const phaseLabel: Record<GPhase['hue'], string> = {
  emerald: 'text-emerald-400',
  accent:  'text-accent',
  violet:  'text-violet-400',
}

const phaseDivider: Record<GPhase['hue'], string> = {
  emerald: 'bg-emerald-500/20',
  accent:  'bg-accent/20',
  violet:  'bg-violet-500/20',
}

function p(day: number) {
  return `${((day / TOTAL_DAYS) * 100).toFixed(3)}%`
}

function todayOffset(): number {
  const origin = new Date(GANTT_ORIGIN).getTime()
  const now = Date.now()
  return Math.round((now - origin) / 86_400_000)
}

export function GanttChart() {
  const today = todayOffset()
  const showToday = today >= 0 && today <= TOTAL_DAYS
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-base-900/50">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div>
          <h2 className="font-display text-[15px] font-bold text-white">30 / 60 / 90-Day Plan</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {GANTT_ORIGIN} — Sep 29, 2026 · Senior Software Engineer
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-emerald-500" />Done</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-accent" />Active</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-white/10 ring-1 ring-inset ring-white/20" />Upcoming</span>
        </div>
      </div>

      <div className="overflow-x-auto px-5 pb-5 pt-4">
        <div className="min-w-[480px]">
        {/* Month axis */}
        <div className="relative mb-1 ml-[9rem] h-5">
          {MONTHS.map((m, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              style={{ left: `${m.pct}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid + rows */}
        <div className="relative ml-[9rem]">
          {/* Vertical grid lines — months */}
          {MONTHS.map((m, i) => (
            <div
              key={i}
              className="absolute inset-y-0 w-px bg-white/[0.05]"
              style={{ left: `${m.pct}%` }}
            />
          ))}

          {/* Phase boundary ticks */}
          {PHASE_TICKS.map((t) => (
            <div
              key={t.label}
              className="absolute inset-y-0 w-px bg-white/[0.12]"
              style={{ left: `${t.pct}%` }}
            />
          ))}

          {/* Today marker */}
          {showToday && (
            <div
              className="absolute inset-y-0 z-10 w-0.5 bg-brand-red/70"
              style={{ left: p(today) }}
            >
              <span className="absolute -top-5 left-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-wide text-brand-red-soft">
                Today
              </span>
            </div>
          )}

          {/* Phase rows */}
          {PHASES.map((phase) => (
            <div key={phase.label} className="mb-1 last:mb-0">
              {/* Phase label row */}
              <div className="relative flex h-7 items-center">
                {/* Phase label sits left of the grid — negative offset */}
                <span
                  className={`absolute right-full mr-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] ${phaseLabel[phase.hue]}`}
                  style={{ width: '9rem', textAlign: 'right' }}
                >
                  {phase.label}
                </span>
                {/* Phase background span */}
                <div className={`absolute inset-y-1 rounded-sm ${phaseDivider[phase.hue]} opacity-40`}
                  style={{
                    left: p(PHASES.indexOf(phase) === 0 ? 0 : PHASES.indexOf(phase) === 1 ? 30 : 60),
                    width: p(30),
                  }}
                />
              </div>

              {/* Task rows */}
              {phase.tasks.map((task) => (
                <div key={task.label} className="group relative flex h-8 items-center">
                  {/* Task label — left gutter */}
                  <span
                    className="absolute right-full mr-3 truncate text-[11px] text-slate-400 group-hover:text-slate-200"
                    style={{ width: '9rem', textAlign: 'right' }}
                    title={task.label}
                  >
                    {task.label}
                  </span>

                  {/* Bar */}
                  <div
                    className={`absolute h-5 rounded-md transition-all ${barColor[phase.hue][task.state]} ${task.state === 'active' ? 'shadow-[0_0_10px_-2px_currentColor]' : ''}`}
                    style={{ left: p(task.day), width: p(task.dur) }}
                  >
                    {/* Label inside bar if wide enough (>12 days) */}
                    {task.dur >= 14 && (
                      <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-white/80 truncate">
                        {task.label}
                      </span>
                    )}
                  </div>

                  {/* Hover tooltip for narrow bars */}
                  {task.dur < 14 && (
                    <div
                      className="pointer-events-none absolute z-20 hidden rounded-lg border border-white/10 bg-base-900 px-2.5 py-1.5 text-[11px] text-slate-200 shadow-xl group-hover:block"
                      style={{ left: p(task.day + task.dur / 2) }}
                    >
                      {task.label}
                      <span className="ml-2 text-slate-500">{task.dur}d</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Phase separator */}
              <div className="my-1 h-px bg-white/[0.04]" />
            </div>
          ))}

          {/* Day labels at phase boundaries */}
          <div className="relative mt-1 h-4">
            {PHASE_TICKS.map((t) => (
              <span
                key={t.label}
                className="absolute -translate-x-1/2 text-[9px] font-semibold text-slate-600"
                style={{ left: `${t.pct}%` }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
