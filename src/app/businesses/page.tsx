'use client'

import { Suspense, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Business } from '@/lib/types'
import { getCategoryIconPath } from '@/lib/categories'
import { formatTagList } from '@/lib/tags'
import { CRITERIA_NAMES } from '@/lib/criteria'
import { RADIUS_OPTIONS, DEFAULT_RADIUS, parseLocationFilter, filterBusinesses } from '@/lib/directory'
import styles from './Directory.module.css'
import CriteriaDrawer from '@/components/CriteriaDrawer'


const BusinessMap = dynamic(() => import('@/components/listings/BusinessMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading map...</p>
    </div>
  ),
})

const CATEGORIES = [
  'All',
  'Cafes & Restaurants',
  'Fashion',
  'Groceries',
  'Home & Living',
  'Alcohol',
  'Markets',
]

type ViewMode = 'map' | 'list'

export default function BusinessesPage() {
  return <Suspense fallback={<p role="status" className="p-6">Loading directory…</p>}><Directory /></Suspense>
}

function Directory() {
  const searchParams = useSearchParams()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [locationError, setLocationError] = useState('')
  const [suburbs, setSuburbs] = useState<string[]>([])
  const viewMode: ViewMode = searchParams.get('view') === 'list' ? 'list' : 'map'
  const [filtersOpen, setFiltersOpen] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const [locationLoading, setLocationLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const criteriaTriggerRef = useRef<HTMLButtonElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const activeCategory = searchParams.get('category') ?? 'All'
  const searchQuery = searchParams.get('q') ?? ''
  const activeCriteriaString = searchParams.get('criteria') ?? ''
  const activeCriteria = useMemo(
    () => activeCriteriaString ? activeCriteriaString.split(',').filter(Boolean) : [],
    [activeCriteriaString]
  )
  const locationFilter = useMemo(
    () => parseLocationFilter(searchParams),
    [searchParams]
  )

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let active = true
    async function fetchBusinesses() {
      setLoading(true)
      setError(false)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('businesses').select('*')
          .eq('status', 'approved').order('is_featured', { ascending: false })
          .order('name').abortSignal(controller.signal)
        if (error || !data) throw new Error('Listings request failed')
        if (active) {
          setBusinesses(data)
          setSuburbs(Array.from(new Set(data.map((b: Business) => b.suburb).filter(Boolean))).sort() as string[])
        }
      } catch {
        if (active) setError(true)
      } finally {
        clearTimeout(timeout)
        if (active) setLoading(false)
      }
    }
    void fetchBusinesses()
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [retry])

  const filtered = useMemo(() => filterBusinesses(businesses, activeCategory, searchQuery, locationFilter, activeCriteria),
    [businesses, activeCategory, searchQuery, locationFilter, activeCriteria])

  const navigate = useCallback((updates: Record<string, string | null>) => {
    const current = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })

    const query = current.toString()
    window.history.pushState(null, '', query ? `/businesses?${query}` : '/businesses')
  }, [searchParams])

  const setViewMode = (view: ViewMode) => navigate({ view: view === 'list' ? 'list' : null })

  const selectSuburb = useCallback((suburb: string) => {
    navigate({
      suburb: suburb === 'All' ? null : suburb,
      lat: null,
      lng: null,
      radius: null,
    })
  }, [navigate])

  const enableNearMe = useCallback(() => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Location is unavailable in this browser. Choose a suburb instead.')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationLoading(false)
        navigate({
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
          radius: String(DEFAULT_RADIUS),
          suburb: null,
        })
      },
      () => {
        setLocationLoading(false)
        setLocationError('Unable to get your location. Check browser permissions or choose a suburb.')
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }, [navigate])

  const disableNearMe = useCallback(() => {
    navigate({ lat: null, lng: null, radius: null })
  }, [navigate])

  const updateRadius = useCallback((radius: number) => {
    navigate({ radius: String(radius) })
  }, [navigate])

  const setCategory = useCallback((category: string) => {
    navigate({ category: category === 'All' ? null : category })
  }, [navigate])

  const setSearchQuery = useCallback((q: string) => {
    navigate({ q: q || null })
  }, [navigate])

  const toggleCriteria = useCallback((criterion: string) => {
    const updated = activeCriteria.includes(criterion)
      ? activeCriteria.filter(c => c !== criterion)
      : [...activeCriteria, criterion]
    navigate({ criteria: updated.length ? updated.join(',') : null })
  }, [activeCriteria, navigate])

  const clearAllFilters = useCallback(() => {
    navigate({ q: null, category: null, criteria: null, suburb: null, lat: null, lng: null, radius: null })
  }, [navigate])

  function handleMarkerClick(business: Business) {
    setSelectedId(business.id)
    cardRefs.current[business.id]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' })
  }

  const hasActiveFilters =
    activeCategory !== 'All' ||
    locationFilter.mode !== 'none' ||
    searchQuery !== '' ||
    activeCriteria.length > 0

  const mapUserLocation = useMemo(() => locationFilter.mode === 'nearMe'
    ? { lat: locationFilter.lat, lng: locationFilter.lng }
    : null, [locationFilter])
  const mapRadius = locationFilter.mode === 'nearMe' ? locationFilter.radius : 0
  const mapSuburb = locationFilter.mode === 'suburb' ? locationFilter.suburb : null

  const suburbSelectValue = locationFilter.mode === 'suburb' ? locationFilter.suburb : 'All'

  return (
    <div data-directory data-view={viewMode} className={styles.directory}>

      <main id="content">
      <h1 className="sr-only">Melbourne business directory</h1>

      <div className={styles.controls}>
        <div className={styles.filterGrid}>

          <div className={styles.search}>
            <label htmlFor="directory-search">Search the directory</label>
            <input
              id="directory-search"
              type="search"
              aria-label="Search businesses"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Try a business name, suburb or keyword"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <label className={styles.filterGroup}>Category
          <select
            aria-label="Business category"
            value={activeCategory}
            onChange={e => setCategory(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          </label>

          <fieldset className={styles.location}><legend>Location</legend>
          <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-white">
            <button
              type="button"
              onClick={() => {
                if (locationFilter.mode === 'nearMe') {
                  disableNearMe()
                }
              }}
              aria-pressed={locationFilter.mode !== 'nearMe'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                locationFilter.mode !== 'nearMe'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span style={{ fontSize: '12px' }}>◉</span>
              Suburb
            </button>
            <button
              type="button"
              onClick={() => {
                if (locationFilter.mode !== 'nearMe') {
                  enableNearMe()
                }
              }}
              disabled={locationLoading}
              aria-pressed={locationFilter.mode === 'nearMe'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 ${
                locationFilter.mode === 'nearMe'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span style={{ fontSize: '12px' }}>◎</span>
              {locationLoading ? 'Locating\u2026' : 'Near me'}
            </button>
          </div>

          {locationFilter.mode === 'nearMe' ? (
            <select
              value={locationFilter.radius}
              onChange={e => updateRadius(Number(e.target.value))}
              className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
              aria-label="Search radius"
            >
              {RADIUS_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>Within {r.label}</option>
              ))}
            </select>
          ) : (
            <select
              value={suburbSelectValue}
              onChange={e => selectSuburb(e.target.value)}
              className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-400 transition-colors bg-white"
              aria-label="Suburb"
            >
              <option value="All">All suburbs</option>
              {suburbs.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          </fieldset>
          <div className={styles.filterGroup}><span>Criteria</span>
          <button
            ref={criteriaTriggerRef}
            aria-label={`Criteria, ${activeCriteria.length} selected`}
            aria-expanded={filtersOpen}
            aria-haspopup="dialog"
            aria-controls="criteria-filters"
            onClick={() => setFiltersOpen(open => !open)}
            className={`henka-button flex items-center gap-1.5 border px-4 py-2.5 transition-colors ${
              activeCriteria.length > 0
                ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
                : 'border-stone-200 text-stone-600 hover:border-stone-400'
            }`}
          >
            <span style={{ fontSize: '14px' }}>⊞</span>
            Criteria
            {activeCriteria.length > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeCriteria.length}
              </span>
            )}
          </button>

          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-stone-400 hover:text-stone-700 underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className={styles.resultsBar}>
          <p role="status" className={viewMode === 'map' && !loading && !error && filtered.length > 0 ? 'sr-only' : 'text-stone-600 text-sm'}>
            {error ? 'Listings unavailable' : loading ? 'Loading...' : `Showing ${filtered.length} of ${businesses.length} businesses`}
          </p>
          <div className={styles.viewToggle}>
            <button
              aria-pressed={viewMode === 'map'}
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'map'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-500 hover:bg-stone-50'
              }`}
            >
              Map
            </button>
            <button
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-500 hover:bg-stone-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {locationError && <p role="alert" className={styles.message}>{locationError}</p>}
      {filtersOpen && <CriteriaDrawer onClose={closeFilters} returnFocusRef={criteriaTriggerRef}>
        <fieldset id="criteria-filters" className={styles.criteria}>
          <legend className="sr-only">Business criteria</legend>
          <p>Match every selected criterion. Practices are reported by businesses and are not independent certifications.</p>
          <div>{CRITERIA_NAMES.map(criterion => <label key={criterion}>
            <input type="checkbox" checked={activeCriteria.includes(criterion)} onChange={() => toggleCriteria(criterion)} />
            {criterion}
          </label>)}</div>
          <button type="button" className="henka-button" disabled={activeCriteria.length === 0} onClick={() => navigate({ criteria: null })}>Clear criteria</button>
        </fieldset>
      </CriteriaDrawer>}

      <section className={styles.results} aria-label="Business listings" aria-busy={loading}>
        {loading ? <p role="status" className={styles.message}>Loading businesses…</p>
          : error ? <div role="alert" className={styles.message}>
            <h2>We couldn’t load the directory.</h2>
            <p>Please check your connection and try again. Your filters have been kept.</p>
            <button onClick={() => setRetry(value => value + 1)}>Try again</button>
          </div>
          : filtered.length === 0 ? <div className={styles.message}>
            <h2>{businesses.length === 0 ? 'No approved listings are currently available.' : 'No businesses match your filters.'}</h2>
            {hasActiveFilters && <button onClick={clearAllFilters}>Clear filters</button>}
          </div>
          : <div className={viewMode === 'map' ? styles.mapLayout : styles.listLayout}>
            <div className={viewMode === 'map' ? styles.mapCards : undefined} aria-label="Results" tabIndex={0}>
              {filtered.map(business => <div key={business.id}
                ref={el => { cardRefs.current[business.id] = el }}
                onMouseEnter={() => setHoveredId(business.id)} onMouseLeave={() => setHoveredId(null)}>
                <BusinessCard business={business} isSelected={selectedId === business.id} onClick={() => setSelectedId(business.id)} showMapAction={viewMode === 'map'} />
              </div>)}
            </div>
            {viewMode === 'map' && <div className={styles.map}>
              <div className={styles.mapCounter} aria-hidden="true">Showing {filtered.length} of {businesses.length} businesses</div>
              <span className="sr-only">The count includes all filtered matches out of all loaded approved businesses. Map zoom does not change this count.</span>
              <BusinessMap onShowList={() => setViewMode('list')} businesses={filtered}
                selectedId={selectedId} hoveredId={hoveredId} onMarkerClick={handleMarkerClick} onClearSelection={() => setSelectedId(null)}
                onMarkerHover={setHoveredId} userLocation={mapUserLocation}
                activeRadius={mapRadius} activeSuburb={mapSuburb} />
            </div>}
          </div>}
      </section>
      </main>
    </div>
  )
}

function BusinessCard({
  business,
  isSelected,
  onClick,
  showMapAction,
}: {
  business: Business
  isSelected: boolean
  onClick: () => void
  showMapAction: boolean
}) {
  const iconPath = getCategoryIconPath(business.category)

  return (
    <div
      className={`${styles.card} py-4 border-b border-stone-100 transition-colors ${
        isSelected ? 'bg-emerald-50 -mx-6 px-6' : 'hover:bg-stone-50 -mx-2 px-2 rounded-lg'
      }`}
    >
      <Link className={styles.detailLink} href={`/businesses/${encodeURIComponent(business.slug)}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          {/* Category icon — replaces the small dot, doubles as the visual category cue */}
          {iconPath ? (
            <Image
              src={iconPath}
              alt=""
              width={32}
              height={32}
              className="flex-shrink-0 mt-0.5"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-stone-100 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h2 className="text-lg font-bold text-stone-900 hover:text-emerald-700 transition-colors">
                {business.name}
              </h2>
              {business.is_verified && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Owner-managed
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mb-2">
              {business.suburb} · {business.category}
            </p>
            {business.description && (
              <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                {business.description}
              </p>
            )}
            {(() => {
              // Prefer real criteria when populated; fall back to tags as a placeholder signal
              const credentials = business.criteria?.length
                ? business.criteria.slice(0, 3).join(', ')
                : formatTagList(business.tags, 3)

              if (!credentials) return null

              return (
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  <span className="text-stone-400">Criteria: </span>
                  {credentials}
                </p>
              )
            })()}
          </div>

          <span className="text-stone-300 hover:text-emerald-500 transition-colors flex-shrink-0 self-center">→</span>
        </div>
      </Link>
      {showMapAction && <button type="button" aria-pressed={isSelected} onClick={onClick} className={styles.showOnMap}>Show on map<span className="sr-only">: {business.name}</span></button>}
    </div>
  )
}
