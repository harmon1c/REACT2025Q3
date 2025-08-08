import React, { Suspense } from 'react';
import HomePageClient from '@/components/HomePageClient';
import { fetchPokemonList, fetchPokemonDetails } from '@/api/serverFetchers';
import { pokemonApi } from '@/api/pokemonApi';
import type { ProcessedPokemon } from '@/api/types';

function HomePageSkeleton(): React.JSX.Element {
  return (
    <div className="w-full animate-pulse" aria-label="loading">
      <div className="h-10 w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="h-24 w-full mb-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
            <div className="h-4 w-3/4 mb-2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PageProps {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const pageParam = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  const searchQueryRaw = Array.isArray(resolvedSearchParams?.search)
    ? resolvedSearchParams?.search[0]
    : resolvedSearchParams?.search;
  const detailsParam = Array.isArray(resolvedSearchParams?.details)
    ? resolvedSearchParams?.details[0]
    : resolvedSearchParams?.details;

  let initialResults: ProcessedPokemon[] = [];
  let initialTotalCount = 0;
  if (searchQueryRaw) {
    try {
      const details = await fetchPokemonDetails({ nameOrId: searchQueryRaw });
      initialResults = [pokemonApi.parsePokemonToProcessed(details)];
      initialTotalCount = 1;
    } catch {
      // ignore (likely not found)
    }
  } else {
    try {
      const list = await fetchPokemonList({
        offset: (page - 1) * 20,
        limit: 20,
      });
      initialResults = pokemonApi.parseListToProcessed(list);
      initialTotalCount = list.count;
    } catch {
      // silently fail (client will attempt later)
    }
    if (detailsParam) {
      try {
        await fetchPokemonDetails({ nameOrId: detailsParam });
      } catch {
        // ignore
      }
    }
  }

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient
        initialResults={initialResults}
        initialTotalCount={initialTotalCount}
      />
    </Suspense>
  );
}
