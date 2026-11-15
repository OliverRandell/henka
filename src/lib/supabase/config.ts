export function getSupabaseConfig() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!configuredUrl || !key) throw new Error('Directory connection is not configured.')
  return { url: configuredUrl.replace(/\/rest\/v1\/?$/, ''), key }
}
