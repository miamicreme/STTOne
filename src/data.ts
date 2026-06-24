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
  | 'architecture'
  | 'newhire'
  | 'drive'
  | 'integration'
  | 'fleet'
  | 'projects'
  | 'portal'

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

/* ------------------------------------------------------------------ */
/* New Hire Automation                                                 */
/* ------------------------------------------------------------------ */

export interface WorkflowStep {
  key: string
  label: string
  detail: string
  system: string
}

export const newHireSteps: WorkflowStep[] = [
  { key: 'paychex', label: 'Paychex worker received', detail: 'worker.created webhook ingested', system: 'Paychex' },
  { key: 'validate', label: 'Fields validated', detail: 'I-9, W-4, direct deposit, contact checks', system: 'Integration Layer' },
  { key: 'drive', label: 'Drive docs matched', detail: 'Certifications & license images linked', system: 'Google Drive' },
  { key: 'profile', label: 'PenguinData profile created', detail: 'Electronic personnel file provisioned', system: 'PenguinData' },
  { key: 'crew', label: 'Crew defaults applied', detail: 'Department, supervisor & crew mapped', system: 'PenguinData' },
  { key: 'vehicle', label: 'Vehicle eligibility check', detail: 'License class vs. asset requirements', system: 'Fleet' },
  { key: 'notify', label: 'Manager notified', detail: 'Supervisor alert dispatched', system: 'PenguinData' },
  { key: 'audit', label: 'Audit log committed', detail: 'Immutable onboarding record written', system: 'Audit & Staging' },
]

/** Candidate worker shown in the onboarding panel. */
export const sampleNewHire = {
  name: 'Marcus Delgado',
  role: 'Fiber Splice Technician',
  region: 'SW Florida',
  crew: 'SW FL Fiber Crew 3',
  supervisor: 'D. Okafor',
  paychexId: 'PX-44128',
  startDate: '2026-06-30',
}

export const newHireStats: KPI[] = [
  { label: 'Avg Onboarding Cycle', value: '2.4 days', delta: '-0.6d', trend: 'down', hint: 'Down from 3.0d' },
  { label: 'Pending Starts', value: '6', delta: 'this week', trend: 'flat' },
  { label: 'Required Docs Complete', value: '83%', delta: '+5%', trend: 'up' },
  { label: 'Failed Syncs Today', value: '2', delta: 'routed to queue', trend: 'flat' },
]

/* ------------------------------------------------------------------ */
/* Google Drive Cleanup Center                                         */
/* ------------------------------------------------------------------ */

export interface FileVolume {
  label: string
  value: number
  tone: 'neutral' | 'warn' | 'good' | 'danger'
  hint: string
}

export const fileVolumes: FileVolume[] = [
  { label: 'Total Files', value: 58412, tone: 'neutral', hint: 'Across all shared drives' },
  { label: 'Duplicates', value: 7936, tone: 'warn', hint: 'Candidate copies to merge' },
  { label: 'HR Docs', value: 2184, tone: 'neutral', hint: 'Paychex-bound' },
  { label: 'Fleet Docs', value: 1062, tone: 'neutral', hint: 'PenguinData-bound' },
  { label: 'Project Docs', value: 10447, tone: 'neutral', hint: 'Largest domain' },
  { label: 'Finance-Sensitive', value: 734, tone: 'danger', hint: 'Restricted handling' },
  { label: 'Archive-Ready', value: 12330, tone: 'good', hint: 'Cold storage candidates' },
  { label: 'Migration-Ready', value: 3860, tone: 'good', hint: 'Classified & mapped' },
]

export interface DomainSlice {
  name: string
  value: number
  color: string
}

export const driveByDomain: DomainSlice[] = [
  { name: 'Projects', value: 10447, color: '#38bdf8' },
  { name: 'Archive', value: 12330, color: '#64748b' },
  { name: 'HR', value: 2184, color: '#22c55e' },
  { name: 'Fleet', value: 1062, color: '#a78bfa' },
  { name: 'Finance', value: 734, color: '#f59e0b' },
  { name: 'Duplicates', value: 7936, color: '#ef4444' },
  { name: 'Uncategorized', value: 23719, color: '#334155' },
]

