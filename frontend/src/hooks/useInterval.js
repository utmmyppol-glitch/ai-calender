import { useEffect, useRef, useCallback } from 'react'

// Polling hook — interval fetching
export function useInterval(callback, delay) {
  const savedCb = useRef(callback)
  useEffect(() => { savedCb.current = callback }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCb.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// Debounce hook
export function useDebounce(fn, ms = 300) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), ms)
  }, [fn, ms])
}

// Keyboard shortcut
export function useKeyboard(key, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
