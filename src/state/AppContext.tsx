import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import {
  seedExceptions,
  seedIntegrationEvents,
  type AuditEntry,
  type ExceptionItem,
  type IntegrationEvent,
  type PageKey,
} from '../data'

/* ------------------------------------------------------------------ */
/* State shape                                                         */
/* ------------------------------------------------------------------ */

interface TourState {
  active: boolean
  sceneIndex: number
  playing: boolean
  completed: boolean
}

/** One-shot command the New Hire view reacts to (driven by the guided tour). */
interface NhCommand {
  kind: 'success' | 'failure'
  nonce: number
}

interface AppState {
  page: PageKey
  sidebarCollapsed: boolean
  boardroomMode: boolean
  mobileNavOpen: boolean
  tour: TourState
  nhCommand: NhCommand | null
  exceptions: ExceptionItem[]
  auditLog: AuditEntry[]
  events: IntegrationEvent[]
  runCount: number
}

type Action =
  | { type: 'SET_PAGE'; page: PageKey }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_BOARDROOM' }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'CLOSE_MOBILE_NAV' }
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

const initialState: AppState = {
  page: 'home',
  sidebarCollapsed: false,
  boardroomMode: false,
  mobileNavOpen: false,
  tour: { active: false, sceneIndex: 0, playing: false, completed: false },
  nhCommand: null,
  exceptions: seedExceptions,
  auditLog: [],
  events: seedIntegrationEvents,
  runCount: 0,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      // A manual navigation always dismisses the mobile drawer AND yields the tour:
      // if the visitor takes the wheel, the auto-tour gets out of the way.
      return {
        ...state,
        page: action.page,
        mobileNavOpen: false,
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
        events: [action.event, ...state.events].slice(0, 40),
      }
    case 'INCREMENT_RUN':
      return { ...state, runCount: state.runCount + 1 }
    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* Context + hook                                                      */
/* ------------------------------------------------------------------ */

interface AppContextValue extends AppState {
  setPage: (page: PageKey) => void
  toggleSidebar: () => void
  toggleBoardroom: () => void
  toggleMobileNav: () => void
  closeMobileNav: () => void
  // Guided tour controls
  startTour: () => void
  stopTour: () => void
  tourGotoScene: (index: number) => void
  tourSetPlaying: (playing: boolean) => void
  tourComplete: () => void
  tourPage: (page: PageKey) => void
  nhRun: (kind: 'success' | 'failure') => void
  addException: (exception: ExceptionItem) => void
  resolveException: (id: string) => void
  addAudit: (entry: AuditEntry) => void
  addEvent: (event: IntegrationEvent) => void
  incrementRun: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setPage = useCallback((page: PageKey) => dispatch({ type: 'SET_PAGE', page }), [])
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), [])
  const toggleBoardroom = useCallback(() => dispatch({ type: 'TOGGLE_BOARDROOM' }), [])
  const toggleMobileNav = useCallback(() => dispatch({ type: 'TOGGLE_MOBILE_NAV' }), [])
  const closeMobileNav = useCallback(() => dispatch({ type: 'CLOSE_MOBILE_NAV' }), [])
  const startTour = useCallback(() => dispatch({ type: 'TOUR_START' }), [])
  const stopTour = useCallback(() => dispatch({ type: 'TOUR_STOP' }), [])
  const tourGotoScene = useCallback((index: number) => dispatch({ type: 'TOUR_GOTO_SCENE', index }), [])
  const tourSetPlaying = useCallback(
    (playing: boolean) => dispatch({ type: 'TOUR_SET_PLAYING', playing }),
    [],
  )
  const tourComplete = useCallback(() => dispatch({ type: 'TOUR_COMPLETE' }), [])
  const tourPage = useCallback((page: PageKey) => dispatch({ type: 'TOUR_PAGE', page }), [])
  const nhRun = useCallback((kind: 'success' | 'failure') => dispatch({ type: 'NH_RUN', kind }), [])
  const addException = useCallback(
    (exception: ExceptionItem) => dispatch({ type: 'ADD_EXCEPTION', exception }),
    [],
  )
  const resolveException = useCallback(
    (id: string) => dispatch({ type: 'RESOLVE_EXCEPTION', id }),
    [],
  )
  const addAudit = useCallback((entry: AuditEntry) => dispatch({ type: 'ADD_AUDIT', entry }), [])
  const addEvent = useCallback((event: IntegrationEvent) => dispatch({ type: 'ADD_EVENT', event }), [])
  const incrementRun = useCallback(() => dispatch({ type: 'INCREMENT_RUN' }), [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        setPage,
        toggleSidebar,
        toggleBoardroom,
        toggleMobileNav,
        closeMobileNav,
        startTour,
        stopTour,
        tourGotoScene,
        tourSetPlaying,
        tourComplete,
        tourPage,
        nhRun,
        addException,
        resolveException,
        addAudit,
        addEvent,
        incrementRun,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
