import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MapPin,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Zap,
} from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'
import { cn } from '../utils/helpers'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/places', icon: MapPin, label: '장소 관리' },
  { to: '/patterns', icon: Brain, label: '패턴 분석' },
  { to: '/settings', icon: Settings, label: '설정' },
]

export default function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    currentMode,
    serverOnline,
    wsConnected,
  } = useStore()
  const location = useLocation()
  const modeCfg = MODE_CONFIG[currentMode] || MODE_CONFIG.DEFAULT

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 72 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen bg-surface-1 border-r border-border z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0',
            'bg-gradient-to-br', modeCfg.gradient,
            'shadow-lg animate-mode-glow',
          )}
          style={{ '--mode-color': `${modeCfg.color}40` }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="font-display font-semibold text-text-primary text-sm tracking-tight">AI Location</p>
              <p className="text-[11px] text-text-muted font-mono">Agent v1.0</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current mode indicator */}
      <div className="px-4 mb-4">
        <div
          className={cn(
            'rounded-2xl p-3 transition-all duration-500',
            sidebarOpen ? 'px-4' : 'px-2',
          )}
          style={{ background: `${modeCfg.color}12` }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg flex-shrink-0">{modeCfg.emoji}</span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: modeCfg.color }}>
                    {modeCfg.label} 모드
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className={cn(
          'px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted',
          !sidebarOpen && 'text-center px-0'
        )}>
          {sidebarOpen ? 'Menu' : '·'}
        </p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <NavLink key={to} to={to}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2',
                  !sidebarOpen && 'justify-center px-0',
                )}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-[3px] h-5 rounded-r-full bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-2 border-t border-border">
        {/* Status indicators */}
        <div className={cn('flex items-center gap-2 px-3 py-1.5', !sidebarOpen && 'justify-center px-0')}>
          <div className={cn('w-2 h-2 rounded-full', serverOnline ? 'bg-emerald-400' : 'bg-red-400')} />
          {sidebarOpen && (
            <span className="text-[11px] text-text-muted">
              {serverOnline ? 'Server Online' : 'Offline'}
            </span>
          )}
          {sidebarOpen && (
            <>
              <div className="flex-1" />
              {wsConnected ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
              )}
            </>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-text-secondary',
            'hover:bg-surface-2 transition-colors',
            !sidebarOpen && 'justify-center px-0',
          )}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {sidebarOpen && <span>{darkMode ? '라이트 모드' : '다크 모드'}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-text-muted',
            'hover:bg-surface-2 hover:text-text-secondary transition-colors',
            !sidebarOpen && 'justify-center px-0',
          )}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {sidebarOpen && <span>접기</span>}
        </button>
      </div>
    </motion.aside>
  )
}
