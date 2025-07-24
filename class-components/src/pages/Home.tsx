import React from 'react';
import { Main } from '../components/Main';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { Pagination } from '../components/Pagination';
import { PokemonDetailPanel } from '../components/PokemonDetailPanel';
import { usePokemonData } from '../hooks/usePokemonData';

export const Home: React.FC = () => {
  const {
    results,
    isLoading,
    error,
    selectedPokemon,
    currentPage,
    totalPages,
    searchPokemon,
    loadPage,
    selectPokemon,
    clearResults,
    clearSelection,
  } = usePokemonData();

  const handleSearch = (query: string): void => {
    searchPokemon(query);
  };

  const handlePageChange = (page: number): void => {
    loadPage(page);
  };

  const handlePokemonClick = async (pokemonName: string): Promise<void> => {
    await selectPokemon(pokemonName);
  };

  return (
    <Main>
      <div className="space-y-8">
        <section className="search-section">
          <div className={selectedPokemon ? 'lg:pr-72' : ''}>
            <Search
              onSearch={handleSearch}
              onClear={() => {
                clearResults();
                clearSelection();
              }}
            />
          </div>
        </section>

        <section className="results-section">
          <div className={selectedPokemon ? 'lg:pr-72 space-y-6' : 'space-y-6'}>
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
          </div>

          <div
            className={`fixed top-48 right-[13rem] w-64 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto z-40 transition-opacity duration-300 rounded-lg shadow-lg ${
              selectedPokemon
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {selectedPokemon && (
              <PokemonDetailPanel
                pokemon={selectedPokemon}
                onClose={clearSelection}
              />
            )}
          </div>
        </section>
      </div>
    </Main>
  );
};
