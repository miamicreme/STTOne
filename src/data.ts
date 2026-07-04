/**
 * Southern Tier Operations Command Center — mock data layer.
 *
 * All values are demo-only simulation values, intentionally anchored to
 * Southern Tier Telecommunications' public scale (multi-state field-construction
 * contractor, ~118 personnel, Fort Myers HQ). Nothing here calls a network.
 */

/* ------------------------------------------------------------------ */
/* Shared types                                                        */
/* ------------------------------------------------------------------ */

export type PageKey =
  | 'home'
  | 'board'
  | 'lead-finder'
  | 'architecture'
  | 'newhire'
  | 'drive'
  | 'integration'
  | 'fleet'
  | 'projects'
  | 'portal'
  | 'project-status'

export type SystemStatus = 'healthy' | 'warning' | 'active' | 'critical'

export type ExceptionSeverity = 'high' | 'medium' | 'low'

export interface KPI {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  hint?: string
}

export interface ExceptionItem {
  id: string
  title: string
  detail: string
  severity: ExceptionSeverity
  source: string
  category: ExceptionCategory
  retryable: boolean
  createdAt: string
}

export type ExceptionCategory =
  | 'missing-field'
  | 'id-mismatch'
  | 'duplicate'
  | 'accounting-map'
  | 'credential'

export interface AuditEntry {
  id: string
  worker: string
  outcome: 'success' | 'blocked'
  message: string
  timestamp: string
}

export interface IntegrationEvent {
  id: string
  system: string
  message: string
  level: 'info' | 'success' | 'warning' | 'error'
  time: string
}

/* ------------------------------------------------------------------ */
/* Executive Home                                                      */
/* ------------------------------------------------------------------ */

export const executiveKpis: KPI[] = [
  { label: 'Active Personnel', value: '118', delta: '+6 MTD', trend: 'up', hint: 'Paychex source of truth' },
  { label: 'Field Crews', value: '29', delta: '+2 WoW', trend: 'up', hint: '6 regions' },
  { label: 'Active Projects', value: '17', delta: '3 at risk', trend: 'flat', hint: 'Portfolio' },
  { label: 'Mobile Assets', value: '64', delta: '81% utilized', trend: 'up', hint: 'Fleet readiness' },
  { label: 'Payroll Sync Health', value: '97.9%', delta: '+0.4%', trend: 'up', hint: 'Paychex ↔ PenguinData' },
  { label: 'Drive Files Indexed', value: '58,412', delta: '+1,204', trend: 'up', hint: 'Legacy cleanup' },
]

export interface PortfolioStack {
  region: string
  underground: number
  aerial: number
  wireless: number
  fulfillment: number
}

export const portfolioByRegion: PortfolioStack[] = [
  { region: 'SW Florida', underground: 3, aerial: 2, wireless: 2, fulfillment: 3 },
  { region: 'Ohio', underground: 1, aerial: 3, wireless: 1, fulfillment: 0 },
  { region: 'Nevada', underground: 2, aerial: 0, wireless: 1, fulfillment: 0 },
  { region: 'Fort Myers HQ', underground: 1, aerial: 0, wireless: 0, fulfillment: 1 },
  { region: 'Central FL', underground: 1, aerial: 0, wireless: 1, fulfillment: 0 },
  { region: 'Gulf Coast', underground: 0, aerial: 1, wireless: 0, fulfillment: 1 },
]

/** Seed exceptions present before any New Hire run. The New Hire flow appends. */
export const seedExceptions: ExceptionItem[] = [
  {
    id: 'EXC-1041',
    title: 'Missing job code — Eureka Fiber Expansion',
    detail: 'Customer job code not mapped in QuickBooks; billing on hold.',
    severity: 'high',
    source: 'QuickBooks',
    category: 'accounting-map',
    retryable: true,
    createdAt: '08:14',
  },
  {
    id: 'EXC-1042',
    title: 'Duplicate worker record — R. Alvarez',
    detail: 'Two PenguinData profiles resolved to one Paychex worker ID.',
    severity: 'medium',
    source: 'PenguinData',
    category: 'duplicate',
    retryable: true,
    createdAt: '08:22',
  },
  {
    id: 'EXC-1043',
    title: 'License class missing — new hire',
    detail: 'Vehicle eligibility blocked pending CDL class verification.',
    severity: 'high',
    source: 'Paychex',
    category: 'credential',
    retryable: false,
    createdAt: '08:39',
  },
  {
    id: 'EXC-1044',
    title: 'ID mismatch — timesheet import',
    detail: 'Employee ID format mismatch between Drive sheet and Paychex.',
    severity: 'medium',
    source: 'Google Drive',
    category: 'id-mismatch',
    retryable: true,
    createdAt: '09:02',
  },
  {
    id: 'EXC-1045',
    title: 'Missing field — direct deposit',
    detail: 'Routing number absent on onboarding packet.',
    severity: 'low',
    source: 'Paychex',
    category: 'missing-field',
    retryable: true,
    createdAt: '09:11',
  },
  {
    id: 'EXC-1046',
    title: 'Accounting map error — vendor bill',
    detail: 'Trench-unit rental vendor not mapped to expense account.',
    severity: 'medium',
    source: 'QuickBooks',
    category: 'accounting-map',
    retryable: true,
    createdAt: '09:27',
  },
  {
    id: 'EXC-1047',
    title: 'Duplicate work orders — Cape Coral',
    detail: 'Spreadsheet import created 4 duplicate work orders.',
    severity: 'medium',
    source: 'PenguinData',
    category: 'duplicate',
    retryable: true,
    createdAt: '09:48',
  },
  {
    id: 'EXC-1048',
    title: 'Missing field — emergency contact',
    detail: 'New hire packet missing required emergency contact.',
    severity: 'low',
    source: 'Paychex',
    category: 'missing-field',
    retryable: true,
    createdAt: '10:03',
  },
  {
    id: 'EXC-1049',
    title: 'ID mismatch — fleet assignment',
    detail: 'Asset tag F-214 mapped to two crew IDs.',
    severity: 'medium',
    source: 'PenguinData',
    category: 'id-mismatch',
    retryable: true,
    createdAt: '10:19',
  },
  {
    id: 'EXC-1050',
    title: 'Missing field — I-9 section 2',
    detail: 'Document verification fields incomplete.',
    severity: 'low',
    source: 'Paychex',
    category: 'missing-field',
    retryable: true,
    createdAt: '10:35',
  },
  {
    id: 'EXC-1051',
    title: 'Accounting map error — small cell',
    detail: 'Naples small-cell permit cost lacks job-cost class.',
    severity: 'low',
    source: 'QuickBooks',
    category: 'accounting-map',
    retryable: true,
    createdAt: '10:52',
  },
]
