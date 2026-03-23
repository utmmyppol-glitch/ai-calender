// API base — proxied via Vite dev server
const BASE = '/api'

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json()
}

// ── Location ──
export const locationApi = {
  updateLocation: (data) =>
    request('/location/update', { method: 'POST', body: JSON.stringify(data) }),

  getCurrentMode: (userId) =>
    request(`/location/current-mode?userId=${userId}`),
}

// ── Places ──
export const placesApi = {
  getAll: (userId) => request(`/places?userId=${userId}`),

  create: (data) =>
    request('/places', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Patterns ──
export const patternsApi = {
  getAll: (userId) => request(`/patterns?userId=${userId}`),
}

// ── Health ──
export const healthApi = {
  check: () => request('/health'),
}
