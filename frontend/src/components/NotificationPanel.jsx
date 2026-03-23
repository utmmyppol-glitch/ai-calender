import { motion } from 'framer-motion'
import { Bell, X, Trash2 } from 'lucide-react'
import useStore from '../store/useStore'
import { formatRelativeTime } from '../utils/helpers'

export default function NotificationPanel({ onClose }) {
  const { notifications, clearNotifications } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className="absolute right-0 top-12 w-80 glass-card shadow-float z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-bold text-text-primary">알림</span>
          {notifications.length > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button onClick={clearNotifications} className="btn-ghost p-1.5 rounded-lg">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-text-muted">알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 border-b border-border/50 hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-sm mt-0.5">
                  {n.type === 'ARRIVAL_NEARBY' ? '📍' : '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-snug">{n.message}</p>
                  {n.schedule && (
                    <p className="text-[11px] text-text-muted mt-0.5">{n.schedule}</p>
                  )}
                  <p className="text-[10px] text-text-muted/60 mt-1 font-mono">
                    {formatRelativeTime(n.time)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