export interface DuplicateGroup {
  name: string
  copies: number
  domain: string
  sizeMb: number
  recommendation: string
}

export const duplicateGroups: DuplicateGroup[] = [
  { name: 'Employee_Roster_MASTER (v1–v9)', copies: 9, domain: 'HR', sizeMb: 14, recommendation: 'Keep newest, archive rest' },
  { name: 'Fleet_Maintenance_Log_2024', copies: 6, domain: 'Fleet', sizeMb: 31, recommendation: 'Merge into PenguinData' },
  { name: 'Eureka_Asbuilts_FINAL_final', copies: 5, domain: 'Projects', sizeMb: 612, recommendation: 'Keep PDF, drop scans' },
  { name: 'Payroll_Adjustments_Q1', copies: 4, domain: 'Finance', sizeMb: 8, recommendation: 'Restricted — review first' },
  { name: 'Ohio_Crew_Timesheets', copies: 7, domain: 'HR', sizeMb: 22, recommendation: 'Consolidate by week' },
  { name: 'Truck_Inspection_Photos', copies: 12, domain: 'Fleet', sizeMb: 940, recommendation: 'Dedupe by EXIF hash' },
]

export interface PermissionRisk {
  scope: string
  detail: string
  level: ExceptionSeverity
  files: number
}

export const permissionRisks: PermissionRisk[] = [
  { scope: 'Anyone with link', detail: 'Finance-sensitive folder shared link-public', level: 'high', files: 214 },
  { scope: 'External domain', detail: 'Former subcontractor retains edit access', level: 'high', files: 86 },
  { scope: 'Org-wide edit', detail: 'HR roster editable by all employees', level: 'medium', files: 142 },
  { scope: 'Stale owner', detail: 'Files owned by deactivated accounts', level: 'medium', files: 519 },
  { scope: 'No expiry', detail: 'Project share links without expiration', level: 'low', files: 1130 },
]

export interface MigrationDomain {
  domain: string
  target: string
  progress: number
  files: number
}

export const migrationQueue: MigrationDomain[] = [
  { domain: 'HR', target: 'Paychex', progress: 78, files: 2184 },
  { domain: 'Fleet', target: 'PenguinData', progress: 64, files: 1062 },
  { domain: 'Projects', target: 'PenguinData', progress: 53, files: 10447 },
  { domain: 'Finance', target: 'QuickBooks', progress: 46, files: 734 },
]

/* ------------------------------------------------------------------ */
/* Integration Health                                                  */
/* ------------------------------------------------------------------ */

export interface SystemCard {
  name: string
  status: SystemStatus
  detail: string
  uptime: string
  lastSync: string
}

export const systemCards: SystemCard[] = [
  { name: 'Paychex', status: 'healthy', detail: 'Worker master — source of truth', uptime: '99.98%', lastSync: '34s ago' },
  { name: 'PenguinData', status: 'healthy', detail: 'Ops, dispatch & fleet', uptime: '99.91%', lastSync: '1m ago' },
  { name: 'QuickBooks', status: 'warning', detail: 'Job-code mapping degraded', uptime: '99.40%', lastSync: '12m ago' },
  { name: 'Google Drive', status: 'active', detail: 'Cleanup scan in progress', uptime: '—', lastSync: 'streaming' },
]

export const seedIntegrationEvents: IntegrationEvent[] = [
  { id: 'EV-9001', system: 'Paychex', message: 'worker.updated — 3 profiles reconciled', level: 'success', time: '10:58' },
  { id: 'EV-9002', system: 'QuickBooks', message: 'invoice.sync — job code ST-EUR-04 unmapped', level: 'warning', time: '10:54' },
  { id: 'EV-9003', system: 'PenguinData', message: 'dispatch.update — Crew 7 reassigned', level: 'info', time: '10:49' },
  { id: 'EV-9004', system: 'Google Drive', message: 'scan.batch — 1,204 files classified', level: 'info', time: '10:42' },
  { id: 'EV-9005', system: 'QuickBooks', message: 'vendor.bill — trench-unit account error', level: 'error', time: '10:31' },
  { id: 'EV-9006', system: 'Paychex', message: 'webhook.ack — onboarding packet received', level: 'success', time: '10:20' },
]

