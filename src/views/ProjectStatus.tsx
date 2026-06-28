// src/views/ProjectStatus.tsx
// Mobile-first executive status board for the SouthernTier engagement.
// Discreet emergency: a small shield icon in the corner opens a focused panel
// that runs an animated contact protocol and guidance until Kohron calls back.
//
// Self-contained: React + Tailwind only. Edit the DATA block to update.
// NOTE: Illustrative, modeled from the job description. Real metrics, systems,
// and workflows are confirmed once the engagement begins.

import { useEffect, useState } from "react";

/* ============================  DATA  ============================ */

type Rag = "On Track" | "At Risk" | "Blocked";

const BRIEFING = {
  status: "On Track" as Rag,
  confidence: "High",
  phase: "Phase 1 of 3 · Baseline",
  day: 9,
  totalDays: 90,
  updated: "June 27, 2026 · 9:40 AM",
  headline:
    "Discovery is ahead of schedule. The integration layer already caught its first duplicate before it reached payroll. On track for the Day 30 baseline.",
  nextMilestone: "Day 30 — Baseline & first savings estimate",
  nextMilestoneDay: 30,
};

const NEXT_OUTCOMES = [
  "A baseline report leadership can trust",
  "One agreed source of truth for every number",
  "The first estimate of avoidable cost",
];

const EXCEPTIONS = [
  {
    severity: "Caught & handled",
    title: "Duplicate employee record",
    summary: "Same field tech, two different IDs across Paychex and PenguinData.",
    impact: "No payroll impact — caught and quarantined before sync.",
    detail:
      "The integration layer flagged a name + SSN-tail match with mismatched employee IDs. The record was held in the exception queue instead of being written through, so dispatch and payroll were never affected.",
    action: "Needs you to confirm which ID is the correct one.",
    when: "Today · 9:12 AM",
  },
];

type MState = "done" | "current" | "upcoming";
const MILESTONES: { day: string; title: string; desc: string; state: MState }[] = [
  { day: "Day 30", title: "Baseline", desc: "Know where you stand — and what the disconnect costs today.", state: "current" },
  { day: "Day 60", title: "Connected", desc: "Systems share data automatically; live leadership reporting.", state: "upcoming" },
  { day: "Day 90", title: "Governed", desc: "Cleaned up, locked down, and built to stay that way.", state: "upcoming" },
];

const DECISIONS: { item: string; due: string }[] = [
  { item: "Confirm Paychex as the official source of employee data", due: "by Day 12" },
  { item: "Name one person to approve data cleanup", due: "by Day 12" },
  { item: "Resolve the duplicate-record exception above", due: "this week" },
];

type Kind = "win" | "exception" | "info" | "decision";
const UPDATES: { when: string; kind: Kind; text: string }[] = [
  { when: "Today · 9:12 AM", kind: "exception", text: "Caught a duplicate employee record before it reached payroll. Quarantined and flagged for review." },
  { when: "Yesterday", kind: "win", text: "Finished the top-level Google Drive inventory — a decade of files sorted into six categories, sensitive folders flagged." },
  { when: "Jun 25", kind: "info", text: "Mapped the real hire → field → fleet → billing workflow with dispatch and HR." },
  { when: "Jun 24", kind: "decision", text: "Recommended Paychex as the employee source of truth — awaiting leadership sign-off." },
  { when: "Jun 23", kind: "win", text: "Read-only access confirmed to Paychex, PenguinData, and QuickBooks. No production changes." },
];

// Emergency protocol — the animated steps and the guidance shown until Kohron calls.
const PROTOCOL = [
  { label: "Capturing system snapshot", sub: "Freezing current state across Paychex, PenguinData, QuickBooks, and the integration layer." },
  { label: "Pausing affected integrations", sub: "Holding writes in read-only so nothing changes while we look." },
  { label: "Contacting Kohron", sub: "Placing a call and sending an SMS with the snapshot link." },
  { label: "Kohron acknowledged", sub: "Calling you back now." },
];
const WHILE_YOU_WAIT = [
  "Keep this screen open — Kohron is calling you back now.",
  "No action needed from you. Affected systems are already paused safely.",
  "Payroll, dispatch, and billing are unaffected.",
  "Please hold any new changes until we've spoken.",
];
const DIRECT_LINE = "(305) 555-0142"; // replace with your number

