# Next.js Migration & Enhancement Plan

This document tracks the phased migration and improvements. Each phase = one commit (or small group if necessary). Items with (✔) done, (🆕) newly added refinements, (⭐) optional enhancement.

---

## Phase 1: Init (✔)

- Next.js 15 App Router initialized
- Tailwind, TypeScript, eslint, vitest integrated

## Phase 2: Internationalization (✔)

- `next-intl` configured (`i18n.ts`, `middleware.ts`)
- Messages for `en`, `ru`
- Locale-aware routing via `[locale]` segment

## Phase 3: State (✔ baseline)

- Redux Toolkit + RTK Query wired via `ReduxProvider`
- LocalStorage hydration for `selectedItems` (client only)
- (⭐) Future: SSR prefetch + hydrate pattern if needed

## Phase 4: Base Pages & Layout (✔)

- Root `[locale]/layout.tsx` with providers
- `error.tsx`, `not-found.tsx`, `about/page.tsx`
- Header/Footer/Layout components migrated
- 🆕 FIX: Corrected `layout.tsx` params signature (removed Promise)

---

## Phase 5: Server Data Fetch Layer (✔)

- ✔ Server fetch utilities (`src/api/serverFetchers.ts`)
- ✔ Initial server list fetch in `[locale]/page.tsx` with `searchParams`
- ✔ Hydration path: pass `initialResults`, `initialTotalCount` → client
- ✔ Hook updated (`usePokemonData`) to accept initial data + `hydrateOnly`
- ☐ Server-side search (deferred to Phase 6 or later)
- ☐ Prefetch details for `details` param (optional)
- ☐ Error mapping helper + `notFound()` integration (later with dynamic routes)
- Revalidation strategy (list=60s, details=300s) documented in code

## Phase 6: Home Page SSR (✔)

- (✔) `[locale]/page.tsx` Server Component performing initial list/search fetch
- (✔) Accepts `searchParams` (page, search)
- (✔) Conditional server-side search (single detail) hydration
- (✔) Passes initial data to client child (interactive separated)
- (✔) Streaming Suspense skeleton (list + search placeholder)

Notes: Suspense boundary moved to server component for faster first paint; client wrapper simplified.

## Phase 7: Dynamic Pokemon Route (✔ except tests)

- (✔) Basic dynamic route `app/[locale]/pokemon/[name]/page.tsx` (Server)
- (✔) `generateStaticParams` with limited preload list (subset of popular names)
- (✔) 404 handling via `notFound()` when pokemon missing
- (✔) `generateMetadata` for SEO (title, description, OpenGraph image)
- (✔) Initial error mapping helper `src/api/errorMap.ts`
- (✔) Integrate shared error mapping in client detail panel
- (✔) Sticky panel style extracted into `StickyPanel` (mini-refactor)
- ( ) Tests: metadata + notFound behavior (deferred)

## Phase 8: Component Split & Image Optimization (✔ Complete)

- ✔ Audit: only truly interactive components remain client: catalogue container, detail panel, selection flyout, search, pagination, header (theme + locale), error boundary.
- ✔ All `<img>` replaced by `<Image>` (Card, Footer, PokemonDetailPanel). No raw `<img>` left.
- ✔ Removed repeated client translation hooks; labels now fully server-supplied. Client fallback removed for strict typing.
- ✔ `HomePageClient` removed.
- ✔ Header refactored to use `useLocale` + router navigation.
- ✔ Locale duplication bug fixed (path normalization in HeaderClient).
- ✔ Inlined previous `PokemonCatalogueServer` logic directly into `[locale]/page.tsx` (component now removed).
- ✔ Lazy load `SelectedFlyout` via dynamic import inside `Results` (reduced initial JS bundle).
- ✔ Migration plan updated (English) to reflect final architecture.
- ℹ Results component still client due to selection overlay & click handlers; deeper split deferred until bundle metrics justify.

### Deferred / Optional (⭐)

- (⭐) Portal + animation for SelectedFlyout (currently simple fixed element).
- (⭐) Further split Results into server shell + small client overlay if bundle size analysis suggests gains.
- (⭐) CSV export server action (Phase 9 scope) might allow moving download logic server-side.
- (⭐) Bundle & Lighthouse review to quantify JS reduction from lazy loading.

## Phase 9: Server Actions & CSV Export

- Server Action: `exportSelectedToCSV` (receives ids, fetches details in parallel)
- Return streamed `text/csv` or force download via Response
- Form or button posting `selectedItems`
- (🆕) Validation (zod) + limit (#items) + error fallback UI
- (⭐) Server Action to persist selections (cookie / signed token)

## Phase 10: Optimization & Final QA

- Route segment config: `revalidate` / `dynamic = 'force-static'` where stable
- Bundle analysis (`@next/bundle-analyzer`) (⭐)
- Accessibility & performance audit (Lighthouse baseline targets: LCP < 2.5s)
- Add tests: server fetch utilities, dynamic route behavior, 404 handling
- Final README update + MIGRATION summary + cleanup TODO markers

---

## Cross-Cutting Refinements (🆕 Added)

- Normalize error codes (e.g. 'POKEMON_NOT_FOUND') for server -> client mapping
- Document caching decisions inline in `serverFetchers.ts`
- Ensure consistent type reuse between RTK Query and server utilities
- Evaluate potential removal of unused Vite-era dependencies (if any) later

## Risk Notes

- Large prefetch can inflate build time: limit static params
- Keep CSV export memory-safe: stream or chunk for large selections
- Avoid double data fetching: separate server-provided initial data from client re-queries

## Next Immediate Action (Phase 8 Ongoing)

1. Evaluate removing 'use client' from Footer (likely can be server)
2. Confirm no residual imports of removed `HomePageClient` (✅ done)
3. Consider moving non-interactive portions of `PokemonCatalogueContainer` to a server shell (potential Phase 8b)
4. Replace remaining inline images if any new added (monitor)
5. Plan server action scaffolding for CSV export (Phase 9)

---

## Tracking TODO Markers

Search for `MIGRATION_TODO` as they are added in future commits to ensure closure.

---

Feel free to adjust phases if the scope shifts; keep commits narratively clean.
