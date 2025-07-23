import React, { useEffect } from 'react';
import { Main } from '../components/Main';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { usePokemonSearch } from '../hooks/usePokemonSearch';

export const Home: React.FC = () => {
  const {
    results,
    isLoading,
    error,
    selectedPokemon,
    searchPokemon,
    clearResults,
    selectPokemon,
    loadInitialData,
  } = usePokemonSearch();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSearch = (query: string): void => {
    searchPokemon(query);
  };

  return (
    <Main>
      <div className="space-y-8">
        <section className="search-section">
          <Search onSearch={handleSearch} onClear={clearResults} />
        </section>

        <section className="results-section">
          <Results
            results={results}
            isLoading={isLoading}
            error={error}
            onPokemonClick={selectPokemon}
            selectedPokemon={selectedPokemon}
          />
        </section>
      </div>
    </Main>
  );
};
