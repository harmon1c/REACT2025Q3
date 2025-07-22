import React, { useEffect, useRef } from 'react';
import { Search } from './components/Search';
import { Results, type ResultItem } from './components/Results';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTester } from './components/ErrorTester';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { useLocalStorage, usePokemonSearch } from './hooks';

function App(): React.JSX.Element {
  const isFirstRender = useRef(true);

  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage<string>(
    'searchTerm',
    ''
  );
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      void loadInitialData(savedSearchTerm);
    }
  }, [loadInitialData, savedSearchTerm]);

  const handleSearch = (query: string): void => {
    setSavedSearchTerm(query);
    void searchPokemon(query);
  };

  const handleClear = (): void => {
    setSavedSearchTerm('');
    clearResults();
  };

  const resultItems: ResultItem[] = results.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    description: pokemon.description,
  }));

  const selectedResultItem: ResultItem | null = selectedPokemon
    ? {
        id: selectedPokemon.id,
        name: selectedPokemon.name,
        description: selectedPokemon.description,
      }
    : null;

  return (
    <ErrorBoundary>
      <Main>
        <Header title="Pokemon Search" />

        <Search
          onSearch={handleSearch}
          onClear={handleClear}
          initialQuery={savedSearchTerm}
        />

        <Results
          results={resultItems}
          isLoading={isLoading}
          error={error}
          onPokemonClick={selectPokemon}
          selectedPokemon={selectedResultItem}
        />

        <ErrorTester />
      </Main>
    </ErrorBoundary>
  );
}

export default App;
