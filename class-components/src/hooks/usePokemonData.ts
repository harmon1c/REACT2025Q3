import { useState, useCallback, useEffect } from 'react';
import { pokemonApi } from '../api';
import type { ProcessedPokemon, PokemonDetails } from '../api/types';
import { getErrorMessage } from '../api/errorHandler';
import { useUrlState } from './useUrlState';

const ITEMS_PER_PAGE = 20;

interface UsePokemonDataState {
  results: ProcessedPokemon[];
  isLoading: boolean;
  error: string | null;
  selectedPokemon: ProcessedPokemon | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isSearchInProgress: boolean;

  searchPokemon: (query: string) => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  selectPokemon: (pokemonName: string) => Promise<void>;
  clearResults: () => void;
  clearSelection: () => void;
  clearSelectionSync: () => void;
}

export function usePokemonData(): UsePokemonDataState {
  const [results, setResults] = useState<ProcessedPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);

  const {
    currentPage,
    selectedPokemonName,
    setPage,
    setSelectedPokemon: setUrlSelectedPokemon,
    clearSelectedPokemon,
    forceUrlCleanup,
  } = useUrlState();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadPage = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const listResponse = await pokemonApi.getPokemonList(
          offset,
          ITEMS_PER_PAGE
        );
        const processedList = pokemonApi.parseListToProcessed(listResponse);

        setResults(processedList);
        setTotalCount(listResponse.count);
        setPage(page);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setPage]
  );

  const searchPokemon = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      setIsSearchInProgress(true);

      setSelectedPokemon(null);
      setUrlSelectedPokemon(null);

      forceUrlCleanup();

      setSearchQuery(trimmedQuery);

      if (!trimmedQuery) {
        await loadPage(1);
        setIsSearchInProgress(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pokemonDetails = await pokemonApi.searchPokemon(
          trimmedQuery.toLowerCase()
        );
        const processedPokemon =
          pokemonApi.parsePokemonToProcessed(pokemonDetails);

        setResults([processedPokemon]);
        setTotalCount(1);
        setPage(1);
      } catch (apiError) {
        setError(getErrorMessage(apiError, trimmedQuery));
        setResults([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
        setIsSearchInProgress(false);
      }
    },
    [loadPage, setPage, setUrlSelectedPokemon, forceUrlCleanup]
  );

  const selectPokemon = useCallback(
    async (pokemonName: string) => {
      if (selectedPokemon?.name.toLowerCase() === pokemonName.toLowerCase()) {
        setSelectedPokemon(null);
        setUrlSelectedPokemon(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pokemonDetails: PokemonDetails =
          await pokemonApi.getPokemonDetails(pokemonName);
        const processedPokemon =
          pokemonApi.parsePokemonToProcessed(pokemonDetails);

        setSelectedPokemon(processedPokemon);
        setUrlSelectedPokemon(pokemonName);
      } catch (apiError) {
        setError(getErrorMessage(apiError, pokemonName));
        setSelectedPokemon(null);
        setUrlSelectedPokemon(null);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPokemon, setUrlSelectedPokemon]
  );

  const clearSelection = useCallback(() => {
    setSelectedPokemon(null);
    setUrlSelectedPokemon(null);
  }, [setUrlSelectedPokemon]);

  const clearSelectionSync = useCallback(() => {
    setSelectedPokemon(null);

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('details');
    const newUrl = `${window.location.pathname}${currentParams.toString() ? '?' + currentParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setSearchQuery('');
    setError(null);
  }, []);

  useEffect(() => {
    if (!results.length && !searchQuery) {
      loadPage(currentPage);
    }
  }, [results.length, searchQuery, currentPage, loadPage]);

  useEffect(() => {
    const loadSelectedPokemon = async (): Promise<void> => {
      if (isSearchInProgress) {
        return;
      }

      if (
        selectedPokemonName &&
        (!selectedPokemon ||
          selectedPokemon.name.toLowerCase() !==
            selectedPokemonName.toLowerCase())
      ) {
        try {
          const pokemonDetails: PokemonDetails =
            await pokemonApi.getPokemonDetails(selectedPokemonName);
          const processedPokemon =
            pokemonApi.parsePokemonToProcessed(pokemonDetails);
          setSelectedPokemon(processedPokemon);
        } catch (apiError) {
          setError(getErrorMessage(apiError, selectedPokemonName));
          setSelectedPokemon(null);
          clearSelectedPokemon();
        }
      } else if (!selectedPokemonName && selectedPokemon) {
        setSelectedPokemon(null);
      }
    };

    loadSelectedPokemon();
  }, [
    selectedPokemonName,
    selectedPokemon,
    clearSelectedPokemon,
    isSearchInProgress,
  ]);

  return {
    results,
    isLoading,
    error,
    selectedPokemon,
    currentPage,
    totalPages,
    totalCount,
    isSearchInProgress,
    searchPokemon,
    loadPage,
    selectPokemon,
    clearResults,
    clearSelection,
    clearSelectionSync,
  };
}
