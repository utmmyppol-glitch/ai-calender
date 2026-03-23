// Utility helpers
import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatTime(timestamp) {
  if (!timestamp) return ''
  const d = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })
}

export function formatRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return '새벽이에요'
  if (h < 12) return '좋은 아침이에요'
  if (h < 18) return '좋은 오후에요'
  return '좋은 저녁이에요'
}

export function getModeColorVar(mode) {
  const map = {
    WORK: '#E8A838',
    FOCUS: '#6C63FF',
    REST: '#43B581',
    EXERCISE: '#FF6B6B',
    COMMUTE: '#4FC3F7',
    MEETING: '#FF8A65',
    DEFAULT: '#90A4AE',
  }
  return map[mode] || map.DEFAULT
}
