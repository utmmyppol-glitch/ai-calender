import { motion } from 'framer-motion'
import useStore, { MODE_CONFIG } from '../store/useStore'
import { cn, getModeColorVar } from '../utils/helpers'

const MODES = Object.entries(MODE_CONFIG)

export default function ModeOrb() {
  const { currentMode, currentPlace } = useStore()
  const cfg = MODE_CONFIG[currentMode] || MODE_CONFIG.DEFAULT

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.06] transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${cfg.color}, transparent 70%)`,
        }}
      />

      {/* Outer ring — animated */}
      <motion.div
        key={currentMode}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.08, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[-16px] rounded-full"
          style={{ border: `2px solid ${cfg.color}` }}
        />

        {/* Secondary pulse */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.03, 0.15],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute inset-[-32px] rounded-full"
          style={{ border: `1px solid ${cfg.color}` }}
        />

        {/* Main orb */}
        <div
          className={cn(
            'w-28 h-28 rounded-full flex items-center justify-center',
            'bg-gradient-to-br shadow-xl',
            cfg.gradient,
          )}
          style={{ boxShadow: `0 8px 40px ${cfg.color}40` }}
        >
          <span className="text-4xl">{cfg.emoji}</span>
        </div>
      </motion.div>

      {/* Mode label */}
      <motion.div
        key={currentMode + '-label'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 text-center"
      >
        <h2 className="font-display text-2xl font-semibold text-text-primary tracking-tight">
          {cfg.label} 모드
        </h2>
        <p className="text-sm text-text-muted mt-1 font-body">
          {currentPlace || '위치 대기 중...'}
        </p>
      </motion.div>

      {/* Mode chips — small indicators */}
      <div className="flex gap-1.5 mt-5">
        {MODES.map(([key, val]) => (
          <motion.div
            key={key}
            animate={{
              scale: key === currentMode ? 1.2 : 1,
              opacity: key === currentMode ? 1 : 0.35,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-2.5 h-2.5 rounded-full cursor-default"
            style={{ background: val.color }}
            title={val.label}
          />
        ))}
      </div>
    </div>
  )
}