export interface ExceptionTaxonomy {
  category: string
  count: number
  key: ExceptionCategory
}

export const exceptionTaxonomy: ExceptionTaxonomy[] = [
  { category: 'Missing field', count: 4, key: 'missing-field' },
  { category: 'ID mismatch', count: 3, key: 'id-mismatch' },
  { category: 'Duplicate', count: 2, key: 'duplicate' },
  { category: 'Accounting map', count: 2, key: 'accounting-map' },
]

/* ------------------------------------------------------------------ */
/* Field Ops / Fleet                                                   */
/* ------------------------------------------------------------------ */

export interface FleetStatus {
  status: string
  count: number
  color: string
}

export const fleetHealth: FleetStatus[] = [
  { status: 'Available', count: 41, color: '#22c55e' },
  { status: 'In Use', count: 19, color: '#38bdf8' },
  { status: 'Maintenance Due', count: 7, color: '#f59e0b' },
  { status: 'Out of Service', count: 4, color: '#ef4444' },
]

export const fleetKpis: KPI[] = [
  { label: 'Fleet Utilization', value: '81%', delta: '+3%', trend: 'up' },
  { label: 'Open Work Orders', value: '146', delta: '-12', trend: 'down' },
  { label: 'Maintenance Due (7d)', value: '7', delta: 'schedule now', trend: 'flat' },
  { label: 'Dispatch Exceptions', value: '5', delta: 'review', trend: 'flat' },
]

export interface MaintenanceItem {
  asset: string
  type: string
  region: string
  dueIn: string
  severity: ExceptionSeverity
}

export const overdueMaintenance: MaintenanceItem[] = [
  { asset: 'F-214 Bucket Truck', type: 'Hydraulic inspection', region: 'SW Florida', dueIn: 'Overdue 4d', severity: 'high' },
  { asset: 'T-009 Trench Unit', type: 'Track service', region: 'Nevada', dueIn: 'Overdue 2d', severity: 'high' },
  { asset: 'V-118 Splice Van', type: 'Oil & DOT', region: 'Ohio', dueIn: 'Due tomorrow', severity: 'medium' },
  { asset: 'F-077 Aerial Lift', type: 'Annual cert', region: 'SW Florida', dueIn: 'Due in 3d', severity: 'medium' },
  { asset: 'P-031 Pickup', type: 'Tire rotation', region: 'Central FL', dueIn: 'Due in 5d', severity: 'low' },
  { asset: 'G-204 Generator', type: 'Load test', region: 'Fort Myers HQ', dueIn: 'Due in 6d', severity: 'low' },
  { asset: 'T-012 Trailer', type: 'Brake check', region: 'Gulf Coast', dueIn: 'Due in 7d', severity: 'low' },
]

export interface Crew {
  name: string
  region: string
  lead: string
  members: number
  assignment: string
  status: 'on-site' | 'mobilizing' | 'standby'
}

export const crewBoard: Crew[] = [
  { name: 'SW FL Fiber Crew 3', region: 'SW Florida', lead: 'D. Okafor', members: 5, assignment: 'Fort Myers MDU Install', status: 'on-site' },
  { name: 'Ohio Aerial Crew 2', region: 'Ohio', lead: 'J. Reilly', members: 6, assignment: 'Neighborhood Upgrade', status: 'on-site' },
  { name: 'Nevada UG Crew 1', region: 'Nevada', lead: 'M. Castillo', members: 4, assignment: 'Eureka Fiber Expansion', status: 'mobilizing' },
  { name: 'Cape Coral Repair Crew', region: 'SW Florida', lead: 'A. Nguyen', members: 4, assignment: 'Fiber Remediation', status: 'on-site' },
  { name: 'Naples Wireless Crew', region: 'Central FL', lead: 'P. Sharma', members: 3, assignment: 'Small Cell Build', status: 'standby' },
  { name: 'HQ Warehouse Team', region: 'Fort Myers HQ', lead: 'L. Brooks', members: 5, assignment: 'Asset Baseline', status: 'on-site' },
]

