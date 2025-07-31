import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonData } from '../hooks/usePokemonData';
import { Main } from './Main';
import { Search } from './Search';
import { Results } from './Results';
import { Pagination } from './Pagination';

interface PokemonCatalogueContainerProps {
  showDetailsPanel?: boolean;
  detailsPanel?: React.ReactElement<{ onClose: () => void }> | null;
  onPokemonClick?: (name: string) => void | Promise<void>;
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
> = ({ showDetailsPanel = false, detailsPanel = null, onPokemonClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(() => getSavedSearchTerm());
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

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      searchPokemon(trimmed.toLowerCase());
    }
  }, []);

  const handleSearch = (query: string): void => {
    const trimmed = query.trim();
    setSearchTerm(trimmed);
    window.localStorage.setItem('searchTerm', trimmed);
    clearSelection();
    if (!trimmed) {
      clearParams(['page', 'details']);
      setPage(1);
    } else {
      clearParams(['details']);
    }
    searchPokemon(trimmed.toLowerCase());
  };

  const handlePageChange = (page: number): void => {
    clearParams(['details']);
    clearSelection();
    loadPage(page);
  };

  const handleCloseDetails = (): void => {
    clearSelection();
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam && Number(pageParam) > 1) {
      navigate(`/?page=${pageParam}`);
    } else {
      navigate('/');
    }
  };

  const handlePokemonClick = async (pokemonName: string): Promise<void> => {
    navigate(
      `/details/${encodeURIComponent(pokemonName)}${currentPage > 1 ? `?page=${currentPage}` : ''}`
    );
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
    clearSelection();
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
