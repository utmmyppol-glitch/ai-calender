import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'

export default function AiInsightCard() {
  const { aiInsight, recommendations, currentMode } = useStore()
  const cfg = MODE_CONFIG[currentMode] || MODE_CONFIG.DEFAULT

  // Parse AI insight JSON if possible
  let insight = ''
  let actions = []
  try {
    const parsed = JSON.parse(aiInsight)
    insight = parsed.insight || ''
    actions = parsed.actions || []
  } catch {
    insight = aiInsight || '위치가 변경되면 AI가 맥락을 분석합니다'
    actions = recommendations || []
  }

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] rounded-bl-full"
        style={{ background: cfg.color }}
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">AI 인사이트</h3>
          <p className="text-[11px] text-text-muted font-mono">Powered by GPT-4o</p>
        </div>
      </div>

      {/* Insight text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={insight}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-sm text-text-secondary leading-relaxed mb-5"
        >
          {insight}
        </motion.p>
      </AnimatePresence>

      {/* Action recommendations */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <p className="section-title mb-2">
            <Lightbulb className="w-3 h-3 inline mr-1" />
            추천 행동
          </p>
          {actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2.5 group cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                style={{ background: `${cfg.color}15`, color: cfg.color }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                {action}
              </p>
              <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0 mt-0.5" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {actions.length === 0 && !insight && (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">위치 이동 시 AI가 맥락을 분석합니다</p>
        </div>
      )}
    </div>
  )
}
