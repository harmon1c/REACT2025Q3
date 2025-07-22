import { useState, useCallback } from 'react';
import { pokemonApi, getErrorMessage } from '../api';
import type { ProcessedPokemon, PokemonDetails } from '../api';

interface UsePokemonSearchState {
  results: ProcessedPokemon[];
  isLoading: boolean;
  error: string | null;

  selectedPokemon: ProcessedPokemon | null;

  searchPokemon: (query: string) => Promise<void>;
  clearResults: VoidFunction;
  selectPokemon: (pokemonName: string) => Promise<void>;
  clearSelection: VoidFunction;
  loadInitialData: (searchTerm?: string) => Promise<void>;
}

export function usePokemonSearch(): UsePokemonSearchState {
  const [results, setResults] = useState<ProcessedPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);

  const searchPokemon = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedPokemon(null);

    try {
      if (!query.trim()) {
        const listResponse = await pokemonApi.getPokemonList(0, 20);
        const processedList = pokemonApi.parseListToProcessed(listResponse);
        setResults(processedList);
      } else {
        const trimmedQuery = query.trim().toLowerCase();
        const pokemonDetails = await pokemonApi.searchPokemon(trimmedQuery);
        const processedPokemon =
          pokemonApi.parsePokemonToProcessed(pokemonDetails);
        setResults([processedPokemon]);
      }
    } catch {
      try {
        const listResponse = await pokemonApi.getPokemonList(0, 20);
        const processedList = pokemonApi.parseListToProcessed(listResponse);
        setResults(processedList);
      } catch (listError) {
        setError(getErrorMessage(listError));
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async (searchTerm?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (searchTerm?.trim()) {
        const pokemonDetails = await pokemonApi.searchPokemon(
          searchTerm.trim()
        );
        const processedPokemon =
          pokemonApi.parsePokemonToProcessed(pokemonDetails);
        setResults([processedPokemon]);
      } else {
        const listResponse = await pokemonApi.getPokemonList(0, 20);
        const processedList = pokemonApi.parseListToProcessed(listResponse);
        setResults(processedList);
      }
    } catch (apiError) {
      setError(getErrorMessage(apiError, searchTerm));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPokemon = useCallback(async (pokemonName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const pokemonDetails: PokemonDetails =
        await pokemonApi.getPokemonDetails(pokemonName);
      const processedPokemon =
        pokemonApi.parsePokemonToProcessed(pokemonDetails);

      setSelectedPokemon((current) => {
        if (current?.name.toLowerCase() === pokemonName.toLowerCase()) {
          return null;
        }

        return processedPokemon;
      });
    } catch (apiError) {
      setError(getErrorMessage(apiError, pokemonName));
      setSelectedPokemon(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setSelectedPokemon(null);
    setIsLoading(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const returnValue: UsePokemonSearchState & {
    loadInitialData: (searchTerm?: string) => Promise<void>;
  } = {
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

  return returnValue;
}
