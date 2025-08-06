import React, { useState, useCallback } from 'react';
import { pokemonApi as legacyApi } from '@/api/pokemonApi';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonQuery,
} from '@/api/pokemonApiSlice';
import type { ProcessedPokemon } from '@/api/types';

const ITEMS_PER_PAGE = 20;

interface UsePokemonDataState {
  results: ProcessedPokemon[];
  error: string | null;
  selectedPokemon: ProcessedPokemon | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  searchPokemon: (query: string) => void;
  loadPage: (page: number) => void;
  clearResults: () => void;
}

export function usePokemonData(
  selectedPokemonName?: string | null,
  initialPage = 1,
  onPageChange?: (page: number) => void
): UsePokemonDataState {
  const [results, setResults] = useState<ProcessedPokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    data: listData,
    error: listError,
    isLoading: isListLoading,
  } = useGetPokemonListQuery(
    { offset: (currentPage - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE },
    { skip: !!searchQuery }
  );

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useSearchPokemonQuery(searchQuery, { skip: !searchQuery });

  const {
    data: detailsData,
    error: detailsError,
    isLoading: isDetailsLoading,
  } = useGetPokemonDetailsQuery(selectedPokemonName ?? '', {
    skip: !selectedPokemonName,
  });

  React.useEffect(() => {
    if (searchQuery && searchData) {
      setResults([legacyApi.parsePokemonToProcessed(searchData)]);
      setTotalCount(1);
    } else if (!searchQuery && listData) {
      setResults(legacyApi.parseListToProcessed(listData));
      setTotalCount(listData.count);
    }
  }, [searchQuery, searchData, listData]);

  React.useEffect(() => {
    if (detailsData) {
      setSelectedPokemon(legacyApi.parsePokemonToProcessed(detailsData));
    } else if (!selectedPokemonName) {
      setSelectedPokemon(null);
    }
  }, [detailsData, selectedPokemonName]);

  const isLoading = isListLoading || isSearchLoading || isDetailsLoading;

  function errorToString(err: unknown): string | null {
    if (!err) {
      return null;
    }
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err === 'object' && err !== null) {
      if ('data' in err && typeof err.data === 'object' && err.data !== null) {
        if ('message' in err.data && typeof err.data.message === 'string') {
          return err.data.message;
        }
        return JSON.stringify(err.data);
      }
      if ('error' in err && typeof err.error === 'string') {
        return err.error;
      }
      if ('status' in err) {
        return `Error status: ${err.status}`;
      }
    }
    return 'Unknown error';
  }

  const error = errorToString(
    (searchQuery ? searchError : listError) || detailsError
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const searchPokemon = useCallback((query: string): void => {
    setSearchQuery(query.trim().toLowerCase());
    setCurrentPage(1);
  }, []);

  const loadPage = useCallback(
    (page: number): void => {
      setCurrentPage(page);
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const clearResults = useCallback((): void => {
    setResults([]);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return {
    results,
    error,
    selectedPokemon,
    currentPage,
    totalPages,
    totalCount,
    isLoading,
    searchPokemon,
    loadPage,
    clearResults,
  };
}
