// src/views/ProjectStatus.tsx
// Live project-status board for the SouthernTier engagement.
// Self-contained: only needs React + Tailwind. Edit the DATA block weekly.

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  DATA — edit these objects each week. Nothing else needs to change. */
/* ------------------------------------------------------------------ */

const PROJECT = {
  phase: "Phase 1 of 3 — Baseline",
  week: "Week 2",
  daysElapsed: 9,
  daysTotal: 90,
  nextMilestone: "Day 30 — Baseline report",
  status: "On Track" as Status,
  updated: "June 27, 2026",
  focus:
    "Mapping the real hire → field → fleet → billing workflow, and inventorying the Google Drive and spreadsheet sprawl.",
};

type Status = "On Track" | "At Risk" | "Blocked";
type StepState = "Complete" | "In Progress" | "Not Started";

const STEPS: { when: string; label: string; state: StepState }[] = [
  { when: "Week 1 · Days 1–5", label: "Access, people, and discovery", state: "Complete" },
  { when: "Week 2 · Days 6–10", label: "Map the real workflow", state: "In Progress" },
  { when: "Week 3 · Days 11–15", label: "Source of truth, mapping, and risk", state: "Not Started" },
  { when: "Week 4 · Days 16–20", label: "First controlled win + baseline", state: "Not Started" },
  { when: "Days 21–30", label: "Review, approve, and plan ahead", state: "Not Started" },
];

const DECISIONS: { item: string; owner: string; due: string }[] = [
  { item: "Confirm Paychex as the employee source of truth", owner: "Leadership / HR", due: "Day 12" },
  { item: "Assign one business owner for data-cleanup approvals", owner: "Leadership", due: "Day 12" },
];

const BLOCKERS: string[] = [
  // Empty is the goal. Add a string here only if something is actually blocked.
];

const MILESTONES: { day: string; label: string; done: boolean }[] = [
  { day: "Day 30", label: "Baseline established", done: false },
  { day: "Day 60", label: "Systems connected", done: false },
  { day: "Day 90", label: "Governed & handed off", done: false },
];

/* ------------------------------------------------------------------ */
/*  Styling helpers                                                    */
/* ------------------------------------------------------------------ */

const statusStyles: Record<Status, string> = {
  "On Track": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "At Risk": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Blocked: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const stepDot: Record<StepState, string> = {
  Complete: "bg-emerald-500",
  "In Progress": "bg-blue-500 animate-pulse",
  "Not Started": "bg-slate-300",
};

const stepText: Record<StepState, string> = {
  Complete: "text-slate-500 line-through decoration-slate-300",
  "In Progress": "text-slate-900 font-medium",
  "Not Started": "text-slate-400",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProjectStatus() {
  const [showAll, setShowAll] = useState(true);
  const pct = Math.round((PROJECT.daysElapsed / PROJECT.daysTotal) * 100);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Status</h1>
          <p className="mt-1 text-sm text-slate-500">
            SouthernTier systems modernization · updated {PROJECT.updated}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${statusStyles[PROJECT.status]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {PROJECT.status}
        </span>
      </div>

      {/* KPI strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: "Phase", v: PROJECT.phase },
          { k: "Current week", v: PROJECT.week },
          { k: "Days elapsed", v: `${PROJECT.daysElapsed} of ${PROJECT.daysTotal}` },
          { k: "Next milestone", v: PROJECT.nextMilestone },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.k}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{c.v}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Engagement progress</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* This week's focus */}
      <div className="mt-6 rounded-xl border-l-4 border-blue-600 bg-blue-50/60 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">This week’s focus</div>
        <p className="mt-1 text-sm text-slate-700">{PROJECT.focus}</p>
      </div>

      {/* Two columns: progress + decisions/blockers */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* First 30 days progress */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-900">First 30 days</h2>
          <ul className="mt-3 space-y-3">
            {STEPS.map((s) => (
              <li key={s.when} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${stepDot[s.state]}`} />
                <div className="min-w-0">
                  <div className={`text-sm ${stepText[s.state]}`}>{s.label}</div>
                  <div className="text-xs text-slate-400">
                    {s.when} · {s.state}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Decisions + blockers */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Decisions needed from you</h2>
            <ul className="mt-3 space-y-3">
              {DECISIONS.length === 0 && (
                <li className="text-sm text-slate-400">None right now.</li>
              )}
              {DECISIONS.map((d) => (
                <li key={d.item} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-sm text-slate-800">{d.item}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {d.owner} · due {d.due}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Blockers</h2>
            {BLOCKERS.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                None — work is moving.
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {BLOCKERS.map((b) => (
                  <li key={b} className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 90-day milestone strip */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">The 90-day arc</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MILESTONES.map((m) => (
            <div
              key={m.day}
              className={`rounded-xl border p-4 ${
                m.done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${m.done ? "bg-emerald-500" : "bg-slate-300"}`}
                />
                <span className="text-sm font-semibold text-slate-900">{m.day}</span>
              </div>
              <div className="mt-1 text-sm text-slate-600">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Live status · maintained by Kohron Burton · updated weekly
      </p>
    </div>
  );
}
