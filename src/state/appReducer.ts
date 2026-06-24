import {
  seedExceptions,
  seedIntegrationEvents,
  type AuditEntry,
  type ExceptionItem,
  type IntegrationEvent,
  type PageKey,
} from '../data'

/* ------------------------------------------------------------------ */
/* App state, actions, and the pure reducer (no React — unit-testable) */
/* ------------------------------------------------------------------ */

export interface TourState {
  active: boolean
  sceneIndex: number
  playing: boolean
  completed: boolean
}

/** One-shot command the New Hire view reacts to (driven by the guided tour). */
export interface NhCommand {
  kind: 'success' | 'failure'
  nonce: number
}

export interface AppState {
  page: PageKey
  sidebarCollapsed: boolean
  boardroomMode: boolean
  mobileNavOpen: boolean
  commandOpen: boolean
  tour: TourState
  nhCommand: NhCommand | null
  exceptions: ExceptionItem[]
  auditLog: AuditEntry[]
  events: IntegrationEvent[]
  runCount: number
}

export type Action =
  | { type: 'SET_PAGE'; page: PageKey }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_BOARDROOM' }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'CLOSE_MOBILE_NAV' }
  | { type: 'OPEN_COMMAND' }
  | { type: 'CLOSE_COMMAND' }
  | { type: 'TOGGLE_COMMAND' }
  | { type: 'TOUR_START' }
  | { type: 'TOUR_STOP' }
  | { type: 'TOUR_GOTO_SCENE'; index: number }
  | { type: 'TOUR_SET_PLAYING'; playing: boolean }
  | { type: 'TOUR_COMPLETE' }
  | { type: 'TOUR_PAGE'; page: PageKey }
  | { type: 'NH_RUN'; kind: 'success' | 'failure' }
  | { type: 'ADD_EXCEPTION'; exception: ExceptionItem }
  | { type: 'RESOLVE_EXCEPTION'; id: string }
  | { type: 'ADD_AUDIT'; entry: AuditEntry }
  | { type: 'ADD_EVENT'; event: IntegrationEvent }
  | { type: 'INCREMENT_RUN' }

/** Most-recent events kept in the live feed. */
export const MAX_EVENTS = 40

export const initialState: AppState = {
  page: 'home',
  sidebarCollapsed: false,
  boardroomMode: false,
  mobileNavOpen: false,
  commandOpen: false,
  tour: { active: false, sceneIndex: 0, playing: false, completed: false },
  nhCommand: null,
  exceptions: seedExceptions,
  auditLog: [],
  events: seedIntegrationEvents,
  runCount: 0,
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      // A manual navigation always dismisses the mobile drawer AND yields the tour:
      // if the visitor takes the wheel, the auto-tour gets out of the way.
      return {
        ...state,
        page: action.page,
        mobileNavOpen: false,
        commandOpen: false,
        tour: { ...state.tour, active: false, playing: false },
      }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'TOGGLE_BOARDROOM':
      return { ...state, boardroomMode: !state.boardroomMode, mobileNavOpen: false }
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, mobileNavOpen: !state.mobileNavOpen }
    case 'CLOSE_MOBILE_NAV':
      return { ...state, mobileNavOpen: false }

    /* ---- Command palette (⌘K) ---- */
    case 'OPEN_COMMAND':
      return { ...state, commandOpen: true }
    case 'CLOSE_COMMAND':
      return { ...state, commandOpen: false }
    case 'TOGGLE_COMMAND':
      return { ...state, commandOpen: !state.commandOpen }

    /* ---- Guided tour ---- */
    case 'TOUR_START':
      // Tours present the standard layout — exit boardroom/mobile-nav first.
      return {
        ...state,
        boardroomMode: false,
        mobileNavOpen: false,
        tour: { active: true, sceneIndex: 0, playing: true, completed: false },
      }
    case 'TOUR_STOP':
      return { ...state, tour: { ...state.tour, active: false, playing: false } }
    case 'TOUR_GOTO_SCENE':
      return { ...state, tour: { ...state.tour, sceneIndex: action.index } }
    case 'TOUR_SET_PLAYING':
      return { ...state, tour: { ...state.tour, playing: action.playing } }
    case 'TOUR_COMPLETE':
      return { ...state, tour: { ...state.tour, active: false, playing: false, completed: true } }
    case 'TOUR_PAGE':
      // Tour-driven navigation — does NOT cancel the tour (unlike SET_PAGE).
      return { ...state, page: action.page }
    case 'NH_RUN':
      return {
        ...state,
        nhCommand: { kind: action.kind, nonce: (state.nhCommand?.nonce ?? 0) + 1 },
      }

    case 'ADD_EXCEPTION':
      return { ...state, exceptions: [action.exception, ...state.exceptions] }
    case 'RESOLVE_EXCEPTION':
      return {
        ...state,
        exceptions: state.exceptions.filter((e) => e.id !== action.id),
      }
    case 'ADD_AUDIT':
      return { ...state, auditLog: [action.entry, ...state.auditLog] }
    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.event, ...state.events].slice(0, MAX_EVENTS),
      }
    case 'INCREMENT_RUN':
      return { ...state, runCount: state.runCount + 1 }
    default:
      return state
  }
}
