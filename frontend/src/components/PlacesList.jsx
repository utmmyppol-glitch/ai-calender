import { motion } from 'framer-motion'
import { MapPin, Navigation, Radius } from 'lucide-react'
import useStore, { PLACE_TYPES, MODE_CONFIG } from '../store/useStore'
import { cn } from '../utils/helpers'

export default function PlacesList({ onSelect }) {
  const { places, loading } = useStore()

  if (loading.places) {
    return (
      <div className="glass-card p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer-bg h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-text-secondary" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">등록된 장소</h3>
          <span className="text-[11px] text-text-muted font-mono bg-surface-2 px-2 py-0.5 rounded-full">
            {places.length}
          </span>
        </div>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
            <Navigation className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">등록된 장소가 없습니다</p>
          <p className="text-xs text-text-muted/60 mt-1">장소를 추가하면 자동 모드 전환이 활성화됩니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {places.map((place, i) => {
            const typeCfg = PLACE_TYPES[place.type] || PLACE_TYPES.CUSTOM
            const modeCfg = place.linkedMode ? (MODE_CONFIG[place.linkedMode] || MODE_CONFIG.DEFAULT) : null
            return (
              <motion.div
                key={place.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect?.(place)}
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-surface-2 cursor-pointer transition-colors group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-surface-2 group-hover:bg-surface-3 flex items-center justify-center text-lg transition-colors">
                  {typeCfg.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{place.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-text-muted">{typeCfg.label}</span>
                    {place.radiusMeters && (
                      <>
                        <span className="text-text-muted/30">·</span>
                        <span className="text-[11px] text-text-muted flex items-center gap-0.5">
                          <Radius className="w-2.5 h-2.5" />
                          {place.radiusMeters}m
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Linked mode badge */}
                {modeCfg && (
                  <div
                    className="mode-badge"
                    style={{ background: `${modeCfg.color}12`, color: modeCfg.color }}
                  >
                    {modeCfg.emoji} {modeCfg.label}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