/* ------------------------------------------------------------------ */
/* Project Portfolio                                                   */
/* ------------------------------------------------------------------ */

export type ProjectPhase = 'design' | 'build' | 'qc' | 'closeout'
export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'active'

export interface Project {
  name: string
  region: string
  type: string
  complete: number | null
  phase: ProjectPhase
  status: ProjectStatus
  issue: string
}

export const projects: Project[] = [
  {
    name: 'Eureka Fiber Expansion',
    region: 'Nevada',
    type: 'Underground',
    complete: 62,
    phase: 'build',
    status: 'blocked',
    issue: 'Billing hold: customer job code missing in QuickBooks',
  },
  {
    name: 'Ohio Neighborhood Upgrade',
    region: 'Ohio',
    type: 'Aerial',
    complete: 81,
    phase: 'qc',
    status: 'at-risk',
    issue: 'Crew assignment gap — supervisor absence',
  },
  {
    name: 'Fort Myers MDU Install Program',
    region: 'SW Florida',
    type: 'Fulfillment',
    complete: 91,
    phase: 'closeout',
    status: 'at-risk',
    issue: 'Two new hires pending vehicle qualification',
  },
  {
    name: 'Cape Coral Fiber Remediation',
    region: 'SW Florida',
    type: 'Repair',
    complete: 48,
    phase: 'build',
    status: 'at-risk',
    issue: 'Duplicate work orders from spreadsheet import',
  },
  {
    name: 'Naples Small Cell Build',
    region: 'Florida',
    type: 'Wireless',
    complete: 37,
    phase: 'design',
    status: 'blocked',
    issue: 'Permit doc still in Drive only',
  },
  {
    name: 'Warehouse Asset Baseline',
    region: 'Fort Myers HQ',
    type: 'Internal',
    complete: null,
    phase: 'build',
    status: 'active',
    issue: 'Trailer + trench-unit serial mismatch',
  },
]

/* ------------------------------------------------------------------ */
/* CEO / Board View                                                    */
/* ------------------------------------------------------------------ */

export const boardKpis: KPI[] = [
  { label: 'Duplicate Entry Reduction', value: '61%', delta: 'vs. baseline', trend: 'up', hint: 'Paychex dedupe' },
  { label: 'Legacy Files Classified', value: '41,280', delta: '71% of drive', trend: 'up', hint: 'Audit progress' },
  { label: 'Admin Hours Saved / mo', value: '126', delta: '+18 MoM', trend: 'up', hint: 'Automation' },
  { label: 'Projects Behind Schedule', value: '3', delta: 'of 17', trend: 'down', hint: 'Recovering' },
  { label: 'Onboarding Cycle', value: '2.4 days', delta: '-0.6d', trend: 'down', hint: 'Was 3.0d' },
  { label: 'Est. Annual Impact', value: '$189K', delta: 'admin + leakage', trend: 'up', hint: 'Modeled' },
]

export type RiskLevel = 0 | 1 | 2 | 3

export interface RiskRow {
  region: string
  payroll: RiskLevel
  fleet: RiskLevel
  billing: RiskLevel
  docs: RiskLevel
  schedule: RiskLevel
}

export const riskDimensions = ['Payroll', 'Fleet', 'Billing', 'Docs', 'Schedule'] as const

export const riskHeatmap: RiskRow[] = [
  { region: 'SW Florida', payroll: 1, fleet: 2, billing: 1, docs: 2, schedule: 1 },
  { region: 'Ohio', payroll: 0, fleet: 1, billing: 1, docs: 1, schedule: 2 },
  { region: 'Nevada', payroll: 1, fleet: 2, billing: 3, docs: 1, schedule: 2 },
  { region: 'Central FL', payroll: 0, fleet: 1, billing: 2, docs: 3, schedule: 1 },
  { region: 'Fort Myers HQ', payroll: 1, fleet: 1, billing: 0, docs: 1, schedule: 0 },
  { region: 'Gulf Coast', payroll: 0, fleet: 1, billing: 1, docs: 1, schedule: 1 },
]

