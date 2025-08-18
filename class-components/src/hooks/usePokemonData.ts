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
  rawError: unknown;
  selectedPokemon: ProcessedPokemon | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  searchPokemon: (query: string) => void;
  loadPage: (page: number) => void;
  clearResults: () => void;
  unlockHydration: () => void;
}

interface UsePokemonDataOptions {
  selectedPokemonName?: string | null;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  initialResults?: ProcessedPokemon[];
  initialTotalCount?: number;
  hydrateOnly?: boolean;
}

export function usePokemonData(
  selectedPokemonName?: string | null,
  initialPage = 1,
  onPageChange?: (page: number) => void,
  options?: Omit<
    UsePokemonDataOptions,
    'selectedPokemonName' | 'initialPage' | 'onPageChange'
  >
): UsePokemonDataState {
  const { initialResults, initialTotalCount, hydrateOnly } = options || {};
  const [lockedHydration, setLockedHydration] = useState(!!hydrateOnly);
  const [results, setResults] = useState<ProcessedPokemon[]>(
    initialResults || []
  );
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);
  const [totalCount, setTotalCount] = useState(initialTotalCount || 0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    data: listData,
    error: listError,
    isLoading: isListLoading,
  } = useGetPokemonListQuery(
    { offset: (currentPage - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE },
    { skip: !!searchQuery || lockedHydration }
  );

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useSearchPokemonQuery(searchQuery, {
    skip: !searchQuery || lockedHydration,
  });

  const {
    data: detailsData,
    error: detailsError,
    isLoading: isDetailsLoading,
  } = useGetPokemonDetailsQuery(selectedPokemonName ?? '', {
    skip: !selectedPokemonName || lockedHydration,
  });

  React.useEffect(() => {
    if (lockedHydration) {
      return;
    }
    if (searchQuery && searchData) {
      setResults([legacyApi.parsePokemonToProcessed(searchData)]);
      setTotalCount(1);
    } else if (!searchQuery && listData) {
      setResults(legacyApi.parseListToProcessed(listData));
      setTotalCount(listData.count);
    }
  }, [searchQuery, searchData, listData, lockedHydration]);

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

  const primaryRawError = (searchQuery ? searchError : listError) || null;
  const error = errorToString(primaryRawError || detailsError);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const searchPokemon = useCallback(
    (query: string): void => {
      setLockedHydration(false);
      const q = query.trim().toLowerCase();
      setSearchQuery(q);
      setCurrentPage(1);
      if (!q && initialResults?.length) {
        setResults(initialResults);
        setTotalCount(initialTotalCount || initialResults.length);
      }
    },
    [initialResults, initialTotalCount]
  );

  const loadPage = useCallback(
    (page: number): void => {
      setLockedHydration(false);
      setCurrentPage(page);
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const clearResults = useCallback((): void => {
    setSearchQuery('');
    setCurrentPage(1);
    if (initialResults?.length) {
      setResults(initialResults);
      setTotalCount(initialTotalCount || initialResults.length);
    } else {
      setResults([]);
      setTotalCount(0);
    }
  }, [initialResults, initialTotalCount]);

  const unlockHydration = useCallback((): void => {
    setLockedHydration(false);
  }, []);

  return {
    results: results,
    error: error,
    rawError: primaryRawError,
    selectedPokemon: selectedPokemon,
    currentPage: currentPage,
    totalPages: totalPages,
    totalCount: totalCount,
    isLoading: isLoading,
    searchPokemon: searchPokemon,
    loadPage: loadPage,
    clearResults: clearResults,
    unlockHydration: unlockHydration,
  };
}
