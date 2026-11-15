# Research, typography and mobile scrolling review

All changes remain local and uncommitted on main. Existing staged fonts, directory logic, map integration and data clients are preserved.

## Root causes and changes

Navigation requested 500 but the CSS did not define a medium face. Font metadata identified GaretT Book as 300, Regular as 400, Medium as 500 and Bold as 700. The Book file had been incorrectly declared as 400. Local GaretT faces are now declared with those actual weights; the legacy Garet 400 alias also points to Regular. Browser font inspection confirmed navigation glyphs come from GaretT-Medium rather than a synthetic face.

The localhost development server and IPv4 production server were serving different CSS. The stale localhost build applied an unconditional document scroll lock to the directory. Both canonical port-3000 servers were replaced with one current IPv4 preview; localhost falls back to that listener. Global directory-triggered body overflow rules were removed. The desktop directory now contains its own viewport height using the measured shared-header height, while document scrolling remains available. Mobile keeps normal document scrolling. The native criteria drawer alone temporarily fixes the body; cleanup restores its prior styles, scroll position and trigger focus, including failure to open the modal.

Navigation uses the supplied 12px/500/18px/0.1em GaretT styling. Shared buttons retain colours and shape with 0.1em spacing. Editorial H1 uses clamp(2.5rem, 5vw, 6rem), with a separate mobile clamp. Eyebrows use 0.8rem/400/0.109375em, with explicit specificity inside articles. Directory and business result headings are unaffected.

## Research pages

/survey and /business use the shared content container and header. Each explains purpose, intended participants, participation and privacy, with an external Google Forms responder CTA using target=_blank and rel=noopener noreferrer. Home links distinguish the two research pages; primary navigation is unchanged. No questions are duplicated, forms embedded or responses submitted. Existing forms and spreadsheets were not edited.

Both supplied short links were resolved read-only. Consumer form responded successfully. The business form redirected to closedform, so the business landing page includes an explicit latest-check availability notice. Reopening responses is a Google Forms owner action; no settings were changed here.

## Verification

TypeScript, targeted lint, production build and five automated directory/configuration tests passed. Full lint retains the existing 12 errors and two warnings. Existing build warnings concern metadataBase, edge static generation and Node deprecation.

Real Chrome touch gestures scrolled Home, About, both research pages and directory List/Map at 390px, with the final listing reachable. No horizontal overflow was observed at 320px or 390px. Desktop viewport fit, independent results scrolling and 146 map markers were verified. Computed navigation font, weight, line height, spacing and colour matched the requested values; CSS.getPlatformFontsForNode reported GaretT-Medium. H1 measured 72px at 1440px, and Home eyebrow/button typography matched the requested values. Final modal tests covered focus restoration, scroll release and location-filtered marker/counter updates. Both research CTA responder URLs and external-link attributes were inspected in the browser.

Actual iOS Safari, browser toolbar resizing and VoiceOver remain manual checks. Safari-compatible vh/svh/dvh fallbacks and modal body restoration were checked in code, not in Safari. The business form remains closed to responses at the latest check.

## Files changed

- src/app/globals.css
- src/app/businesses/Directory.module.css
- src/components/SiteHeader.tsx
- src/components/CriteriaDrawer.tsx
- src/components/ResearchSite.module.css
- src/components/ResearchSite.tsx
- src/components/ResearchSurvey.tsx
- src/app/survey/page.tsx
- src/app/business/page.tsx
- src/app/page.tsx
- src/lib/research-forms.ts
- docs/research-typography-review.md

## Preview

Single canonical preview: http://localhost:3000 (also http://127.0.0.1:3000). Research routes: /survey and /business. Restart with npm run build, then npm run start -- --hostname 127.0.0.1 --port 3000 after stopping the existing preview. Public Maps key referrer restrictions are unchanged; use the allowed localhost origin when reviewing Maps.
