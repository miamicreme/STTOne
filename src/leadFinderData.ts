export type SttLeadType =
  | 'Municipal / Public Works'
  | 'Utility / Broadband'
  | 'Transportation / ITS'
  | 'Emergency Services'

export type Priority = 'critical' | 'high' | 'medium'

export interface LeadFinderKpi {
  label: string
  value: string
  delta: string
  hint: string
}

export interface SearchSource {
  name: string
  coverage: string
  signal: string
  cadence: string
}

export interface LeadEvidence {
  label: string
  source: string
  confidence: number
}

export interface SttLeadCandidate {
  id: string
  name: string
  type: SttLeadType
  location: string
  department: string
  fitScore: number
  urgencyScore: number
  budgetSignal: string
  priority: Priority
  trigger: string
  need: string
  sttAngle: string
  nextAction: string
  contactPath: string
  timeline: string
  valueHypothesis: string
  evidence: LeadEvidence[]
  tags: string[]
}

export const leadFinderKpis: LeadFinderKpi[] = [
  {
    label: 'Qualified Leads',
    value: '38',
    delta: '+12 this week',
    hint: 'Ranked by infrastructure fit and outreach readiness',
  },
  {
    label: 'High-Fit Targets',
    value: '14',
    delta: '85+ score',
    hint: 'Municipal, utility, broadband, and field-ops modernization',
  },
  {
    label: 'Public Signals Scanned',
    value: '1,284',
    delta: '6 source classes',
    hint: 'Agendas, RFPs, CIP docs, minutes, grants, and procurement notices',
  },
  {
    label: 'Pipeline Value Hypothesis',
    value: '$3.8M',
    delta: 'illustrative',
    hint: 'Modeled from potential implementation, integration, and support work',
  },
]

export const searchSources: SearchSource[] = [
  {
    name: 'Procurement Portals',
    coverage: 'Bid notices, RFPs, vendor registrations',
    signal: 'Active buying intent',
    cadence: 'Daily',
  },
  {
    name: 'Council Agendas',
    coverage: 'City and county board packets',
    signal: 'Projects before procurement',
    cadence: 'Weekly',
  },
  {
    name: 'Capital Improvement Plans',
    coverage: 'Multi-year infrastructure budgets',
    signal: 'Funded modernization roadmap',
    cadence: 'Monthly',
  },
  {
    name: 'Grant Awards',
    coverage: 'Broadband, resilience, public safety, utilities',
    signal: 'Budget trigger',
    cadence: 'Weekly',
  },
  {
    name: 'Utility Boards',
    coverage: 'Water, sewer, power, broadband, authorities',
    signal: 'Operational pain and compliance needs',
    cadence: 'Weekly',
  },
  {
    name: 'Project Minutes',
    coverage: 'Committee notes and staff reports',
    signal: 'Early-stage problem language',
    cadence: 'Weekly',
  },
]