export const riskLabels: Record<RiskLevel, string> = {
  0: 'Nominal',
  1: 'Watch',
  2: 'Elevated',
  3: 'Critical',
}

export type MilestoneStatus = 'done' | 'in-progress' | 'planned'

export interface Milestone {
  title: string
  detail: string
  status: MilestoneStatus
  quarter: string
}

export const transformationRoadmap: Milestone[] = [
  {
    title: 'Paychex set as HR source of truth',
    detail: 'Worker master consolidated; duplicate records reconciled.',
    status: 'done',
    quarter: 'Q1 2026',
  },
  {
    title: 'PenguinData onboarding automation live',
    detail: 'New-hire pipeline provisions profiles, crews & vehicle checks.',
    status: 'done',
    quarter: 'Q1 2026',
  },
  {
    title: 'Google Drive audit & classification',
    detail: '58,412 files indexed; 41,280 classified, 7,936 duplicates flagged.',
    status: 'in-progress',
    quarter: 'Q2 2026',
  },
  {
    title: 'QuickBooks job-code reconciliation',
    detail: 'Customer/job-code mapping to clear billing holds.',
    status: 'in-progress',
    quarter: 'Q2 2026',
  },
  {
    title: 'Legacy Drive migration cutover',
    detail: 'HR → Paychex, Fleet/Projects → PenguinData, Finance → QuickBooks.',
    status: 'planned',
    quarter: 'Q3 2026',
  },
  {
    title: 'Unified exception governance',
    detail: 'Single queue with SLAs across all four systems.',
    status: 'planned',
    quarter: 'Q3 2026',
  },
]

/* ------------------------------------------------------------------ */
/* Employee Portal                                                     */
/* ------------------------------------------------------------------ */

export interface EmployeeProfile {
  name: string
  role: string
  employeeId: string
  region: string
  crew: string
  supervisor: string
  truck: string
  tenure: string
  assignment: string
}

export const employeeProfile: EmployeeProfile = {
  name: 'Andre Whitfield',
  role: 'Fiber Splice Technician',
  employeeId: 'STT-0418',
  region: 'SW Florida',
  crew: 'SW FL Fiber Crew 3',
  supervisor: 'D. Okafor',
  truck: 'F-214',
  tenure: '3.2 yrs',
  assignment: 'Fort Myers MDU Install Program',
}

export const employeeStats: KPI[] = [
  { label: 'Hours This Week', value: '32.5', delta: '/ 40 sched', trend: 'flat' },
  { label: 'Certifications Valid', value: '4', delta: 'of 6', trend: 'flat', hint: '2 need attention' },
  { label: 'Docs Outstanding', value: '3', delta: 'action needed', trend: 'flat' },
  { label: 'Work Orders Closed', value: '11', delta: 'this week', trend: 'up' },
]

export type CertStatus = 'valid' | 'expiring' | 'expired'

export interface Certification {
  name: string
  status: CertStatus
  detail: string
}

export const employeeCerts: Certification[] = [
  { name: 'OSHA 10', status: 'valid', detail: 'Valid through Mar 2027' },
  { name: 'Fiber Splicing (BICSI)', status: 'valid', detail: 'Valid through Aug 2026' },
  { name: 'First Aid / CPR', status: 'valid', detail: 'Valid through Nov 2026' },
  { name: 'CDL Class B', status: 'expiring', detail: 'Expires in 18 days — renew now' },
  { name: 'Aerial Lift Operator', status: 'expiring', detail: 'Expires in 6 days — schedule recert' },
  { name: 'Confined Space Entry', status: 'expired', detail: 'Lapsed — blocks underground assignment' },
]

export type DocStatus = 'complete' | 'pending' | 'action'

export interface EmployeeDoc {
  name: string
  status: DocStatus
  detail: string
}

export const employeeDocs: EmployeeDoc[] = [
  { name: 'I-9 Verification', status: 'complete', detail: 'On file in Paychex' },
  { name: 'W-4 Withholding', status: 'complete', detail: 'On file in Paychex' },
  { name: 'Direct Deposit', status: 'complete', detail: 'Verified' },
  { name: 'Vehicle Use Agreement', status: 'action', detail: 'Required for F-214 — sign to clear hold' },
  { name: 'Safety Handbook Ack', status: 'pending', detail: 'Due before next shift' },
  { name: '2026 Benefits Election', status: 'pending', detail: 'Open enrollment closes soon' },
]

