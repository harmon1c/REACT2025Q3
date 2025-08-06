'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PokemonCatalogueContainer } from '@/components/PokemonCatalogueContainer';
import PokemonDetailPanel from '@/components/PokemonDetailPanel';

function HomePageContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const details = searchParams.get('details');
  const searchQuery = searchParams.get('search');
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const showDetailsPanel = !!details;

  const detailsPanel = useMemo(() => {
    if (!showDetailsPanel || !details) {
      return null;
    }

    return (
      <div className="w-80 shrink-0">
        <PokemonDetailPanel pokemonName={details} />
      </div>
    );
  }, [showDetailsPanel, details]);

  const handlePageChange = (page: number): void => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    router.push(url);
  };

  return (
    <PokemonCatalogueContainer
      showDetailsPanel={showDetailsPanel}
      detailsPanel={detailsPanel}
      selectedPokemonName={details}
      initialPage={initialPage}
      initialSearchQuery={searchQuery}
      onPageChange={handlePageChange}
    />
  );
}

export default function HomePageClient(): React.JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
