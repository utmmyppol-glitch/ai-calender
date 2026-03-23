import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, RefreshCw } from 'lucide-react'
import useStore from '../store/useStore'
import { getGreeting } from '../utils/helpers'
import ModeOrb from '../components/ModeOrb'
import AiInsightCard from '../components/AiInsightCard'
import ModeTimeline from '../components/ModeTimeline'
import StatsRow from '../components/StatsRow'
import MapView from '../components/MapView'
import LocationSimulator from '../components/LocationSimulator'
import NotificationPanel from '../components/NotificationPanel'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Dashboard() {
  const { notifications, fetchCurrentMode, fetchPlaces, fetchPatterns } = useStore()
  const [showNotif, setShowNotif] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchCurrentMode(), fetchPlaces(), fetchPatterns()])
    setTimeout(() => setRefreshing(false), 500)
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary tracking-tight">
            {getGreeting()} 👋
          </h1>
          <p className="text-sm text-text-muted mt-1">
            AI가 당신의 위치를 분석하고 최적의 모드를 제안합니다
          </p>
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleRefresh}
            className="btn-ghost p-2.5 rounded-xl"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="btn-ghost p-2.5 rounded-xl relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            )}
          </button>
          <AnimatePresence>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp}>
        <StatsRow />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left — Mode Orb + AI Insight */}
        <motion.div variants={fadeUp} className="col-span-4 space-y-6">
          <ModeOrb />
          <AiInsightCard />
        </motion.div>

        {/* Center — Map */}
        <motion.div variants={fadeUp} className="col-span-5">
          <MapView height="100%" />
        </motion.div>

        {/* Right — Simulator + Timeline */}
        <motion.div variants={fadeUp} className="col-span-3 space-y-6">
          <LocationSimulator />
          <ModeTimeline />
        </motion.div>
      </div>
    </motion.div>
  )
}
