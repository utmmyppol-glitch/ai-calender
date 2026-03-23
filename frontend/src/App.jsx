import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from './store/useStore'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Places from './pages/Places'
import Patterns from './pages/Patterns'
import Settings from './pages/Settings'

export default function App() {
  const {
    checkHealth,
    fetchCurrentMode,
    fetchPlaces,
    fetchPatterns,
    connectWs,
    disconnectWs,
    darkMode,
    sidebarOpen,
  } = useStore()

  useEffect(() => {
    // Initial data load
    const init = async () => {
      const ok = await checkHealth()
      if (ok) {
        await Promise.all([fetchCurrentMode(), fetchPlaces(), fetchPatterns()])
        connectWs()
      }
    }
    init()

    // Polling health every 30s
    const interval = setInterval(() => checkHealth(), 30000)

    return () => {
      clearInterval(interval)
      disconnectWs()
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-surface-0">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '280px' : '72px' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/places" element={<Places />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
