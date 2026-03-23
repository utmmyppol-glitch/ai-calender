import { motion } from 'framer-motion'
import useStore, { MODE_CONFIG } from '../store/useStore'
import { cn, getModeColorVar } from '../utils/helpers'

// Quick stats cards for dashboard
export default function StatsRow() {
  const { places, patterns, modeHistory, currentMode, serverOnline, wsConnected } = useStore()
  const cfg = MODE_CONFIG[currentMode] || MODE_CONFIG.DEFAULT

  const stats = [
    {
      label: '등록 장소',
      value: places.length,
      suffix: '곳',
      color: '#6C63FF',
      icon: '📍',
    },
    {
      label: '학습 패턴',
      value: patterns.length,
      suffix: '개',
      color: '#43B581',
      icon: '🧠',
    },
    {
      label: '모드 전환',
      value: modeHistory.length,
      suffix: '회',
      color: '#E8A838',
      icon: '🔄',
    },
    {
      label: '연결 상태',
      value: serverOnline ? (wsConnected ? 'Live' : 'HTTP') : 'Off',
      suffix: '',
      color: serverOnline ? '#43B581' : '#FF6B6B',
      icon: serverOnline ? '🟢' : '🔴',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-hover p-4 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-display font-semibold text-text-primary">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-xs text-text-muted">{stat.suffix}</span>
                )}
              </div>
            </div>
            <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">
              {stat.icon}
            </span>
          </div>
          {/* Accent bar */}
          <div
            className="h-0.5 rounded-full mt-3 opacity-40"
            style={{ background: stat.color, width: '40%' }}
          />
        </motion.div>
      ))}
    </div>
  )
}
