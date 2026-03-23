import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'

const BAR_COLORS = ['#6C63FF', '#E8A838', '#43B581', '#FF6B6B', '#4FC3F7', '#FF8A65', '#90A4AE']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-surface-1 border border-border rounded-xl px-3 py-2 shadow-float text-xs">
      <p className="font-semibold text-text-primary">{d.placeName}</p>
      <p className="text-text-muted mt-0.5">방문 {d.visitCount}회</p>
      {d.usualMode && <p className="text-text-muted">주 모드: {MODE_CONFIG[d.usualMode]?.label || d.usualMode}</p>}
    </div>
  )
}

export default function PatternChart() {
  const { patterns, loading } = useStore()

  if (loading.patterns) {
    return (
      <div className="glass-card p-6">
        <div className="shimmer-bg h-[300px] rounded-2xl" />
      </div>
    )
  }

  const data = patterns.map((p) => ({
    ...p,
    placeName: p.placeName || '알 수 없음',
    visitCount: p.visitCount || 0,
  }))

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-text-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">방문 패턴</h3>
          <p className="text-[11px] text-text-muted">장소별 방문 빈도</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">패턴 데이터가 아직 없습니다</p>
          <p className="text-xs text-text-muted/60 mt-1">위치 데이터가 쌓이면 자동으로 분석됩니다</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="placeName"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--border-color)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-soft)' }} />
            <Bar dataKey="visitCount" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
