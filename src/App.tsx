import { AppProvider, useApp } from './state/AppContext'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ExecutiveHome } from './pages/ExecutiveHome'
import { NewHireAutomation } from './pages/NewHireAutomation'
import { DriveCleanup } from './pages/DriveCleanup'
import { IntegrationHealth } from './pages/IntegrationHealth'
import { FieldOps } from './pages/FieldOps'
import { ProjectPortfolio } from './pages/ProjectPortfolio'

function Shell() {
  const { page, boardroomMode } = useApp()

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <ExecutiveHome />
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
      default:
        return <ExecutiveHome />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-950 text-slate-200">
      {!boardroomMode && <Sidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div
            className={`mx-auto w-full ${
              boardroomMode ? 'max-w-[1600px] p-8' : 'max-w-[1400px] p-6'
            }`}
          >
            <div key={page} className="animate-fade-in">
              {renderPage()}
            </div>
          </div>
          <footer className="border-t border-white/[0.06] px-6 py-4 text-center">
            <p className="text-[11px] tracking-wide text-slate-600">
              Demo data — interview prototype only.
            </p>
          </footer>
        </main>
      </div>
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
