'use client'

import { Linkedin } from 'lucide-react'
import { AppProvider, useApp } from './state/AppContext'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TourController } from './components/TourController'
import { CommandPalette } from './components/CommandPalette'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ExecutiveHome } from './views/ExecutiveHome'
import { CEOBoardView } from './views/CEOBoardView'
import { Architecture } from './views/Architecture'
import { NewHireAutomation } from './views/NewHireAutomation'
import { DriveCleanup } from './views/DriveCleanup'
import { IntegrationHealth } from './views/IntegrationHealth'
import { FieldOps } from './views/FieldOps'
import { ProjectPortfolio } from './views/ProjectPortfolio'
import { EmployeePortal } from './views/EmployeePortal'

function Shell() {
  const { page, boardroomMode } = useApp()

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <ExecutiveHome />
      case 'board':
        return <CEOBoardView />
      case 'architecture':
        return <Architecture />
      case 'newhire':
        return <NewHireAutomation />
      case 'drive':
        return <DriveCleanup />
      case 'integration':
        return <IntegrationHealth />
      case 'fleet':
        return <FieldOps />
      case 'projects':
        return <ProjectPortfolio />
      case 'portal':
        return <EmployeePortal />
      default:
        return <ExecutiveHome />
    }
  }

  return (
    <div className="relative z-10 flex h-screen overflow-hidden text-slate-200">
      {!boardroomMode && <Sidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        {/* Stage. On desktop (md+) it's a fixed, non-scrolling presentation
            surface — each view is sized to fit, so there's no per-view jump. On
            mobile, where every grid stacks into one tall column, it scrolls
            naturally so nothing is clipped. The footer stays pinned either way. */}
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
            <div
              className={`mx-auto w-full md:h-full ${
                boardroomMode
                  ? 'max-w-[1640px] p-4 sm:p-6 lg:p-8'
                  : 'max-w-[1440px] p-4 sm:p-6 lg:p-8'
              }`}
            >
              <div key={page} className="animate-fade md:h-full">
                {renderPage()}
              </div>
            </div>
          </div>
          <footer className="shrink-0 border-t border-white/[0.06] px-6 py-3">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                Demo data — interview prototype only
              </span>
              <span className="hidden text-slate-700 sm:inline" aria-hidden="true">
                ·
              </span>
              <a
                href="https://www.linkedin.com/in/kohron-burton/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors hover:text-accent"
              >
                <span>
                  Prototype by <span className="font-medium text-slate-400 group-hover:text-accent">Kohron Burton</span>
                </span>
                <Linkedin className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          </footer>
        </main>
      </div>
      <TourController />
      <CommandPalette />
      <WelcomeScreen />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Shell />
      </ErrorBoundary>
    </AppProvider>
  )
}
