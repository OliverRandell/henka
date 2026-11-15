'use client'

import type { ReactNode } from 'react'
import { APIProvider, useApiLoadingStatus } from '@vis.gl/react-google-maps'

function MapAvailability({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const status = useApiLoadingStatus()
  if (status === 'FAILED' || status === 'AUTH_FAILURE') return fallback
  return children
}

export default function DirectoryMapProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim()
  if (!apiKey || !mapId) return fallback

  return (
    <APIProvider apiKey={apiKey}>
      <MapAvailability fallback={fallback}>{children}</MapAvailability>
    </APIProvider>
  )
}
