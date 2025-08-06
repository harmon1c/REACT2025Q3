'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePokemonData } from '@/hooks/usePokemonData';
import { Main } from './Main';
import { Search } from './Search';
import { Results } from './Results';
import { Pagination } from './Pagination';

interface PokemonCatalogueContainerProps {
  showDetailsPanel?: boolean;
  detailsPanel?: React.ReactElement<{ onClose: () => void }> | null;
  onPokemonClick?: (name: string) => void | Promise<void>;
  selectedPokemonName?: string | null;
  initialPage?: number;
  initialSearchQuery?: string | null;
  onPageChange?: (page: number) => void;
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
  detailsPanel = null,
  onPokemonClick,
  selectedPokemonName,
  initialPage = 1,
  initialSearchQuery,
  onPageChange,
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
  } = usePokemonData(selectedPokemonName, initialPage, onPageChange);

  useEffect(() => {
    if (initialSearchQuery) {
      const trimmed = initialSearchQuery.trim();
      if (trimmed) {
        searchPokemon(trimmed.toLowerCase());
      }
    }
  }, [initialSearchQuery, searchPokemon]);

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
    <Main>
      <div className={showDetailsPanel ? 'flex gap-6' : 'w-full'}>
        <div className={showDetailsPanel ? 'flex-1' : 'w-full'}>
          <section className="search-section mb-4">
            <Search
              value={searchTerm}
              onChange={handleSearchInputChange}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </section>
          <section className="results-section">
            <Results
              results={results}
              isLoading={isLoading}
              error={error}
              onPokemonClick={handlePokemonClick}
            />
            {results.length > 0 && !isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
        {showDetailsPanel &&
          detailsPanel &&
          React.cloneElement(detailsPanel, { onClose: handleCloseDetails })}
      </div>
    </Main>
  );
};
