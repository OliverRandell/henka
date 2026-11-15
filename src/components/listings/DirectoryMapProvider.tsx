'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { APIProvider, useApiLoadingStatus } from '@vis.gl/react-google-maps'

function MapAvailability({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const status = useApiLoadingStatus()
  const [timedOut, setTimedOut] = useState(false)
  const [authenticationFailed, setAuthenticationFailed] = useState(false)
  useEffect(() => {
    // Google reports some map authorisation failures after the script has loaded.
    const mapsWindow = window as Window & { gm_authFailure?: () => void }
    const previous = mapsWindow.gm_authFailure
    const handler = () => { setAuthenticationFailed(true); previous?.() }
    mapsWindow.gm_authFailure = handler
    return () => {
      if (mapsWindow.gm_authFailure === handler) mapsWindow.gm_authFailure = previous
    }
  }, [])
  useEffect(() => {
    if (status === 'LOADED') return
    const timer = setTimeout(() => setTimedOut(true), 15000)
    return () => clearTimeout(timer)
  }, [status])
  if (authenticationFailed || status === 'AUTH_FAILURE') return <MapStatus message="Google Maps could not authorise this map. Business listings are still available.">{fallback}</MapStatus>
  if (status === 'FAILED' || (timedOut && status !== 'LOADED')) return <MapStatus message="Google Maps could not load. Check your connection or use the list.">{fallback}</MapStatus>
  if (status !== 'LOADED') return <p role="status" className="p-6">Loading Google Maps…</p>
  return children
}

function MapStatus({ message, children }: { message: string; children: ReactNode }) {
  return <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
    <p role="status">{message}</p>{children}
  </div>
}

export default function DirectoryMapProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim()
  if (!apiKey || !mapId) return <MapStatus message="The map is not configured yet. You can still browse all businesses in the list.">{fallback}</MapStatus>

  return (
    <APIProvider apiKey={apiKey}>
      <MapAvailability fallback={fallback}>{children}</MapAvailability>
    </APIProvider>
  )
}
