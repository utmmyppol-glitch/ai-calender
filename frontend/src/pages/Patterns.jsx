import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Brain, Calendar, Clock, TrendingUp } from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'

const PIE_COLORS = ['#6C63FF', '#E8A838', '#43B581', '#FF6B6B', '#4FC3F7', '#FF8A65', '#90A4AE']

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-surface-1 border border-border rounded-xl px-3 py-2 shadow-float text-xs">
      <p className="font-semibold text-text-primary">{d.name}</p>
      <p className="text-text-muted">방문 {d.value}회</p>
    </div>
  )
}

export default function Patterns() {
  const { patterns, modeHistory, fetchPatterns, loading } = useStore()

  useEffect(() => {
    fetchPatterns()
  }, [])

  // Process data for charts
  const barData = patterns.map((p) => ({
    name: p.placeName || '알 수 없음',
    visits: p.visitCount || 0,
  }))

  const pieData = patterns.map((p) => ({
    name: p.placeName || '알 수 없음',
    value: p.visitCount || 0,
  }))

  // Mode distribution from history
  const modeDistribution = {}
  modeHistory.forEach((entry) => {
    const mode = entry.to
    modeDistribution[mode] = (modeDistribution[mode] || 0) + 1
  })
  const modeData = Object.entries(modeDistribution).map(([mode, count]) => ({
    name: MODE_CONFIG[mode]?.label || mode,
    value: count,
    color: MODE_CONFIG[mode]?.color || '#90A4AE',
  }))

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-display font-semibold text-text-primary tracking-tight">패턴 분석</h1>
        <p className="text-sm text-text-muted mt-1">AI가 학습한 당신의 생활 패턴을 확인하세요</p>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">학습 패턴</span>
          </div>
          <p className="text-3xl font-display font-semibold text-text-primary">{patterns.length}</p>
          <p className="text-xs text-text-muted mt-1">개의 장소 패턴</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-mode-work" />
            <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">총 방문</span>
          </div>
          <p className="text-3xl font-display font-semibold text-text-primary">
            {patterns.reduce((sum, p) => sum + (p.visitCount || 0), 0)}
          </p>
          <p className="text-xs text-text-muted mt-1">회 기록</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-mode-focus" />
            <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">모드 전환</span>
          </div>
          <p className="text-3xl font-display font-semibold text-text-primary">{modeHistory.length}</p>
          <p className="text-xs text-text-muted mt-1">회 이번 세션</p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar chart */}
        <motion.div variants={fadeUp} className="glass-card p-6">
          <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            장소별 방문 빈도
          </h3>
          {barData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-text-muted">데이터가 없습니다</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart — mode distribution */}
        <motion.div variants={fadeUp} className="glass-card p-6">
          <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-text-secondary" />
            모드 분포
          </h3>
          {modeData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-text-muted">모드 전환 기록이 없습니다</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {modeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Patterns list */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h3 className="text-sm font-bold text-text-primary mb-4">학습된 패턴 상세</h3>
        {patterns.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-8">위치 데이터가 쌓이면 패턴이 자동 분석됩니다</p>
        ) : (
          <div className="space-y-2">
            {patterns.map((p, i) => {
              const modeCfg = p.usualMode ? MODE_CONFIG[p.usualMode] : null
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-2 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-lg">
                    📍
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{p.placeName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {p.usualArrivalTime && (
                        <span className="text-[11px] text-text-muted">도착 {p.usualArrivalTime}</span>
                      )}
                      {p.usualDepartureTime && (
                        <span className="text-[11px] text-text-muted">출발 {p.usualDepartureTime}</span>
                      )}
                      {p.dayOfWeek && (
                        <span className="text-[11px] text-text-muted">{p.dayOfWeek}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-semibold text-text-primary">{p.visitCount}</p>
                    <p className="text-[10px] text-text-muted">방문</p>
                  </div>
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
      </motion.div>
    </motion.div>
  )
}
