import type { Business } from './types'

export const RADIUS_OPTIONS = [
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
  { label: '50 km', value: 50 },
]

export const DEFAULT_RADIUS = 5

type LocationFilter =
  | { mode: 'none' }
  | { mode: 'suburb'; suburb: string }
  | { mode: 'nearMe'; lat: number; lng: number; radius: number }

function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function parseLocationFilter(params: URLSearchParams): LocationFilter {
  const suburb = params.get('suburb')
  if (suburb && suburb !== 'All') {
    return { mode: 'suburb', suburb }
  }
  const lat = params.get('lat')
  const lng = params.get('lng')
  if (lat && lng) {
    const latNum = Number(lat)
    const lngNum = Number(lng)
    if (Number.isFinite(latNum) && Math.abs(latNum) <= 90 && Number.isFinite(lngNum) && Math.abs(lngNum) <= 180) {
      const requestedRadius = Number(params.get('radius'))
      const radius = RADIUS_OPTIONS.some(option => option.value === requestedRadius) ? requestedRadius : DEFAULT_RADIUS
      return { mode: 'nearMe', lat: latNum, lng: lngNum, radius }
    }
  }
  return { mode: 'none' }
}

export function filterBusinesses(businesses: Business[], activeCategory: string, searchQuery: string, locationFilter: ReturnType<typeof parseLocationFilter>, activeCriteria: string[]) {
  let results = businesses

  if (activeCategory !== 'All') {
    results = results.filter(b => b.category === activeCategory)
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    results = results.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.suburb?.toLowerCase().includes(q)
    )
  }

  if (locationFilter.mode === 'suburb') {
    results = results.filter(b => b.suburb === locationFilter.suburb)
  } else if (locationFilter.mode === 'nearMe') {
    const { lat, lng, radius } = locationFilter
    results = results.filter(b => {
      if (b.lat == null || b.lng == null) return false
      return getDistanceKm(lat, lng, Number(b.lat), Number(b.lng)) <= radius
    })
  }

  if (activeCriteria.length > 0) {
    results = results.filter(b =>
      activeCriteria.every(c => b.criteria?.includes(c))
    )
  }

  return results
}

export function hasMapCoordinates(business: Pick<Business, 'lat' | 'lng'>) {
  return business.lat != null && business.lng != null &&
    Number.isFinite(Number(business.lat)) && Math.abs(Number(business.lat)) <= 90 &&
    Number.isFinite(Number(business.lng)) && Math.abs(Number(business.lng)) <= 180
}