export type ShiftStatus = 'done' | 'active' | 'upcoming'

export interface ShiftTask {
  time: string
  title: string
  detail: string
  status: ShiftStatus
}

export const employeeSchedule: ShiftTask[] = [
  { time: '06:30', title: 'Yard check-in & truck inspection', detail: 'F-214 pre-trip DOT walkaround', status: 'done' },
  { time: '07:15', title: 'Mobilize to MDU site', detail: 'Fort Myers — Building C riser', status: 'done' },
  { time: '08:00', title: 'Riser splicing — Bldg C', detail: '288-count distribution closures', status: 'active' },
  { time: '12:00', title: 'Lunch', detail: '30 min', status: 'upcoming' },
  { time: '13:00', title: 'OTDR testing & closures', detail: 'Validate splice loss budget', status: 'upcoming' },
  { time: '15:30', title: 'Daily production report', detail: 'Log footage & work-order closeout', status: 'upcoming' },
]

export interface TruckDetail {
  unit: string
  type: string
  status: SystemStatus
  mileage: string
  nextService: string
  fuel: string
}

export const employeeTruck: TruckDetail = {
  unit: 'F-214',
  type: 'Bucket Truck — Altec AT40',
  status: 'warning',
  mileage: '84,210 mi',
  nextService: 'Hydraulic inspection overdue 4d',
  fuel: '⅝ tank',
}

/* -------------------------------------------------------------------- */
/* Executive leakage model (above-the-fold headline)                    */
/* -------------------------------------------------------------------- */

export interface LeakageLine {
  label: string
  amount: number // annual USD
  driver: string // the evidence behind the figure
  system: string
}

/** Illustrative, simulated — anchored to STT's public scale and the seeded exceptions. */
export const leakageLines: LeakageLine[] = [
  {
    label: 'Onboarding & data-entry admin',
    amount: 72000,
    driver: '126 admin hrs/mo reclaimed @ ~$48/hr loaded',
    system: 'Paychex → PenguinData',
  },
  {
    label: 'Billing leakage — unmapped job codes',
    amount: 82000,
    driver: 'Held + mis-coded work across active programs',
    system: 'QuickBooks',
  },
  {
    label: 'Payroll rework & overpayment',
    amount: 38000,
    driver: 'Duplicate / mismatched worker records',
    system: 'Paychex',
  },
  {
    label: 'Drive sprawl — storage & retrieval drag',
    amount: 22000,
    driver: '7,936 duplicate files + permission cleanup',
    system: 'Google Drive',
  },
]

/** $214,000 — the four lines reconcile exactly to the headline. */
export const leakageTotal = leakageLines.reduce((sum, l) => sum + l.amount, 0)

/* -------------------------------------------------------------------- */
/* Guided auto-tour                                                     */
/* -------------------------------------------------------------------- */

export interface TourScene {
  page: PageKey
  caption: string
  /** Dwell time on this scene, in ms. */
  ms: number
  /** If set, auto-trigger the New Hire pipeline shortly after the scene loads. */
  run?: 'success' | 'failure'
}

export const tourScenes: TourScene[] = [
  { page: 'home', caption: 'The number that matters: ~$214K/yr in preventable leakage', ms: 7600 },
  { page: 'board', caption: 'The board view — risk by region and the transformation roadmap', ms: 7800 },
  { page: 'newhire', caption: 'New-hire automation: Paychex → PenguinData in a single pass', ms: 10500, run: 'success' },
  { page: 'newhire', caption: 'The catch — a hire with no CDL is stopped before dispatch', ms: 9800, run: 'failure' },
  { page: 'integration', caption: 'That blocked hire lands here as a live exception — nothing fails silently', ms: 7400 },
  { page: 'architecture', caption: 'One governed layer between your systems — validate, de-dupe, audit, never fail silently', ms: 8200 },
  { page: 'drive', caption: 'The Google Drive "junk drawer," classified, de-duped, and de-risked', ms: 7000 },
  { page: 'projects', caption: 'Portfolio health across every active program', ms: 6400 },
  { page: 'portal', caption: 'And the field tech’s own portal — schedule, truck, and certs in one place', ms: 6800 },
  { page: 'home', caption: 'Keep the systems of record. Add one governed layer between them. Nothing fails silently.', ms: 6000 },
]

