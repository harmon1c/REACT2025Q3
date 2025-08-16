'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProcessedPokemon } from '@/api/types';
import { usePokemonData } from '@/hooks/usePokemonData';
import { Main } from './Main';
import { Panel } from './Panel';
import { Search } from './Search';
import { Results } from './Results';
import { Pagination } from './Pagination';
import PokemonDetailPanel from './PokemonDetailPanel';

interface DetailsPanelLikeProps {
  onClose?: () => void;
  [key: string]: unknown;
}

interface PokemonCatalogueContainerProps {
  showDetailsPanel?: boolean;
  onPokemonClick?: (name: string) => void | Promise<void>;
  selectedPokemonName?: string | null;
  detailsPanel?: React.ReactElement<DetailsPanelLikeProps>;
  initialPage?: number;
  initialSearchQuery?: string | null;
  onPageChange?: (page: number) => void;
  initialResults?: ProcessedPokemon[];
  initialTotalCount?: number;
  labels: {
    search: {
      title: string;
      description: string;
      placeholder: string;
      button: string;
      clear: string;
    };
    results: {
      loading: string;
      loading_description: string;
      error_title: string;
      error_suggestion: string;
      no_results_title: string;
      no_results_description: string;
      popular_searches: string;
    };
    pagination: {
      previous: string;
      next: string;
    };
  };
}

function getSavedSearchTerm(): string {
  try {
    const value = window.localStorage.getItem('searchTerm');
    return value ? value : '';
  } catch {
    return '';
  }
}

export const PokemonCatalogueContainer: React.FC<
  PokemonCatalogueContainerProps
> = ({
  showDetailsPanel = false,
  onPokemonClick,
  selectedPokemonName,
  detailsPanel,
  initialPage = 1,
  initialSearchQuery,
  onPageChange,
  initialResults,
  initialTotalCount,
  labels,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    () => initialSearchQuery || getSavedSearchTerm()
  );
  const {
    results,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchPokemon,
    loadPage,
    clearResults,
  } = usePokemonData(selectedPokemonName, initialPage, onPageChange, {
    initialResults,
    initialTotalCount,
    hydrateOnly: !!initialResults?.length,
  });
  // labels are required now (server-provided)

  useEffect(() => {
    if (initialSearchQuery) {
      const trimmed = initialSearchQuery.trim();
      if (trimmed && (!initialResults || initialResults.length === 0)) {
        searchPokemon(trimmed.toLowerCase());
      }
    }
  }, [initialSearchQuery, initialResults, searchPokemon]);

  const handleSearch = (query: string): void => {
    const trimmed = query.trim();
    setSearchTerm(trimmed);
    window.localStorage.setItem('searchTerm', trimmed);

    if (trimmed) {
      searchPokemon(trimmed.toLowerCase());
      const params = new URLSearchParams(window.location.search);
      params.set('search', trimmed);
      params.delete('details');
      params.delete('page');
      router.push(`/?${params.toString()}`);
    } else {
      clearResults();
      const params = new URLSearchParams(window.location.search);
      params.delete('search');
      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : '/';
      router.push(url);
    }
  };

  const handlePageChange = (page: number): void => {
    loadPage(page);
    onPageChange?.(page);
    try {
      const params = new URLSearchParams(window.location.search);
      if (page > 1) {
        params.set('page', page.toString());
      } else {
        params.delete('page');
      }
      const query = params.toString();
      const url = query ? `/?${query}` : '/';
      router.push(url);
    } catch {
      // ignore if window not available (SSR safety)
    }
  };

  const handleCloseDetails = (): void => {
    router.push('/');
  };

  const handlePokemonClick = async (pokemonName: string): Promise<void> => {
    if (!searchTerm.trim()) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('details', encodeURIComponent(pokemonName));
      router.push(`?${newParams.toString()}`);
    }

    if (onPokemonClick) {
      await onPokemonClick(pokemonName);
    }
  };

  const handleSearchInputChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleClear = (): void => {
    setSearchTerm('');
    window.localStorage.setItem('searchTerm', '');
    clearResults();
    router.push('/');
  };

  return (
    <Main panel={false}>
      <Panel className={showDetailsPanel ? 'flex gap-6' : 'w-full'}>
        <div className={showDetailsPanel ? 'flex-1' : 'w-full'}>
          <section className="search-section mb-4">
            <Search
              value={searchTerm}
              onChange={handleSearchInputChange}
              onSearch={handleSearch}
              onClear={handleClear}
              labels={labels.search}
            />
          </section>
          <section className="results-section">
            <Results
              results={results}
              isLoading={isLoading}
              error={error}
              onPokemonClick={handlePokemonClick}
              labels={labels.results}
            />
            {results.length > 0 && !isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                labels={labels.pagination}
              />
            )}
          </section>
        </div>
        {showDetailsPanel && (selectedPokemonName || detailsPanel) && (
          <div className="w-80 shrink-0">
            {detailsPanel
              ? React.cloneElement(detailsPanel, {
                  onClose: handleCloseDetails,
                })
              : selectedPokemonName && (
                  <PokemonDetailPanel
                    pokemonName={selectedPokemonName}
                    onClose={handleCloseDetails}
                  />
                )}
          </div>
        )}
      </Panel>
    </Main>
  );
};
