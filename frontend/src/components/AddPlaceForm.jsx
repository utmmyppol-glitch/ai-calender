import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, MapPin, Save } from 'lucide-react'
import useStore, { PLACE_TYPES, MODE_CONFIG } from '../store/useStore'
import { cn } from '../utils/helpers'

const TYPES = Object.entries(PLACE_TYPES)
const MODES = Object.entries(MODE_CONFIG)

export default function AddPlaceForm({ onClose }) {
  const { createPlace } = useStore()
  const [form, setForm] = useState({
    name: '',
    type: 'CUSTOM',
    latitude: 37.5665,
    longitude: 126.978,
    radiusMeters: 100,
    linkedMode: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await createPlace(form)
      onClose?.()
    } catch {
      // toast handled in store
    } finally {
      setSaving(false)
    }
  }

  // Get current location
  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update('latitude', pos.coords.latitude)
        update('longitude', pos.coords.longitude)
      },
      () => {},
      { enableHighAccuracy: true }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-accent" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">새 장소 등록</h3>
        </div>
        <button onClick={onClose} className="btn-ghost p-2 rounded-xl">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="section-title mb-2 block">장소 이름</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="예: 우리 회사, 단골 카페"
            className="input-field"
          />
        </div>

        {/* Type selector */}
        <div>
          <label className="section-title mb-2 block">장소 유형</label>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => update('type', key)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-xs',
                  form.type === key
                    ? 'border-accent bg-accent/5 text-accent font-semibold'
                    : 'border-border text-text-muted hover:border-text-muted/30',
                )}
              >
                <span className="text-base">{cfg.emoji}</span>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coordinates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="section-title">좌표</label>
            <button onClick={useMyLocation} className="text-[11px] text-accent font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> 내 위치 사용
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.0001"
              value={form.latitude}
              onChange={(e) => update('latitude', parseFloat(e.target.value))}
              placeholder="위도"
              className="input-field font-mono text-xs"
            />
            <input
              type="number"
              step="0.0001"
              value={form.longitude}
              onChange={(e) => update('longitude', parseFloat(e.target.value))}
              placeholder="경도"
              className="input-field font-mono text-xs"
            />
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="section-title mb-2 block">감지 반경 (m)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={30}
              max={500}
              value={form.radiusMeters}
              onChange={(e) => update('radiusMeters', parseInt(e.target.value))}
              className="flex-1 accent-accent"
            />
            <span className="text-sm font-mono text-text-secondary w-14 text-right">
              {form.radiusMeters}m
            </span>
          </div>
        </div>

        {/* Linked mode */}
        <div>
          <label className="section-title mb-2 block">연결 모드 (선택)</label>
          <div className="grid grid-cols-4 gap-2">
            {MODES.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => update('linkedMode', form.linkedMode === key ? '' : key)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-[11px]',
                  form.linkedMode === key
                    ? 'font-semibold'
                    : 'border-border text-text-muted hover:border-text-muted/30',
                )}
                style={
                  form.linkedMode === key
                    ? { borderColor: cfg.color, background: `${cfg.color}08`, color: cfg.color }
                    : {}
                }
              >
                <span className="text-base">{cfg.emoji}</span>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!form.name.trim() || saving}
          className={cn('btn-primary w-full', saving && 'opacity-60 cursor-not-allowed')}
        >
          <Save className="w-4 h-4" />
          {saving ? '저장 중...' : '장소 등록'}
        </button>
      </div>
    </motion.div>
  )
}
