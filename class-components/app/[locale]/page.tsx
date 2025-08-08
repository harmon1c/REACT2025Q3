import HomePageClient from '@/components/HomePageClient';
import { fetchPokemonList } from '@/api/serverFetchers';
import { pokemonApi } from '@/api/pokemonApi';
import type { ProcessedPokemon } from '@/api/types';

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

  let initialResults: ProcessedPokemon[] = [];
  let initialTotalCount = 0;
  if (!searchQueryRaw) {
    try {
      const list = await fetchPokemonList({
        offset: (page - 1) * 20,
        limit: 20,
      });
      initialResults = pokemonApi.parseListToProcessed(list);
      initialTotalCount = list.count;
    } catch {
      // silently fail
    }
  }

  return (
    <HomePageClient
      initialResults={initialResults}
      initialTotalCount={initialTotalCount}
    />
  );
}
