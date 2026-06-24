'use client'

import { AppProvider, useApp } from './state/AppContext'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { TourController } from './components/TourController'
import { ExecutiveHome } from './views/ExecutiveHome'
import { CEOBoardView } from './views/CEOBoardView'
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
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div
            className={`mx-auto w-full ${
              boardroomMode
                ? 'max-w-[1640px] p-4 sm:p-6 lg:p-8'
                : 'max-w-[1440px] p-4 sm:p-6 lg:p-8'
            }`}
          >
            <div key={page} className="animate-fade-in">
              {renderPage()}
            </div>
          </div>
          <footer className="border-t border-white/[0.06] px-6 py-5 text-center">
            <p className="text-[11px] tracking-[0.18em] text-slate-600 uppercase">
              Demo data — interview prototype only
            </p>
          </footer>
        </main>
      </div>
      <TourController />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
