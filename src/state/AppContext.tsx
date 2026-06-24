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

interface AppState {
  page: PageKey
  sidebarCollapsed: boolean
  boardroomMode: boolean
  exceptions: ExceptionItem[]
  auditLog: AuditEntry[]
  events: IntegrationEvent[]
  runCount: number
}

type Action =
  | { type: 'SET_PAGE'; page: PageKey }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_BOARDROOM' }
  | { type: 'ADD_EXCEPTION'; exception: ExceptionItem }
  | { type: 'RESOLVE_EXCEPTION'; id: string }
  | { type: 'ADD_AUDIT'; entry: AuditEntry }
  | { type: 'ADD_EVENT'; event: IntegrationEvent }
  | { type: 'INCREMENT_RUN' }

const initialState: AppState = {
  page: 'home',
  sidebarCollapsed: false,
  boardroomMode: false,
  exceptions: seedExceptions,
  auditLog: [],
  events: seedIntegrationEvents,
  runCount: 0,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'TOGGLE_BOARDROOM':
      return { ...state, boardroomMode: !state.boardroomMode }
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
