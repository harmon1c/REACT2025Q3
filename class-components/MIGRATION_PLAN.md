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

## Phase 6: Home Page SSR

- Convert `[locale]/page.tsx` to Server Component performing initial list fetch
- Accept `searchParams` (offset, search)
- Conditional: if `search` -> fetch single details; else list
- Pass initial data to client child (split interactive parts)
- (⭐) Use Suspense + streaming skeleton

## Phase 7: Dynamic Pokemon Route

- `app/[locale]/pokemon/[name]/page.tsx` (Server)
- `generateStaticParams` (limit first N names, e.g. 50) + runtime fallback
- Handle 404 via `notFound()`
- `generateMetadata` for SEO (title, description, OpenGraph sprite)

## Phase 8: Component Split & Image Optimization

- Audit components: mark only necessary with `'use client'`
- Convert remaining `<img>` → `<Image>` with proper `alt` and sizes
- Replace manual locale path manipulations with `useLocale()` & localized navigation utilities
- (🆕) Ensure tree-shaking by avoiding unnecessary client imports in server components

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

## Next Immediate Action (Phase 6 Prep)

1. Extend server handling for `search` (conditional fetch when query present) (optional if required by spec)
2. Implement dynamic route `app/[locale]/pokemon/[name]/page.tsx`
3. Add `notFound()` + basic error mapping helper (`src/api/errorMap.ts`)
4. Add `generateMetadata` for dynamic pages
5. Consider prefetching detail when `details` query param on home (minor UX win)

---

## Tracking TODO Markers

Search for `MIGRATION_TODO` as they are added in future commits to ensure closure.

---

Feel free to adjust phases if the scope shifts; keep commits narratively clean.
