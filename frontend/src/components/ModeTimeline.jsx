import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'
import { formatRelativeTime } from '../utils/helpers'

export default function ModeTimeline() {
  const { modeHistory } = useStore()

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
          <Clock className="w-4 h-4 text-text-secondary" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">모드 전환 기록</h3>
      </div>

      {modeHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-text-muted">아직 모드 전환 기록이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {modeHistory.slice(0, 10).map((entry, i) => {
              const fromCfg = MODE_CONFIG[entry.from] || MODE_CONFIG.DEFAULT
              const toCfg = MODE_CONFIG[entry.to] || MODE_CONFIG.DEFAULT
              return (
                <motion.div
                  key={entry.time + '-' + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-surface-2 transition-colors group"
                >
                  {/* From mode */}
                  <div className="flex items-center gap-1.5 min-w-[72px]">
                    <span className="text-sm">{fromCfg.emoji}</span>
                    <span className="text-xs font-medium text-text-muted">{fromCfg.label}</span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />

                  {/* To mode */}
                  <div className="flex items-center gap-1.5 min-w-[72px]">
                    <span className="text-sm">{toCfg.emoji}</span>
                    <span className="text-xs font-semibold" style={{ color: toCfg.color }}>
                      {toCfg.label}
                    </span>
                  </div>

                  {/* Place & time */}
                  <div className="ml-auto text-right">
                    <p className="text-[11px] text-text-muted">{entry.place}</p>
                    <p className="text-[10px] text-text-muted/60 font-mono">
                      {formatRelativeTime(entry.time)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
