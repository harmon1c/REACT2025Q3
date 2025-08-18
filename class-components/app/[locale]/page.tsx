import React, { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { PokemonCatalogueContainer } from '@/components/PokemonCatalogueContainer';
import RecentSubmissionsClient from '@/features/forms/components/RecentSubmissionsClient';
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
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({
  searchParams,
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
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

  const showDetailsPanel = !!detailsParam;
  const t = await getTranslations({ locale });
  const uiT = await getTranslations({ locale, namespace: 'ui' });
  const labels = {
    search: {
      title: t('search.title'),
      description: t('search.description'),
      placeholder: t('search.placeholder'),
      button: t('search.button'),
      clear: t('search.clear'),
    },
    results: {
      loading: t('results.loading'),
      loading_description: t('results.loading_description'),
      error_title: t('results.error_title'),
      error_suggestion: t('results.error_suggestion'),
      no_results_title: t('results.no_results_title'),
      no_results_description: t('results.no_results_description'),
      popular_searches: t('results.popular_searches'),
    },
    pagination: {
      previous: t('pagination.previous'),
      next: t('pagination.next'),
    },
  } as const;

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <div className="space-y-2">
        <section className="mx-auto max-w-5xl w-full px-4 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">
              {uiT('recent_submissions')}
            </h2>
          </div>
          <RecentSubmissionsClient />
        </section>
        <PokemonCatalogueContainer
          initialResults={initialResults}
          initialTotalCount={initialTotalCount}
          selectedPokemonName={detailsParam}
          initialPage={page}
          initialSearchQuery={searchQueryRaw}
          showDetailsPanel={showDetailsPanel}
          labels={labels}
        />
      </div>
    </Suspense>
  );
}
