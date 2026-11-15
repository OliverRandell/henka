# Directory and detail-route review

The shared header is rendered once in the root layout, outside page containers. Content pages retain centred containers. The directory uses a viewport-height shell with a compact toolbar and a 33% results / 67% map split above 900px. Below that breakpoint, List and Map are separate views. Public map configuration is unchanged.

Filters use Next.js native history integration to keep `useSearchParams`, Back/Forward and browser URLs in sync without requesting server-rendered pages for local filtering. Default view is Map; `?view=list` selects List. Clearing filters retains view state.

## Detail 404 cause

The browser Supabase client normalized an accidental `/rest/v1/` suffix in the project URL; the server client did not. The SDK appended that suffix again and the old detail page converted query errors into not-found responses. Both clients now use one configuration helper. `.maybeSingle()` distinguishes an absent approved slug from a query failure, which reaches the error boundary. No slug regeneration or database writes were necessary: all 146 approved records had unique, populated slugs, including `oak-young-wine`.

The directory's search-parameter Suspense boundary is scoped to its own page instead of wrapping business details. Direct invalid-slug requests can return HTTP 404 before streaming begins.

## Verification

TypeScript, targeted lint, production build and five automated helper tests passed. Full ESLint retains the existing 12 errors and two warnings (CommonJS scripts, unescaped text on existing forms, an image warning and an unused directive). Existing build warnings concern metadataBase, edge generation and Node deprecation.

Read-only Supabase checks found 146 approved businesses with valid coordinates. Runtime checks returned 200 for oak-young-wine, homie and hunter-gatherer, and 404 for an invented slug. Headless Chrome verified full-width headers, white background, search/category/suburb/criteria URL updates, denied location permission, connection error instead of zero listings, mobile view switching, skip-link focus, and desktop/mobile/tablet overflow. The final localhost session rendered 146 markers and result selection opened a map info window. A real marker click selected the matching result without leaving /businesses; marker hit areas measured 44px. Initial isolated-origin sessions produced RefererNotAllowedMapError; no Cloud restrictions were changed.

Manual QA still recommended: iOS/Android browsers, screen-reader announcements, successful location permission on a real device, and touch/keyboard traversal in dense map-marker areas. Google Cloud referrer allowances may differ by hostname and port.

Preview: http://localhost:3000/businesses. Start with `npm run build` then `npm run start -- --hostname 127.0.0.1 --port 3000`; or use `npm run dev -- --hostname 127.0.0.1 --port 3000`. Stop the existing local preview before restarting. No deployment is needed.

## Files changed in this review

- `src/app/layout.tsx`, `src/app/globals.css`: global header, surface, tokens, interaction styles.
- `src/components/ResearchSite.tsx`, `src/components/ResearchSite.module.css`: content shell and header styling.
- `src/app/businesses/page.tsx`, `src/app/businesses/Directory.module.css`, `src/app/businesses/layout.tsx`: compact controls, native URL state, responsive viewport layout, scoped Suspense.
- `src/app/businesses/[slug]/page.tsx`: correct error/404 behaviour, shared content container, Henka branding and reported-practice wording.
- `src/lib/supabase/config.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`: shared URL normalization.
- `src/components/listings/BusinessMap.tsx`, `src/components/listings/DirectoryMapProvider.tsx`: selection panning, close/reset, marker targets and late authentication failure handling.
- `src/app/claim/page.tsx`, `src/app/businesses/submit/page.tsx`, `src/app/for-businesses/page.tsx`, `src/app/suburb/[suburb]/page.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`: remove duplicate navigation in favour of the global header.
- `src/app/og/route.tsx`: Henka wordmark.
- `tests/directory.test.mjs`: shared configuration regression coverage.
- `docs/directory-review.md`: implementation and QA record.

## Final refinements before branding review

The mobile scroll problem came from applying desktop body overflow and viewport constraints at all widths. The desktop lock now applies only above 900px. Mobile uses document scrolling, a naturally flowing toolbar, and a map sized with `vh` fallback and `svh`; cooperative map gestures are unchanged. Only the native modal criteria drawer locks the mobile background, preserving scroll position and restoring focus explicitly to its trigger. Standalone List uses the shared 48rem article width. The split map remains full width.

The floating map counter shows filtered matches out of all loaded approved businesses, independent of map bounds. The accessible live status remains in the toolbar; its visible text is suppressed in Map view when the floating count is shown. There is no extra visible counter in List view. Criteria mapping and URL state are unchanged.

Real Chrome checks against the final build covered 320px and 390px mobile widths, reaching the final listing, wheel scrolling over the map, modal focus and scroll locking/restoration, multiple criteria and Clear criteria, filter and location counter updates, all 146 markers, desktop sidebar scrolling, the 48rem standalone list, and computed navigation/button typography. Actual iOS Safari, dynamic browser chrome and VoiceOver remain manual checks; Safari-compatible viewport fallbacks and modal fixed-body restoration were inspected in code.

An older development server responds on localhost/IPv6 port 3000. It was left untouched. The final production preview is bound to **127.0.0.1:3000**; use http://127.0.0.1:3000/businesses for this review. The isolated QA browser resolved localhost to that IPv4 server to test the existing Maps referrer configuration. No keys or Cloud restrictions changed.

Final explicit IPv4 verification confirmed mobile document scrolling and scroll gestures over the map at 320px, modal focus restoration, and location counter updates. Google rejected the IPv4 origin with `RefererNotAllowedMapError`, so live map rendering at http://127.0.0.1:3000 still requires an approved referrer configuration. The localhost QA session rendered all 146 markers; no Maps integration code or credentials were changed in this refinement. Do not change Cloud restrictions without approval.
