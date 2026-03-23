import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import PlacesList from '../components/PlacesList'
import AddPlaceForm from '../components/AddPlaceForm'
import MapView from '../components/MapView'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Places() {
  const [showForm, setShowForm] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary tracking-tight">장소 관리</h1>
          <p className="text-sm text-text-muted mt-1">장소를 등록하면 AI가 자동으로 모드를 전환합니다</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          장소 추가
        </button>
      </motion.div>

      {/* Map */}
      <motion.div variants={fadeUp}>
        <MapView selectedPlace={selectedPlace} height="340px" />
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <PlacesList onSelect={setSelectedPlace} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {showForm ? (
              <AddPlaceForm key="form" onClose={() => setShowForm(false)} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">장소를 추가해보세요</h3>
                <p className="text-xs text-text-muted max-w-[240px] leading-relaxed">
                  회사, 집, 카페 등을 등록하면 해당 장소에 도착할 때 AI가 자동으로 모드를 전환합니다
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary mt-5"
                >
                  <Plus className="w-4 h-4" />
                  첫 장소 등록
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