export const sttLeadCandidates: SttLeadCandidate[] = [
  {
    id: 'lead-fm-public-works',
    name: 'Fort Myers Public Works Modernization',
    type: 'Municipal / Public Works',
    location: 'Fort Myers, FL',
    department: 'Public Works / Engineering',
    fitScore: 94,
    urgencyScore: 88,
    budgetSignal: 'Capital plan / operations modernization language',
    priority: 'critical',
    trigger: 'Public works infrastructure projects need better asset visibility and field-to-office reporting.',
    need: 'Crew status, field documentation, project closeout, asset tracking, and reporting foundation.',
    sttAngle:
      'Position STT as a local infrastructure technology partner that can connect field operations, project documents, asset data, and reporting without creating another disconnected spreadsheet process.',
    nextAction: 'Request a discovery call with Public Works leadership and procurement to map active project reporting gaps.',
    contactPath: 'Public Works Director → Engineering Manager → Procurement contact',
    timeline: '30-60 day relationship entry; 90+ day proposal window',
    valueHypothesis: '$250K-$600K integration and reporting opportunity',
    evidence: [
      { label: 'Public works project activity in target geography', source: 'Municipal agenda / CIP scan', confidence: 82 },
      { label: 'High alignment with STT field operations capability', source: 'STT capability model', confidence: 92 },
      { label: 'Likely need for document, asset, and crew workflow coordination', source: 'Signal extraction model', confidence: 79 },
    ],
    tags: ['Local advantage', 'Field ops', 'Reporting', 'Asset data'],
  },
  {
    id: 'lead-lee-utilities',
    name: 'Lee County Utilities Field Data Program',
    type: 'Utility / Broadband',
    location: 'Lee County, FL',
    department: 'Utilities / Infrastructure Services',
    fitScore: 91,
    urgencyScore: 84,
    budgetSignal: 'Utility infrastructure and compliance documentation pressure',
    priority: 'critical',
    trigger: 'Utility work creates recurring documentation, inspection, mapping, and closeout requirements.',
    need: 'Mobile-first field capture, GIS-adjacent data cleanup, work-order evidence, and executive dashboards.',
    sttAngle:
      'Lead with operational visibility: STT can help standardize field documentation and reporting flows across utility maintenance, upgrades, and contractor coordination.',
    nextAction: 'Send an operations-readiness brief focused on field documentation, closeout, and dashboarding.',
    contactPath: 'Utilities Operations → Asset Management → IT/Data liaison',
    timeline: 'Relationship now; budget qualification within 45 days',
    valueHypothesis: '$300K-$750K phased workflow and data foundation opportunity',
    evidence: [
      { label: 'Utility operations require repeatable field documentation', source: 'Industry fit model', confidence: 88 },
      { label: 'Likely active infrastructure maintenance and upgrade cycle', source: 'Regional infrastructure scan', confidence: 76 },
      { label: 'Strong match to STT project, crew, and data integration story', source: 'STT capability model', confidence: 93 },
    ],
    tags: ['Utilities', 'Compliance', 'Dashboards', 'GIS-adjacent'],
  },
  {
    id: 'lead-cape-broadband',
    name: 'Cape Coral Broadband Resilience Opportunity',
    type: 'Utility / Broadband',
    location: 'Cape Coral, FL',
    department: 'IT / Public Works / Emergency Coordination',
    fitScore: 89,
    urgencyScore: 81,
    budgetSignal: 'Resilience, connectivity, and storm-response language',
    priority: 'high',
    trigger: 'Large, storm-exposed city operations benefit from stronger field coordination and infrastructure visibility.',
    need: 'Connectivity project tracking, work package status, contractor coordination, and executive-level reporting.',
    sttAngle:
      'Frame STT as a practical execution partner for broadband and infrastructure visibility, not just a contractor. The hook is faster coordination during expansion and storm-response work.',
    nextAction: 'Build a one-page city-specific opportunity brief and ask for a meeting around resilience operations.',
    contactPath: 'City IT → Public Works → Emergency Management',
    timeline: '60-120 day education and relationship motion',
    valueHypothesis: '$200K-$500K project visibility and field workflow opportunity',
    evidence: [
      { label: 'High relevance to broadband and resilience use case', source: 'Lead type classifier', confidence: 86 },
      { label: 'Regional proximity supports relationship-based selling', source: 'Geo-fit model', confidence: 91 },
      { label: 'Field operations visibility is a likely pain point', source: 'Signal extraction model', confidence: 74 },
    ],
    tags: ['Broadband', 'Resilience', 'Storm response', 'Municipal'],
  },
  {
    id: 'lead-collier-its',
    name: 'Collier County Transportation / ITS Data Lead',
    type: 'Transportation / ITS',
    location: 'Collier County, FL',
    department: 'Transportation / Traffic Operations',
    fitScore: 86,
    urgencyScore: 78,
    budgetSignal: 'Capital projects and transportation systems complexity',
    priority: 'high',
    trigger: 'Traffic, right-of-way, and field construction programs require tight coordination and closeout evidence.',
    need: 'Project portfolio visibility, field ticketing, asset documentation, and status dashboards.',
    sttAngle:
      'Position STT around the intersection of infrastructure build, field execution, and data foundation work for transportation programs.',
    nextAction: 'Approach transportation leadership with a project portfolio visibility demo.',
    contactPath: 'Transportation Director → Traffic Ops → Procurement',
    timeline: '90-day relationship path',
    valueHypothesis: '$150K-$450K reporting, integration, and dashboard opportunity',
    evidence: [
      { label: 'Transportation programs map to STT field and project workflow', source: 'Industry fit model', confidence: 84 },
      { label: 'Capital project environment creates reporting pressure', source: 'CIP signal model', confidence: 73 },
      { label: 'Potential need for cross-department visibility', source: 'AI synthesis', confidence: 77 },
    ],
    tags: ['Transportation', 'ITS', 'Portfolio', 'Closeout'],
  },
  {
    id: 'lead-charlotte-utility',
    name: 'Charlotte County Utility Work Order Intelligence',
    type: 'Utility / Broadband',
    location: 'Charlotte County, FL',
    department: 'Utilities / Field Operations',
    fitScore: 83,
    urgencyScore: 72,
    budgetSignal: 'Operational efficiency and infrastructure maintenance indicators',
    priority: 'medium',
    trigger: 'Utility teams need consistent field evidence and work-order visibility across crews and vendors.',
    need: 'Simple mobile evidence capture, exception queue, and weekly leadership reporting.',
    sttAngle:
      'Offer a low-friction pilot: one workflow, one dashboard, one exception queue for field operations documentation.',
    nextAction: 'Pitch a small proof-of-concept around work-order evidence and closeout reporting.',
    contactPath: 'Utilities Ops Manager → Field Supervisors → Finance/procurement',
    timeline: '45-90 day pilot discussion',
    valueHypothesis: '$75K-$250K pilot-to-platform opportunity',
    evidence: [
      { label: 'Utility operations pattern match', source: 'Lead type classifier', confidence: 81 },
      { label: 'Local / regional reach is practical for STT', source: 'Geo-fit model', confidence: 87 },
      { label: 'Budget signal is moderate, not confirmed', source: 'Budget confidence model', confidence: 61 },
    ],
    tags: ['Pilot', 'Work orders', 'Evidence capture', 'Utilities'],
  },
]

export const leadFinderStages = [
  { stage: 'Detected', count: 38, detail: 'Public signal captured and normalized' },
  { stage: 'Qualified', count: 14, detail: 'Fit score above 85 or strong trigger' },
  { stage: 'Brief Ready', count: 7, detail: 'AI summary and outreach angle prepared' },
  { stage: 'Contact Path', count: 5, detail: 'Decision-maker route identified' },
  { stage: 'Demo Candidate', count: 3, detail: 'Ready for executive outreach' },
]

export const leadFinderPlaybook = [
  'Start with public works, utilities, broadband, transportation, and emergency-response teams in STT-relevant geographies.',
  'Scan for public buying signals before an RFP becomes crowded: agendas, capital plans, grant awards, utility board minutes, and procurement notices.',
  'Generate one executive brief per target that explains the problem, why STT fits, who to contact, and what first conversation to request.',
  'Route high-fit leads into CRM or DealFlow with next action, source evidence, confidence, and relationship status.',
]
