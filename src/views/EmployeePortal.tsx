'use client'

import {
  Truck,
  BadgeCheck,
  FileText,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { Card, SectionHeader } from '../components/Card'
import { KPICard } from '../components/KPICard'
import { StatusBadge } from '../components/StatusBadge'
import {
  employeeProfile,
  employeeStats,
  employeeCerts,
  employeeDocs,
  employeeSchedule,
  employeeTruck,
  type CertStatus,
  type DocStatus,
  type ShiftStatus,
} from '../data'
import { useApp } from '../state/AppContext'

const certMeta: Record<CertStatus, { icon: typeof CheckCircle2; cls: string; tone: 'healthy' | 'warning' | 'critical' }> = {
  valid: { icon: CheckCircle2, cls: 'text-emerald-400', tone: 'healthy' },
  expiring: { icon: AlertTriangle, cls: 'text-amber-400', tone: 'warning' },
  expired: { icon: XCircle, cls: 'text-rose-400', tone: 'critical' },
}

const docMeta: Record<DocStatus, { label: string; tone: 'healthy' | 'warning' | 'critical' }> = {
  complete: { label: 'complete', tone: 'healthy' },
  pending: { label: 'pending', tone: 'warning' },
  action: { label: 'action', tone: 'critical' },
}

const shiftMeta: Record<ShiftStatus, string> = {
  done: 'bg-emerald-400 ring-emerald-400/20',
  active: 'bg-accent ring-accent/30 animate-pulse-ring',
  upcoming: 'bg-slate-500 ring-slate-500/20',
}

export function EmployeePortal() {
  const { setPage } = useApp()
  const p = employeeProfile

  return (
    <div className="space-y-6">
      {/* Identity hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-r from-base-850/80 to-base-850/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep font-display text-xl font-bold text-white shadow-lg shadow-accent/25">
              {p.name.split(' ').map((n) => n[0]).join('')}
              <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">{p.name}</h2>
              <p className="text-sm text-slate-400">
                {p.role} · {p.employeeId}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" /> {p.region} · {p.tenure} tenure
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <Field label="Crew" value={p.crew} />
            <Field label="Supervisor" value={p.supervisor} />
            <Field label="Assigned Truck" value={p.truck} />
            <Field label="Today" value={p.assignment} span />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {employeeStats.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's schedule */}
        <Card className="lg:col-span-2" padded={false} tourId="portal-schedule">
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-accent" />
              <h2 className="font-display text-[15px] font-semibold text-slate-100">
                Today’s Assignment
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">{p.assignment}</span>
          </div>
          <div className="relative p-4 pl-6">
            <div className="absolute bottom-6 left-[26px] top-6 w-px bg-white/[0.08]" />
            <ul className="space-y-4">
              {employeeSchedule.map((t) => (
                <li key={t.time} className="relative flex gap-4 pl-6">
                  <span
                    className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ${shiftMeta[t.status]}`}
                  />
                  <div className="w-12 shrink-0 text-xs font-semibold tabular text-slate-400">
                    {t.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        t.status === 'upcoming' ? 'text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {t.title}
                      {t.status === 'active' && (
                        <span className="ml-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          In progress
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{t.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* My truck */}
        <Card>
          <SectionHeader title="My Truck" icon={<Truck className="h-4 w-4" />} />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                {employeeTruck.unit}
              </p>
              <p className="text-xs text-slate-400">{employeeTruck.type}</p>
            </div>
            <StatusBadge tone={employeeTruck.status} label={employeeTruck.status} />
          </div>
          <dl className="mt-4 space-y-2.5 border-t border-white/[0.06] pt-4 text-sm">
            <Row label="Mileage" value={employeeTruck.mileage} />
            <Row label="Fuel" value={employeeTruck.fuel} />
            <Row label="Next service" value={employeeTruck.nextService} warn />
          </dl>
          <button
            onClick={() => setPage('fleet')}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            View in Fleet
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Certifications */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent" />
              <h2 className="font-display text-[15px] font-semibold text-slate-100">Certifications</h2>
            </div>
            <span className="text-[11px] text-slate-500">
              {employeeCerts.filter((c) => c.status === 'valid').length}/{employeeCerts.length} valid
            </span>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {employeeCerts.map((c) => {
              const meta = certMeta[c.status]
              const Icon = meta.icon
              return (
                <div key={c.name} className="flex items-center gap-3 p-3.5">
                  <Icon className={`h-4 w-4 shrink-0 ${meta.cls}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.detail}</p>
                  </div>
                  <StatusBadge tone={meta.tone} label={c.status} dot={false} />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Docs needed */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              <h2 className="font-display text-[15px] font-semibold text-slate-100">Documents</h2>
            </div>
            <span className="text-[11px] text-slate-500">
              {employeeDocs.filter((d) => d.status !== 'complete').length} outstanding
            </span>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {employeeDocs.map((d) => {
              const meta = docMeta[d.status]
              return (
                <div key={d.name} className="flex items-center gap-3 p-3.5">
                  {d.status === 'complete' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0 text-amber-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.detail}</p>
                  </div>
                  {d.status === 'complete' ? (
                    <StatusBadge tone="healthy" label="complete" dot={false} />
                  ) : (
                    <button className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/20">
                      {meta.label === 'action' ? 'Resolve' : 'Complete'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value, span = false }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2 sm:col-span-1' : ''}>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-medium text-slate-200">{value}</p>
    </div>
  )
}

function Row({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right font-medium ${warn ? 'text-amber-300' : 'text-slate-200'}`}>
        {value}
      </dd>
    </div>
  )
}
