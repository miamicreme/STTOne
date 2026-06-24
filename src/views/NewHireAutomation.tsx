import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Check,
  Loader2,
  X,
  CircleDashed,
  AlertTriangle,
  UserPlus,
  ShieldAlert,
  ArrowRight,
  ScrollText,
} from 'lucide-react'
import { Card, SectionHeader, CardHeader, EmptyState } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { Hint } from '../components/Hint'
import { newHireSteps, newHireStats, sampleNewHire, type ExceptionItem } from '../data'
import { useApp } from '../state/AppContext'
import { nowStamp } from '../utils/time'

type StepState = 'pending' | 'running' | 'done' | 'error' | 'skipped'

const STEP_MS = 700
const FAIL_STEP = 5 // "Vehicle eligibility check"

export function NewHireAutomation() {
  const { addAudit, addException, addEvent, incrementRun, auditLog, setPage, nhCommand } = useApp()

  const [states, setStates] = useState<StepState[]>(() => newHireSteps.map(() => 'pending'))
  const [running, setRunning] = useState(false)
  const [failureMode, setFailureMode] = useState(false)
  const [result, setResult] = useState<'success' | 'blocked' | null>(null)
  const timers = useRef<number[]>([])
  const lastNhNonce = useRef<number>(nhCommand?.nonce ?? 0)

  // Clean up any pending timers on unmount.
  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [])

  // The guided tour drives the pipeline via a one-shot command in shared state.
  // Only act on a strictly newer nonce, so a stale command never re-fires on mount.
  useEffect(() => {
    if (!nhCommand) return
    if (nhCommand.nonce <= lastNhNonce.current) return
    lastNhNonce.current = nhCommand.nonce
    const failure = nhCommand.kind === 'failure'
    setFailureMode(failure)
    run(failure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nhCommand])

  function setStep(index: number, value: StepState) {
    setStates((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function run(forceFailure?: boolean) {
    if (running) return
    // Reset
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setStates(newHireSteps.map(() => 'pending'))
    setResult(null)
    setRunning(true)

    const willFail = forceFailure ?? failureMode

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      timers.current.push(id)
    }

    let t = 0
    for (let i = 0; i < newHireSteps.length; i++) {
      const index = i

      // Mark running
      schedule(() => setStep(index, 'running'), t)
      t += STEP_MS

      // Resolve step
      schedule(() => {
        if (willFail && index === FAIL_STEP) {
          setStep(index, 'error')
          // Skip the rest
          for (let j = index + 1; j < newHireSteps.length; j++) {
            setStep(j, 'skipped')
          }
          finishBlocked()
        } else if (willFail && index > FAIL_STEP) {
          // already skipped — no-op
        } else {
          setStep(index, 'done')
          if (index === newHireSteps.length - 1) {
            finishSuccess()
          }
        }
      }, t)

      if (willFail && index === FAIL_STEP) break
      t += 60
    }
  }

  function finishSuccess() {
    setRunning(false)
    setResult('success')
    incrementRun()
    const stamp = nowStamp()
    addAudit({
      id: `AUD-${Date.now()}`,
      worker: sampleNewHire.name,
      outcome: 'success',
      message: 'Onboarding completed — profile active, crew & vehicle assigned.',
      timestamp: stamp,
    })
    addEvent({
      id: `EV-${Date.now()}`,
      system: 'PenguinData',
      message: `onboarding.complete — ${sampleNewHire.name} provisioned`,
      level: 'success',
      time: stamp.slice(0, 5),
    })
  }

  function finishBlocked() {
    setRunning(false)
    setResult('blocked')
    incrementRun()
    const stamp = nowStamp()
    const exc: ExceptionItem = {
      id: `EXC-${Date.now()}`,
      title: `Assignment blocked — ${sampleNewHire.name}`,
      detail: 'Missing driver license class; routed to exception queue.',
      severity: 'high',
      source: 'Fleet',
      category: 'credential',
      retryable: false,
      createdAt: stamp.slice(0, 5),
    }
    addException(exc)
    addAudit({
      id: `AUD-${Date.now()}`,
      worker: sampleNewHire.name,
      outcome: 'blocked',
      message: 'Vehicle eligibility failed — missing driver license class. Routed to exception queue.',
      timestamp: stamp,
    })
    addEvent({
      id: `EV-${Date.now()}`,
      system: 'Fleet',
      message: `eligibility.blocked — ${sampleNewHire.name} missing CDL class`,
      level: 'error',
      time: stamp.slice(0, 5),
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {newHireStats.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: candidate + controls + workflow */}
        <div className="space-y-6 lg:col-span-2">
          {/* Candidate card */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-base font-bold text-white">
                  {sampleNewHire.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">{sampleNewHire.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {sampleNewHire.role} · {sampleNewHire.region}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Paychex ID" value={sampleNewHire.paychexId} />
                <Field label="Crew" value={sampleNewHire.crew} />
                <Field label="Supervisor" value={sampleNewHire.supervisor} />
                <Field label="Start" value={sampleNewHire.startDate} />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-4">
              <button
                onClick={() => run()}
                disabled={running}
                data-tour="runhire"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-2.5 text-sm font-semibold text-base-950 shadow-[0_8px_24px_-8px_rgba(56,189,248,0.8)] transition-all hover:shadow-[0_10px_28px_-6px_rgba(56,189,248,0.95)] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Run New Hire Automation
                  </>
                )}
              </button>

              <label
                data-tour="failtoggle"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm text-slate-300"
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={failureMode}
                  disabled={running}
                  onClick={() => setFailureMode((v) => !v)}
                  className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                    failureMode ? 'bg-rose-500/70' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      failureMode ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="flex items-center gap-1.5">
                  <ShieldAlert
                    className={`h-3.5 w-3.5 ${failureMode ? 'text-rose-400' : 'text-slate-500'}`}
                  />
                  Simulate failure variant
                  <Hint text="Halts the pipeline at Vehicle Eligibility (step 6) to demonstrate how a missing CDL credential routes the worker to the exception queue instead of blocking the entire onboarding flow." />
                </span>
              </label>
            </div>

            {/* Result banner */}
            {result === 'success' && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300 animate-fade-in">
                <Check className="h-4 w-4" />
                Onboarding complete — {sampleNewHire.name} is active in PenguinData with crew and
                vehicle assigned.
              </div>
            )}
            {result === 'blocked' && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300 animate-fade-in">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>⚠ Assignment blocked: Missing driver license class — routed to exception queue.</span>
                <button
                  onClick={() => setPage('integration')}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-200 underline-offset-2 hover:underline"
                >
                  View on Integration Health
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </Card>

          {/* Workflow steps */}
          <Card>
            <SectionHeader
              title="Automation Pipeline"
              subtitle="Paychex → Integration Layer → PenguinData → Fleet → Audit"
              icon={<UserPlus className="h-4 w-4" />}
            />
            <ol className="space-y-2">
              {newHireSteps.map((step, i) => (
                <StepItem key={step.key} index={i} step={step} state={states[i]} />
              ))}
            </ol>
          </Card>
        </div>

        {/* Right: audit timeline */}
        <Card padded={false} className="flex flex-col">
          <CardHeader
            title="Audit Timeline"
            icon={<ScrollText className="h-4 w-4 text-accent" />}
            hint="Immutable record of every automation run — worker name, outcome, and resolution path. Appended on each run for compliance and audit trail purposes."
            action={<span className="text-[11px] text-slate-500">{auditLog.length} entries</span>}
          />
          <div className="max-h-[36rem] flex-1 space-y-3 overflow-y-auto p-4">
            {auditLog.length === 0 ? (
              <EmptyState
                icon={<CircleDashed className="h-8 w-8" />}
                title="No runs yet"
                subtitle="Run the automation to append an audit record."
              />
            ) : (
              auditLog.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-white/[0.06] bg-base-800/50 p-3 animate-slide-in"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {entry.outcome === 'success' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-sm font-medium text-slate-100">{entry.worker}</span>
                    </div>
                    <span className="text-[11px] tabular text-slate-500">{entry.timestamp}</span>
                  </div>
                  <p className="mt-1 pl-5 text-xs text-slate-400">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-medium text-slate-200">{value}</p>
    </div>
  )
}

function StepItem({
  index,
  step,
  state,
}: {
  index: number
  step: (typeof newHireSteps)[number]
  state: StepState
}) {
  const isBlocked = step.key === 'vehicle' && state === 'error'
  return (
    <li
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        state === 'running'
          ? 'border-accent/40 bg-accent/[0.06]'
          : state === 'error'
            ? 'border-rose-500/30 bg-rose-500/[0.06]'
            : state === 'done'
              ? 'border-white/[0.07] bg-base-800/40'
              : 'border-white/[0.05] bg-transparent'
      }`}
    >
      <StepIndicator state={state} index={index} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm font-medium ${
              state === 'pending' || state === 'skipped' ? 'text-slate-500' : 'text-slate-100'
            }`}
          >
            {step.label}
          </p>
          <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
            {step.system}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {isBlocked ? '⚠ Assignment blocked: Missing driver license class' : step.detail}
        </p>
      </div>
    </li>
  )
}

function StepIndicator({ state, index }: { state: StepState; index: number }) {
  const base = 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'
  switch (state) {
    case 'running':
      return (
        <span className={`${base} bg-accent/15 text-accent`}>
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )
    case 'done':
      return (
        <span className={`${base} bg-emerald-500/15 text-emerald-400`}>
          <Check className="h-4 w-4" />
        </span>
      )
    case 'error':
      return (
        <span className={`${base} bg-rose-500/15 text-rose-400`}>
          <X className="h-4 w-4" />
        </span>
      )
    case 'skipped':
      return (
        <span className={`${base} bg-white/[0.04] text-slate-600`}>
          <CircleDashed className="h-4 w-4" />
        </span>
      )
    default:
      return <span className={`${base} bg-white/[0.04] text-slate-500`}>{index + 1}</span>
  }
}