/* ==========================  STYLE MAPS  ========================= */

const rag: Record<Rag, { dot: string; text: string; bg: string; ring: string }> = {
  "On Track": { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-600/20" },
  "At Risk": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-600/20" },
  Blocked: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-600/20" },
};
const kindDot: Record<Kind, string> = { win: "bg-emerald-500", exception: "bg-amber-500", info: "bg-blue-500", decision: "bg-violet-500" };
const kindLabel: Record<Kind, string> = { win: "Progress", exception: "Exception", info: "Update", decision: "Decision" };

/* ============================  ICONS  =========================== */

const Shield = ({ c = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const Lock = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 inline -mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const Phone = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.69 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.96a2 2 0 0 1 2.11-.45c.74.33 1.53.56 2.34.69A2 2 0 0 1 22 16.92z" /></svg>
);

/* =====================  EMERGENCY PANEL  ======================== */

function EmergencyPanel({ onClose, isLoggedIn }: { onClose: () => void; isLoggedIn: boolean }) {
  const [phase, setPhase] = useState<"ready" | "running" | "done">("ready");
  const [step, setStep] = useState(0);
  const [gate, setGate] = useState(false);

  useEffect(() => {
    if (phase !== "running") return;
    if (step >= PROTOCOL.length) { setPhase("done"); return; }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [phase, step]);

  const run = () => { setPhase("running"); setStep(0); };
  const trigger = () => (isLoggedIn ? run() : setGate(true));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Shield c="h-5 w-5" /></span>
            <div>
              <div className="text-[15px] font-bold text-slate-900">Emergency protocol</div>
              <div className="text-xs text-slate-400">Snapshot · contain · contact</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* READY */}
        {phase === "ready" && (
          <div className="mt-5">
            <p className="text-sm text-slate-600">
              This captures a full system snapshot, pauses affected integrations in read-only, and contacts Kohron immediately — then keeps you posted here until he calls back.
            </p>
            <button onClick={trigger} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700">
              <Shield c="h-4 w-4" /> Trigger emergency snapshot
            </button>
            <p className="mt-2 text-center text-xs text-slate-400"><Lock /> You'll need to be signed in to trigger this.</p>
            {gate && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
                Sign-in required. This is a live action — it captures a snapshot and calls Kohron.
              </p>
            )}
            <button onClick={run} className="mt-3 w-full text-center text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline">
              Preview the protocol →
            </button>
          </div>
        )}

        {/* RUNNING / DONE */}
        {phase !== "ready" && (
          <div className="mt-5">
            <ol className="space-y-3">
              {PROTOCOL.map((p, i) => {
                const done = i < step || phase === "done";
                const active = i === step && phase === "running";
                return (
                  <li key={p.label} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                      {done ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"><Check /></span>
                      ) : active ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-rose-500" />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                      )}
                    </span>
                    <div className={done || active ? "" : "opacity-40"}>
                      <div className="text-sm font-semibold text-slate-900">{p.label}</div>
                      <div className="text-xs text-slate-500">{p.sub}</div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {phase === "done" && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Kohron is calling you back now
                </div>
                <ul className="mt-3 space-y-1.5">
                  {WHILE_YOU_WAIT.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />{w}
                    </li>
                  ))}
                </ul>
                <a href={`tel:${DIRECT_LINE.replace(/[^0-9]/g, "")}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Phone /> Need him now? Call {DIRECT_LINE}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================  BOARD  ============================= */

export default function ProjectStatus() {
  const s = rag[BRIEFING.status];
  const pct = Math.round((BRIEFING.day / BRIEFING.totalDays) * 100);
  const daysToNext = Math.max(0, BRIEFING.nextMilestoneDay - BRIEFING.day);
  const [openExc, setOpenExc] = useState(true);
  const [emergency, setEmergency] = useState(false);
  const isLoggedIn = false; // wire to your auth

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
        {/* Header with discreet emergency icon in the corner */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">SouthernTier · Modernization</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Where things stand</h1>
            <div className="mt-0.5 text-[11px] text-slate-400">Updated {BRIEFING.updated}</div>
          </div>
          <button
            onClick={() => setEmergency(true)}
            aria-label="Emergency protocol"
            title="Emergency protocol"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <Shield c="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* disclaimer */}
        <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-[12px] leading-snug text-slate-500">
          Illustrative view, modeled from the job description. The real metrics, systems, and workflow are confirmed once we start.
        </div>

        {/* HERO */}
        <div className={`mt-4 rounded-2xl ${s.bg} ring-1 ring-inset ${s.ring} p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`h-3.5 w-3.5 rounded-full ${s.dot}`} />
              <span className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${s.text}`}>{BRIEFING.status}</span>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="font-semibold text-slate-700">{BRIEFING.phase}</div>
              <div>Day {BRIEFING.day} / {BRIEFING.totalDays} · {BRIEFING.confidence}</div>
            </div>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{BRIEFING.headline}</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
            <div className={`h-full rounded-full ${s.dot}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* KPI tiles */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Next milestone</div>
            <div className="mt-1 text-[15px] font-semibold text-slate-900">{BRIEFING.nextMilestone}</div>
            <div className="mt-0.5 text-sm text-slate-500">in {daysToNext} days</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Waiting on you</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{DECISIONS.length}</div>
            <div className="mt-0.5 text-sm text-slate-500">decisions</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Exceptions</div>
            <div className={`mt-1 text-3xl font-bold ${EXCEPTIONS.length ? "text-amber-600" : "text-emerald-600"}`}>{EXCEPTIONS.length || "0"}</div>
            <div className="mt-0.5 text-sm text-slate-500">{EXCEPTIONS.length ? "caught & handled" : "none open"}</div>
          </div>
        </div>

        {/* EXCEPTION */}
        {EXCEPTIONS.map((e) => (
          <div key={e.title} className="mt-4 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/70">
            <button onClick={() => setOpenExc((v) => !v)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-semibold text-slate-900">{e.title}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{e.severity}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{e.summary}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-700">{e.impact}</p>
                </div>
              </div>
              <span className="mt-1 shrink-0 text-slate-400">{openExc ? "–" : "+"}</span>
            </button>
            {openExc && (
              <div className="border-t border-amber-200 bg-white/60 px-4 py-3 pl-9">
                <p className="text-sm text-slate-600">{e.detail}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-slate-800">Action: {e.action}</span>
                  <span className="text-xs text-slate-400">{e.when}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* What you get */}
        <div className="mt-5 rounded-2xl border-l-4 border-blue-600 bg-blue-50/60 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">What you'll have at Day 30</div>
          <ul className="mt-2 space-y-1.5">
            {NEXT_OUTCOMES.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{o}</li>
            ))}
          </ul>
        </div>

        {/* 90-day arc */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900">The 90-day arc</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {MILESTONES.map((m) => {
              const tone = m.state === "done" ? "border-emerald-200 bg-emerald-50" : m.state === "current" ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200" : "border-slate-200 bg-white";
              const dot = m.state === "done" ? "bg-emerald-500" : m.state === "current" ? "bg-blue-600" : "bg-slate-300";
              return (
                <div key={m.day} className={`rounded-2xl border p-4 ${tone}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} /><span className="text-sm font-bold text-slate-900">{m.day}</span>
                    <span className="text-sm font-semibold text-slate-600">· {m.title}</span>
                    {m.state === "current" && <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Now</span>}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decisions */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900">What I need from you</h2>
          <ul className="mt-3 space-y-2">
            {DECISIONS.map((d) => (
              <li key={d.item} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-sm text-slate-800">{d.item}</span>
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">{d.due}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Updates */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900">Recent updates</h2>
          <ol className="mt-3">
            {UPDATES.map((u, i) => (
              <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                {i !== UPDATES.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200" />}
                <span className={`relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${kindDot[u.kind]}`} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{kindLabel[u.kind]}</span><span className="text-[11px] text-slate-400">· {u.when}</span></div>
                  <p className="text-sm text-slate-700">{u.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">Live status · maintained by Kohron Burton · updated weekly<br />Figures shown are illustrative until confirmed on-site.</p>
      </div>

      {emergency && <EmergencyPanel onClose={() => setEmergency(false)} isLoggedIn={isLoggedIn} />}
    </div>
  );
}
