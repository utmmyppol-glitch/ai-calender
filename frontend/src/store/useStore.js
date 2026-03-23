import { create } from 'zustand'
import { locationApi, placesApi, patternsApi, healthApi } from '../services/api'
import { wsService } from '../services/websocket'
import toast from 'react-hot-toast'

// ── Mode config ──
export const MODE_CONFIG = {
  WORK:     { label: '출근',   emoji: '🏢', color: '#E8A838', gradient: 'from-amber-400 to-orange-500' },
  FOCUS:    { label: '집중',   emoji: '☕', color: '#6C63FF', gradient: 'from-violet-500 to-indigo-600' },
  REST:     { label: '휴식',   emoji: '🏠', color: '#43B581', gradient: 'from-emerald-400 to-green-600' },
  EXERCISE: { label: '운동',  emoji: '🏋️', color: '#FF6B6B', gradient: 'from-red-400 to-rose-600' },
  COMMUTE:  { label: '이동',  emoji: '🚶', color: '#4FC3F7', gradient: 'from-sky-400 to-cyan-500' },
  MEETING:  { label: '약속',  emoji: '🤝', color: '#FF8A65', gradient: 'from-orange-400 to-amber-600' },
  DEFAULT:  { label: '기본',  emoji: '✨', color: '#90A4AE', gradient: 'from-slate-400 to-gray-500' },
}

export const PLACE_TYPES = {
  HOME:       { label: '집',     emoji: '🏠' },
  OFFICE:     { label: '회사',   emoji: '🏢' },
  CAFE:       { label: '카페',   emoji: '☕' },
  GYM:        { label: '헬스장', emoji: '🏋️' },
  RESTAURANT: { label: '식당',   emoji: '🍽️' },
  SCHOOL:     { label: '학교',   emoji: '📚' },
  CUSTOM:     { label: '기타',   emoji: '📍' },
}

const useStore = create((set, get) => ({
  // ── State ──
  userId: 1,
  currentMode: 'DEFAULT',
  currentPlace: null,
  aiInsight: '',
  recommendations: [],
  places: [],
  patterns: [],
  modeHistory: [],
  notifications: [],
  serverOnline: false,
  wsConnected: false,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  loading: { places: false, patterns: false, mode: false },
  sidebarOpen: true,

  // ── Actions ──
  setUserId: (id) => set({ userId: id }),

  toggleDarkMode: () => {
    const next = !get().darkMode
    document.documentElement.classList.toggle('dark', next)
    set({ darkMode: next })
  },

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  // ── Server ──
  checkHealth: async () => {
    try {
      await healthApi.check()
      set({ serverOnline: true })
      return true
    } catch {
      set({ serverOnline: false })
      return false
    }
  },

  // ── WebSocket ──
  connectWs: () => {
    const { userId } = get()
    wsService.connect(
      userId,
      // onModeChange
      (event) => {
        set((s) => ({
          currentMode: event.currentMode,
          currentPlace: event.placeName,
          aiInsight: event.aiRecommendation,
          recommendations: event.suggestedActions || [],
          modeHistory: [
            { from: event.previousMode, to: event.currentMode, place: event.placeName, time: event.timestamp },
            ...s.modeHistory,
          ].slice(0, 50),
        }))
        const cfg = MODE_CONFIG[event.currentMode] || MODE_CONFIG.DEFAULT
        toast(`${cfg.emoji} ${cfg.label} 모드로 전환`, { icon: cfg.emoji })
      },
      // onNotification
      (event) => {
        set((s) => ({ notifications: [{ ...event, time: Date.now() }, ...s.notifications].slice(0, 30) }))
        toast(event.message || '새로운 알림', { icon: '📍' })
      }
    )
    set({ wsConnected: true })
  },

  disconnectWs: () => {
    wsService.disconnect()
    set({ wsConnected: false })
  },

  // ── Fetch data ──
  fetchCurrentMode: async () => {
    set((s) => ({ loading: { ...s.loading, mode: true } }))
    try {
      const data = await locationApi.getCurrentMode(get().userId)
      set({ currentMode: data.mode })
    } catch (e) {
      console.error('Mode fetch failed:', e)
    } finally {
      set((s) => ({ loading: { ...s.loading, mode: false } }))
    }
  },

  fetchPlaces: async () => {
    set((s) => ({ loading: { ...s.loading, places: true } }))
    try {
      const data = await placesApi.getAll(get().userId)
      set({ places: data })
    } catch (e) {
      console.error('Places fetch failed:', e)
    } finally {
      set((s) => ({ loading: { ...s.loading, places: false } }))
    }
  },

  fetchPatterns: async () => {
    set((s) => ({ loading: { ...s.loading, patterns: true } }))
    try {
      const data = await patternsApi.getAll(get().userId)
      set({ patterns: data })
    } catch (e) {
      console.error('Patterns fetch failed:', e)
    } finally {
      set((s) => ({ loading: { ...s.loading, patterns: false } }))
    }
  },

  // ── Create place ──
  createPlace: async (placeData) => {
    try {
      const created = await placesApi.create({ ...placeData, userId: get().userId })
      set((s) => ({ places: [...s.places, created] }))
      toast.success('장소가 등록되었습니다')
      return created
    } catch (e) {
      toast.error('장소 등록 실패')
      throw e
    }
  },

  // ── Simulate location (for testing) ──
  simulateLocation: async (lat, lng) => {
    try {
      const data = await locationApi.updateLocation({
        userId: get().userId,
        latitude: lat,
        longitude: lng,
        accuracy: 10.0,
        speed: 0.0,
      })
      set({
        currentMode: data.currentMode,
        currentPlace: data.currentPlace,
        aiInsight: data.aiInsight,
        recommendations: data.recommendations || [],
      })
      return data
    } catch (e) {
      toast.error('위치 전송 실패')
      throw e
    }
  },

  // ── Clear notifications ──
  clearNotifications: () => set({ notifications: [] }),
}))

// Init dark mode class
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

export default useStore
