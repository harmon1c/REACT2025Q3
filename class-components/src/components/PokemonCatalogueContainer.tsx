import React from 'react';
import { usePokemonData } from '../hooks/usePokemonData';
import { Main } from './Main';
import { Search } from './Search';
import { Results } from './Results';
import { Pagination } from './Pagination';

interface PokemonCatalogueContainerProps {
  showDetailsPanel?: boolean;
  detailsPanel?: React.ReactNode;
  onPokemonClick?: (name: string) => void | Promise<void>;
}

export const PokemonCatalogueContainer: React.FC<
  PokemonCatalogueContainerProps
> = ({ showDetailsPanel = false, detailsPanel = null, onPokemonClick }) => {
  const {
    results,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchPokemon,
    loadPage,
    clearResults,
    clearSelection,
    setPage,
    clearParams,
  } = usePokemonData();

  const handleSearch = (query: string): void => {
    clearSelection();
    if (!query.trim()) {
      clearParams(['page', 'details']);
      setPage(1);
    } else {
      clearParams(['details']);
    }
    searchPokemon(query);
  };

  const handlePageChange = (page: number): void => {
    clearParams(['details']);
    clearSelection();
    loadPage(page);
  };

  const handlePokemonClick = async (pokemonName: string): Promise<void> => {
    if (onPokemonClick) {
      await onPokemonClick(pokemonName);
    }
  };

  return (
    <Main>
      <div className={showDetailsPanel ? 'flex gap-6' : 'w-full'}>
        <div className={showDetailsPanel ? 'flex-1' : 'w-full'}>
          <section className="search-section mb-4">
            <Search
              onSearch={handleSearch}
              onClear={() => {
                clearResults();
                clearSelection();
              }}
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
        {showDetailsPanel && detailsPanel}
      </div>
    </Main>
  );
};
