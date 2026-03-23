import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import useStore, { PLACE_TYPES, MODE_CONFIG } from '../store/useStore'
import { cn } from '../utils/helpers'

// Custom marker icon factory
function createIcon(emoji, color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${color || 'var(--surface-1)'};
        border: 2px solid rgba(255,255,255,0.9);
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">${emoji}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

// Fit bounds to places
function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (places.length === 0) return
    const bounds = places.map((p) => [p.latitude, p.longitude])
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [places, map])
  return null
}

export default function MapView({ selectedPlace, height = '400px' }) {
  const { places } = useStore()

  // Default center — Seoul
  const center = places.length > 0
    ? [places[0].latitude, places[0].longitude]
    : [37.5665, 126.978]

  return (
    <div className="glass-card overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <FitBounds places={places} />

        {places.map((place) => {
          const typeCfg = PLACE_TYPES[place.type] || PLACE_TYPES.CUSTOM
          const modeCfg = place.linkedMode ? MODE_CONFIG[place.linkedMode] : null
          const color = modeCfg?.color || '#6C63FF'

          return (
            <div key={place.id}>
              {/* Radius circle */}
              <Circle
                center={[place.latitude, place.longitude]}
                radius={place.radiusMeters || 100}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: '4 4',
                }}
              />

              {/* Marker */}
              <Marker
                position={[place.latitude, place.longitude]}
                icon={createIcon(typeCfg.emoji, `${color}20`)}
              >
                <Popup>
                  <div className="text-center min-w-[120px]">
                    <p className="font-semibold text-sm">{place.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{typeCfg.label}</p>
                    {modeCfg && (
                      <div
                        className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ background: `${color}15`, color }}
                      >
                        {modeCfg.emoji} {modeCfg.label}
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      반경 {place.radiusMeters || 100}m
                    </p>
                  </div>
                </Popup>
              </Marker>
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}
