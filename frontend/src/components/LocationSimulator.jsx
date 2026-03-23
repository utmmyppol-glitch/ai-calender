import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, LocateFixed } from 'lucide-react'
import useStore, { MODE_CONFIG } from '../store/useStore'
import { cn } from '../utils/helpers'

// Quick-pick locations for testing
const QUICK_LOCATIONS = [
  { label: '강남역', lat: 37.4979, lng: 127.0276, emoji: '🏙️' },
  { label: '서울역', lat: 37.5547, lng: 126.9707, emoji: '🚉' },
  { label: '홍대입구', lat: 37.5563, lng: 126.9240, emoji: '🎶' },
  { label: '잠실', lat: 37.5133, lng: 127.1001, emoji: '🏟️' },
]

export default function LocationSimulator() {
  const { simulateLocation, currentMode, serverOnline } = useStore()
  const [lat, setLat] = useState(37.5665)
  const [lng, setLng] = useState(126.978)
  const [sending, setSending] = useState(false)
  const cfg = MODE_CONFIG[currentMode] || MODE_CONFIG.DEFAULT

  const handleSend = async () => {
    setSending(true)
    try {
      await simulateLocation(lat, lng)
    } catch {
      // handled in store
    } finally {
      setSending(false)
    }
  }

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
      },
      () => {},
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
          <Send className="w-4 h-4 text-text-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">위치 시뮬레이터</h3>
          <p className="text-[11px] text-text-muted">테스트용 위치 전송</p>
        </div>
      </div>

      {/* Quick picks */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {QUICK_LOCATIONS.map((loc) => (
          <button
            key={loc.label}
            onClick={() => { setLat(loc.lat); setLng(loc.lng) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs text-text-secondary transition-colors"
          >
            <span>{loc.emoji}</span>
            {loc.label}
          </button>
        ))}
        <button
          onClick={useMyLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent/15 text-xs text-accent transition-colors"
        >
          <LocateFixed className="w-3 h-3" />
          내 위치
        </button>
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">위도</label>
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            className="input-field font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">경도</label>
          <input
            type="number"
            step="0.0001"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
            className="input-field font-mono text-xs"
          />
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={sending || !serverOnline}
        className={cn(
          'btn-primary w-full',
          (sending || !serverOnline) && 'opacity-50 cursor-not-allowed',
        )}
      >
        <MapPin className="w-4 h-4" />
        {sending ? '전송 중...' : !serverOnline ? '서버 오프라인' : '위치 전송'}
      </button>
    </div>
  )
}
