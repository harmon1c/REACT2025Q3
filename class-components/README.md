# Pokemon Explorer (Next.js 15 SSR + i18n)

Internationalized Pokemon catalogue built with Next.js App Router (v15), server components, server actions (CSV export), and selective client interactivity.

## High-Level Architecture

| Concern                      | Approach                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Routing                      | App Router with `[locale]` segment, dynamic detail route `/[locale]/pokemon/[name]`                        |
| i18n                         | `next-intl` with middleware locale detection (`en`, `ru`, prefix always)                                   |
| Data Fetching (list/details) | Server utilities (`serverFetchers.ts`) using Next.js fetch caching + `revalidate` timings                  |
| Initial Page SSR             | `[locale]/page.tsx` performs list or single-item search fetch on server; hydrates client with initial data |
| Dynamic Details              | Server route fetch + `generateStaticParams` subset + `notFound()` on 404                                   |
| CSV Export                   | Server Action `buildCsvAction` (no client fetch round-trip)                                                |
| State                        | Redux Toolkit (client) for selection + RTK Query for interactive refetches                                 |
| Images                       | `next/image` everywhere (sprites + assets)                                                                 |
| Error Handling               | ErrorBoundary + route-level `error.tsx` + `not-found.tsx`                                                  |
| Theming                      | Custom context (light/dark)                                                                                |

## SSR & Data Flow

1. Incoming request hits `middleware.ts` → locale extracted / defaulted.
2. `[locale]/page.tsx` resolves `params` & `searchParams` (page, search, details).
3. Server chooses path:

- `search` present → fetch a single pokemon → hydrate list with one result.
- otherwise → paginated list fetch (offset/limit) + optional prefetch for `details` param.

4. Data transformed via `pokemonApi.parse*` helper into lightweight list items.
5. Props passed to client container `PokemonCatalogueContainer` (only interactive UI + RTK Query for further actions).
6. Optional side panel (detailsParam) rendered with `PokemonDetailPanel` using RTK Query (cached after SSR prefetch attempt).

## Revalidation Strategy

Defined in `serverFetchers.ts`:

```
LIST: 60s, DETAILS: 300s
```

Uses `next: { revalidate: ... }` and cache mode to balance freshness/performance.

## Internationalization

- `middleware.ts` + `navigation.ts` unify locale handling (`localePrefix: 'always'`).
- `NextIntlClientProvider` keyed by `locale` in layout for proper context updates.
- All UI labels resolved server-side via `getTranslations` and passed as plain props (reduces client translation calls).
- Locale switch rewrites path stripping existing locale and pushing with `{ locale }` option.

## Server Action: CSV Export

`buildCsvAction`:

- Validates ID list with Zod (1..200 entries).
- Fetches details in parallel with safe fallbacks.
- Generates CSV (utility `buildPokemonCsv`).
- Consumed by `SelectedFlyout` directly → no extra API round-trip.

## Client vs Server Boundary

Client components kept minimal:

- Header (theme + locale switch)
- Selection Flyout (CSV trigger, stateful UI)
- Search, Pagination, Results presentation (interactivity)
- PokemonDetailPanel (live refetch & RTK Query cache)
- ErrorBoundary (must be client)

Everything else (layout, pages, static shells, data fetching) is server.

## Dynamic Pokemon Route

`/[locale]/pokemon/[name]`:

- `generateStaticParams`: small preload set.
- `generateMetadata`: dynamic SEO (title, OG image) or fallback.
- `notFound()` invoked when underlying fetch throws `POKEMON_NOT_FOUND`.

## Error Mapping

`errorMap.ts` standardizes messages (e.g., `POKEMON_NOT_FOUND`). Used in dynamic routes & client panels for consistent UX.

## Scripts

```bash
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run format:fix # Prettier
```

## Environment

- Node >= 20.19.0 (22.x recommended)
- TypeScript strict mode
- Tailwind + SCSS hybrid styling

## Pending / Deferred

- Tests for server action & dynamic route (metadata + notFound)
- Potential streaming/chunk CSV for very large exports
- Further server/client splitting if bundle metrics require

## Migration Phases

See `MIGRATION_PLAN.md` for chronological detail (Phases 1–10).

## License

MIT
