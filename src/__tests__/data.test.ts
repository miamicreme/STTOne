import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  leakageLines,
  leakageTotal,
  executiveKpis,
  boardKpis,
  tourScenes,
  seedExceptions,
  systemsOfRecord,
  pipelineJobs,
  governanceGuards,
  newHireStats,
  portfolioByRegion,
} from '../data'

const VALID_PAGES = new Set([
  'home',
  'discovery',
  'board',
  'legacy',
  'architecture',
  'newhire',
  'drive',
  'integration',
  'fleet',
  'projects',
  'portal',
  'project-status',
])

test('leakage breakdown reconciles exactly to the $214K headline', () => {
  const sum = leakageLines.reduce((s, l) => s + l.amount, 0)
  assert.equal(sum, leakageTotal)
  assert.equal(leakageTotal, 214000)
  assert.equal(leakageLines.length, 4)
})

test('board impact figure matches the headline', () => {
  const impact = boardKpis.find((k) => /annual impact/i.test(k.label))
  assert.ok(impact, 'Est. Annual Impact KPI exists')
  assert.equal(impact!.value, '$214K')
  const onboarding = boardKpis.find((k) => /onboarding/i.test(k.label))
  assert.equal(onboarding!.value, '2.4d')
})

test('executive + board KPI strips are fully populated', () => {
  assert.equal(executiveKpis.length, 6)
  assert.equal(boardKpis.length, 6)
  for (const k of [...executiveKpis, ...boardKpis]) {
    assert.ok(k.label && k.value, `KPI has label + value: ${JSON.stringify(k)}`)
  }
})

test('every tour scene targets a real page and dwells long enough to read', () => {
  assert.equal(tourScenes.length, 5)
  for (const scene of tourScenes) {
    assert.ok(VALID_PAGES.has(scene.page), `valid page: ${scene.page}`)
    assert.ok(scene.ms >= 5000, `calm dwell time: ${scene.ms}`)
    assert.ok(scene.caption.length > 0)
    if (scene.run) assert.ok(scene.run === 'success' || scene.run === 'failure')
  }
})

test('seed exceptions are well-formed and uniquely identified', () => {
  assert.ok(seedExceptions.length > 0)
  const ids = new Set(seedExceptions.map((e) => e.id))
  assert.equal(ids.size, seedExceptions.length, 'no duplicate ids')
  for (const e of seedExceptions) {
    assert.equal(typeof e.retryable, 'boolean')
    assert.ok(e.title && e.detail && e.source)
  }
})

test('architecture model is complete', () => {
  assert.equal(systemsOfRecord.length, 4)
  assert.ok(pipelineJobs.length >= 5)
  assert.ok(governanceGuards.length >= 5)
  for (const j of pipelineJobs) {
    assert.ok(['webhook', 'scheduled', 'event'].includes(j.trigger))
  }
})

test('portfolio chart reconciles to the subtitle', () => {
  const workstreams = portfolioByRegion.reduce(
    (s, r) => s + r.underground + r.aerial + r.wireless + r.fulfillment,
    0,
  )
  assert.equal(workstreams, 24)
  const activeProjects = executiveKpis.find((k) => /active projects/i.test(k.label))
  assert.ok(activeProjects, 'Active Projects KPI exists')
  assert.equal(activeProjects!.value, '17')
})

test('New Hire stat values are compact enough to render on one line', () => {
  for (const k of newHireStats) {
    assert.ok(k.value.length <= 8, `compact KPI value: ${k.value}`)
  }
})