/* ------------------------------------------------------------------ */
/* Integration Architecture                                            */
/* ------------------------------------------------------------------ */

export interface SystemOfRecord {
  system: string
  owns: string
  role: string
}

/** The architectural POV: one authoritative owner per data domain. */
export const systemsOfRecord: SystemOfRecord[] = [
  { system: 'Paychex', owns: 'People', role: 'Source of truth — workers, onboarding, payroll' },
  { system: 'PenguinData', owns: 'Operations', role: 'Workforce, dispatch, fleet & work orders' },
  { system: 'QuickBooks', owns: 'Finance', role: 'Invoicing, job-cost & payables' },
  { system: 'Google Drive', owns: 'Documents', role: 'Legacy repository → staged & governed' },
]

export type PipelineTrigger = 'webhook' | 'scheduled' | 'event'

export interface PipelineJob {
  name: string
  trigger: PipelineTrigger
  flow: string
  cadence: string
  lastRun: string
  throughput: string
  health: SystemStatus
}

/** The automated pipelines that make the ecosystem run — the "highly automated" proof. */
export const pipelineJobs: PipelineJob[] = [
  {
    name: 'Worker sync',
    trigger: 'webhook',
    flow: 'Paychex → PenguinData',
    cadence: 'Real-time',
    lastRun: '42s ago',
    throughput: '118 workers in sync',
    health: 'healthy',
  },
  {
    name: 'New-hire onboarding',
    trigger: 'event',
    flow: 'Paychex → Staging → PenguinData → Fleet',
    cadence: 'On hire',
    lastRun: '2h ago',
    throughput: '6 provisioned this week',
    health: 'healthy',
  },
  {
    name: 'Job-cost sync',
    trigger: 'scheduled',
    flow: 'PenguinData → QuickBooks',
    cadence: 'Every 15 min',
    lastRun: '8m ago',
    throughput: '214 entries/day',
    health: 'warning',
  },
  {
    name: 'Drive classification',
    trigger: 'scheduled',
    flow: 'Google Drive → Staging',
    cadence: 'Hourly',
    lastRun: 'streaming',
    throughput: '58,412 files indexed',
    health: 'active',
  },
  {
    name: 'Dedupe & merge',
    trigger: 'scheduled',
    flow: 'Staging → PenguinData',
    cadence: 'Nightly',
    lastRun: '06:00',
    throughput: '7,936 candidates resolved',
    health: 'healthy',
  },
  {
    name: 'Payroll reconciliation',
    trigger: 'scheduled',
    flow: 'PenguinData → Paychex',
    cadence: 'Daily 05:30',
    lastRun: '05:30',
    throughput: '97.9% auto-matched',
    health: 'healthy',
  },
]

export interface GovernanceGuard {
  name: string
  prevents: string
  scope: string
}

/** Automated data-entry guards — the JD's "crews can't re-clutter the system" requirement. */
export const governanceGuards: GovernanceGuard[] = [
  {
    name: 'Required-field validation',
    prevents: 'Incomplete onboarding packets reaching PenguinData',
    scope: 'Ingest',
  },
  {
    name: 'Dedupe-on-write',
    prevents: 'Duplicate worker, asset & work-order records',
    scope: 'Staging',
  },
  {
    name: 'Schema & format enforcement',
    prevents: 'Malformed IDs and mismatched job codes',
    scope: 'Ingest',
  },
  {
    name: 'Source-of-truth lock',
    prevents: 'Worker edits made anywhere outside Paychex',
    scope: 'Identity',
  },
  {
    name: 'Permission policy',
    prevents: 'Link-public finance docs & stale external access',
    scope: 'Drive',
  },
  {
    name: 'Exception routing',
    prevents: 'Silent failures — everything routes to a human queue',
    scope: 'Pipeline',
  },
]
