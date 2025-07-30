import React, { useState } from 'react';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonQuery,
} from '../api/pokemonApiSlice';
import { pokemonApi as legacyApi } from '../api/pokemonApi';
import type { ProcessedPokemon } from '../api/types';

interface UsePokemonSearchState {
  results: ProcessedPokemon[];
  isLoading: boolean;
  error: string | null;
  selectedPokemon: ProcessedPokemon | null;
  searchPokemon: (query: string) => void;
  clearResults: VoidFunction;
  selectPokemon: (pokemonName: string) => void;
  clearSelection: VoidFunction;
  loadInitialData: (searchTerm?: string) => void;
}

export function usePokemonSearch(): UsePokemonSearchState {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [results, setResults] = useState<ProcessedPokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);

  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useGetPokemonListQuery(
    { offset: 0, limit: 20 },
    { skip: Boolean(searchQuery && searchQuery.trim()) }
  );
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchPokemonQuery(searchQuery, { skip: !searchQuery });
  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetPokemonDetailsQuery(selectedName ?? '', { skip: !selectedName });

  React.useEffect(() => {
    if (searchQuery && searchData) {
      setResults([legacyApi.parsePokemonToProcessed(searchData)]);
    } else if (!searchQuery && listData) {
      setResults(legacyApi.parseListToProcessed(listData));
    }
  }, [searchQuery, searchData, listData]);

  React.useEffect(() => {
    if (detailsData) {
      setSelectedPokemon(legacyApi.parsePokemonToProcessed(detailsData));
    } else if (!selectedName) {
      setSelectedPokemon(null);
    }
  }, [detailsData, selectedName]);

  function errorToString(err: unknown): string | null {
    if (!err) {
      return null;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object' && err !== null) {
      if ('status' in err && 'data' in err) {
        return `Error: ${JSON.stringify(err)}`;
      }
    }
    return 'Unknown error';
  }
  const isLoading = isListLoading || isSearchLoading || isDetailsLoading;
  const error = errorToString(
    (searchQuery ? searchError : listError) || detailsError
  );

  // API
  const searchPokemon = (query: string): void => {
    setSearchQuery(query.trim());
    setSelectedName(null);
  };
  const selectPokemon = (pokemonName: string): void => {
    if (selectedPokemon?.name.toLowerCase() === pokemonName.toLowerCase()) {
      setSelectedPokemon(null);
      setSelectedName(null);
      return;
    }
    setSelectedName(pokemonName);
  };
  const clearResults = (): void => {
    setResults([]);
    setSearchQuery('');
    setSelectedName(null);
    setSelectedPokemon(null);
  };
  const clearSelection = (): void => {
    setSelectedPokemon(null);
    setSelectedName(null);
  };
  const loadInitialData = (searchTerm?: string): void => {
    if (searchTerm?.trim()) {
      setSearchQuery(searchTerm.trim());
    } else {
      setSearchQuery('');
    }
    setSelectedName(null);
    setSelectedPokemon(null);
  };

  return {
    results,
    isLoading,
    error,
    selectedPokemon,
    searchPokemon,
    clearResults,
    selectPokemon,
    clearSelection,
    loadInitialData,
  };
}
