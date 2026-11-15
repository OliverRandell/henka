# Directory Maps configuration

The directory and listing detail maps use `@vis.gl/react-google-maps`, the Maps JavaScript API, and Advanced Markers. Enable **Maps JavaScript API** in a Google Cloud project with billing configured. Create a **JavaScript map ID** for Advanced Markers. Places, Geocoding, Maps Embed and Directions APIs are not called by the directory. Near Me uses browser geolocation. Coordinates come from Supabase. The separate `scripts/geocode.js` maintenance script calls Geocoding and writes data: do not run it to test the directory.

## Local configuration

Add these names to the root `.env.local` (never commit credentials):

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use the Supabase project root URL. The browser client also tolerates an accidental `/rest/v1/` suffix. Keep the existing Supabase credentials; do not use a service-role key in a public variable.

Restrict the browser Maps key to Maps JavaScript API and HTTP website referrers. Allow the exact local origins used, such as `http://localhost:3000/*` and `http://127.0.0.1:3000/*`. Use a separate restricted key for deployed domains. Do not remove restrictions to make a failing request work. Confirm allowed domains, API enablement and billing in Cloud Console. The key is necessarily visible to the browser; restrictions are essential.

## Vercel

Set the same four public variable names in the appropriate Development, Preview and Production environments. Allow the actual approved preview/production hostnames in the relevant key restrictions. Public variables are embedded at build time: restart local development after changes and create a new build for production preview. Deployment requires separate approval; no Vercel settings or Cloud infrastructure were changed here.

## Independent diagnostics

- Missing Maps key or map ID: configuration state; use list fallback.
- Script/network timeout: load failure; list remains available.
- Authentication failure: check enabled API, referrer restrictions and billing. Consult browser console for Google's precise error; never copy keys into a report.
- No matching businesses: genuine filtered empty state, independent of Maps.
- Supabase failure: directory connection error with retry, never a zero-result claim.
- Missing/invalid coordinates: listing stays in results, omitted from markers with a count notice.

## Verification still required with credentials

Check desktop/tablet/mobile map rendering, keyboard markers, selection from list and map, info windows, category hover, suburb bounds, Near Me radius, denied location permission, back/forward URL state, blocked script, invalid key, and zero-result filters. Run `node --test tests/directory.test.mjs`, `npx tsc --noEmit --incremental false`, targeted ESLint and `npm run build` first.

Preview: `npm run dev -- --hostname 127.0.0.1 --port 3000`, then http://127.0.0.1:3000/businesses?view=map. Stop any existing server on that port first.

References: https://developers.google.com/maps/documentation/javascript/advanced-markers/start and https://developers.google.com/maps/documentation/javascript/get-api-key
