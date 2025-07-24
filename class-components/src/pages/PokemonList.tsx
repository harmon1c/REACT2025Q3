import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Main } from '../components/Main';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { Pagination } from '../components/Pagination';
import { usePokemonData } from '../hooks/usePokemonData';

const PokemonList: React.FC = () => {
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

  const navigate = useNavigate();
  const location = useLocation();

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
    // Открываем детали через navigate
    navigate(`details/${pokemonName}${location.search}`);
  };

  return (
    <Main>
      <section className="search-section">
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
    </Main>
  );
};

export default PokemonList;
