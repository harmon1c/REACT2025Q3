import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Main } from '../components/Main';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { Pagination } from '../components/Pagination';
import { usePokemonData } from '../hooks/usePokemonData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasDetails = location.pathname.includes('/details/');

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
    navigate(`/details/${pokemonName}`);
  };

  return (
    <Main>
      <div className={hasDetails ? 'flex gap-6' : 'w-full'}>
        <div className={hasDetails ? 'flex-1' : 'w-full'}>
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
        {hasDetails && (
          <div className="w-80 shrink-0">
            <Outlet />
          </div>
        )}
      </div>
    </Main>
  );
};
