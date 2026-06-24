import { test } from 'node:test'
import assert from 'node:assert/strict'
import { reducer, initialState, MAX_EVENTS, type AppState } from '../state/appReducer'
import type { ExceptionItem, IntegrationEvent, AuditEntry } from '../data'

const exc = (id: string): ExceptionItem => ({
  id,
  title: `t-${id}`,
  detail: 'd',
  severity: 'high',
  source: 'Fleet',
  category: 'credential',
  retryable: false,
  createdAt: '08:00',
})

const evt = (id: string): IntegrationEvent => ({
  id,
  system: 'PenguinData',
  message: 'm',
  level: 'info',
  time: '08:00',
})

const audit: AuditEntry = {
  id: 'A1',
  worker: 'W',
  outcome: 'success',
  message: 'm',
  timestamp: '08:00:00',
}

test('initial state is calm: tour inactive, on home, no runs', () => {
  assert.equal(initialState.page, 'home')
  assert.equal(initialState.tour.active, false)
  assert.equal(initialState.runCount, 0)
  assert.equal(initialState.nhCommand, null)
})

test('SET_PAGE navigates, closes mobile nav, and yields the tour', () => {
  const playing: AppState = {
    ...initialState,
    mobileNavOpen: true,
    tour: { active: true, sceneIndex: 3, playing: true, completed: false },
  }
  const next = reducer(playing, { type: 'SET_PAGE', page: 'fleet' })
  assert.equal(next.page, 'fleet')
  assert.equal(next.mobileNavOpen, false)
  assert.equal(next.tour.active, false)
  assert.equal(next.tour.playing, false)
})

test('TOUR_START activates, plays from scene 0, and exits boardroom', () => {
  const s = reducer({ ...initialState, boardroomMode: true }, { type: 'TOUR_START' })
  assert.equal(s.tour.active, true)
  assert.equal(s.tour.playing, true)
  assert.equal(s.tour.sceneIndex, 0)
  assert.equal(s.boardroomMode, false)
})

test('TOUR_PAGE navigates WITHOUT cancelling the tour (unlike SET_PAGE)', () => {
  const playing = reducer(initialState, { type: 'TOUR_START' })
  const next = reducer(playing, { type: 'TOUR_PAGE', page: 'integration' })
  assert.equal(next.page, 'integration')
  assert.equal(next.tour.active, true)
})

test('TOUR_GOTO_SCENE / SET_PLAYING / STOP / COMPLETE behave', () => {
  let s = reducer(initialState, { type: 'TOUR_START' })
  s = reducer(s, { type: 'TOUR_GOTO_SCENE', index: 4 })
  assert.equal(s.tour.sceneIndex, 4)
  s = reducer(s, { type: 'TOUR_SET_PLAYING', playing: false })
  assert.equal(s.tour.playing, false)
  s = reducer(s, { type: 'TOUR_STOP' })
  assert.equal(s.tour.active, false)
  const done = reducer({ ...initialState, tour: { active: true, sceneIndex: 8, playing: true, completed: false } }, { type: 'TOUR_COMPLETE' })
  assert.equal(done.tour.completed, true)
  assert.equal(done.tour.active, false)
})

test('command palette: open / close / toggle, and SET_PAGE dismisses it', () => {
  const opened = reducer(initialState, { type: 'OPEN_COMMAND' })
  assert.equal(opened.commandOpen, true)
  assert.equal(reducer(opened, { type: 'CLOSE_COMMAND' }).commandOpen, false)
  assert.equal(reducer(initialState, { type: 'TOGGLE_COMMAND' }).commandOpen, true)
  // Navigating from the palette closes it.
  assert.equal(reducer(opened, { type: 'SET_PAGE', page: 'drive' }).commandOpen, false)
})

test('welcome overlay: starts open, DISMISS_WELCOME closes it, TOUR_START closes it too', () => {
  assert.equal(initialState.welcomeOpen, true)
  assert.equal(reducer(initialState, { type: 'DISMISS_WELCOME' }).welcomeOpen, false)
  // Launching the tour from the welcome CTA also closes the overlay.
  assert.equal(reducer(initialState, { type: 'TOUR_START' }).welcomeOpen, false)
})

test('NH_RUN issues a one-shot command with a strictly increasing nonce', () => {
  const a = reducer(initialState, { type: 'NH_RUN', kind: 'success' })
  assert.deepEqual(a.nhCommand, { kind: 'success', nonce: 1 })
  const b = reducer(a, { type: 'NH_RUN', kind: 'failure' })
  assert.equal(b.nhCommand?.kind, 'failure')
  assert.equal(b.nhCommand?.nonce, 2)
})

test('exceptions: ADD prepends, RESOLVE removes by id', () => {
  const added = reducer(initialState, { type: 'ADD_EXCEPTION', exception: exc('NEW') })
  assert.equal(added.exceptions[0].id, 'NEW')
  assert.equal(added.exceptions.length, initialState.exceptions.length + 1)
  const resolved = reducer(added, { type: 'RESOLVE_EXCEPTION', id: 'NEW' })
  assert.equal(resolved.exceptions.length, initialState.exceptions.length)
  assert.ok(!resolved.exceptions.some((e) => e.id === 'NEW'))
})

test('INCREMENT_RUN and ADD_AUDIT accumulate', () => {
  let s = reducer(initialState, { type: 'INCREMENT_RUN' })
  s = reducer(s, { type: 'INCREMENT_RUN' })
  assert.equal(s.runCount, 2)
  const a = reducer(initialState, { type: 'ADD_AUDIT', entry: audit })
  assert.equal(a.auditLog[0].id, 'A1')
})

test('event feed is capped at MAX_EVENTS', () => {
  let s: AppState = { ...initialState, events: [] }
  for (let i = 0; i < MAX_EVENTS + 12; i++) s = reducer(s, { type: 'ADD_EVENT', event: evt(`E${i}`) })
  assert.equal(s.events.length, MAX_EVENTS)
  // Newest is first.
  assert.equal(s.events[0].id, `E${MAX_EVENTS + 11}`)
})

test('reducer is pure — it never mutates the input state', () => {
  const before = JSON.stringify(initialState)
  reducer(initialState, { type: 'ADD_EXCEPTION', exception: exc('X') })
  reducer(initialState, { type: 'TOUR_START' })
  reducer(initialState, { type: 'INCREMENT_RUN' })
  assert.equal(JSON.stringify(initialState), before)
})

test('unknown actions return the same state reference', () => {
  // @ts-expect-error — intentionally invalid action for the default branch
  assert.equal(reducer(initialState, { type: 'NOPE' }), initialState)
})
