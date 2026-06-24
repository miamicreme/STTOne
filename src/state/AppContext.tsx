import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import {
  type AuditEntry,
  type ExceptionItem,
  type IntegrationEvent,
  type PageKey,
} from '../data'
import { reducer, initialState, type AppState } from './appReducer'

/* ------------------------------------------------------------------ */
/* Context + hook                                                      */
/* ------------------------------------------------------------------ */

interface AppContextValue extends AppState {
  setPage: (page: PageKey) => void
  toggleSidebar: () => void
  toggleBoardroom: () => void
  toggleMobileNav: () => void
  closeMobileNav: () => void
  // Command palette (⌘K)
  openCommand: () => void
  closeCommand: () => void
  toggleCommand: () => void
  // Welcome overlay
  dismissWelcome: () => void
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
  const openCommand = useCallback(() => dispatch({ type: 'OPEN_COMMAND' }), [])
  const closeCommand = useCallback(() => dispatch({ type: 'CLOSE_COMMAND' }), [])
  const toggleCommand = useCallback(() => dispatch({ type: 'TOGGLE_COMMAND' }), [])
  const dismissWelcome = useCallback(() => dispatch({ type: 'DISMISS_WELCOME' }), [])
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
        openCommand,
        closeCommand,
        toggleCommand,
        dismissWelcome,
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
