import { useState, useCallback, useEffect } from 'react';
import { pokemonApi as legacyApi } from '../api/pokemonApi';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonQuery,
} from '../api/pokemonApiSlice';
import type { ProcessedPokemon } from '../api/types';
import { useUrlState } from './useUrlState';

const ITEMS_PER_PAGE = 20;

interface UsePokemonDataState {
  results: ProcessedPokemon[];
  error: string | null;
  selectedPokemon: ProcessedPokemon | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  isSearchInProgress: boolean;

  searchPokemon: (query: string) => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  selectPokemon: (pokemonName: string) => Promise<void>;
  clearResults: () => void;
  clearSelection: () => void;
  clearSelectionSync: () => void;
  forceUrlCleanup: () => void;
  setUrlSelectedPokemon: (pokemonName: string | null) => void;
  setSelectedPokemon: (pokemon: ProcessedPokemon | null) => void;
  setPage: (page: number) => void;
  clearParams: (params: string[]) => void;
}

export function usePokemonData(): UsePokemonDataState {
  const [results, setResults] = useState<ProcessedPokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] =
    useState<ProcessedPokemon | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Dummy param for manual list refetch
  const [listResetCount, setListResetCount] = useState(0);

  const {
    currentPage,
    selectedPokemonName,
    setPage,
    setSelectedPokemon: setUrlSelectedPokemon,
    forceUrlCleanup,
    clearParams,
  } = useUrlState();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadPage = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  const searchPokemon = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      setSearchQuery(trimmed);
      setUrlSelectedPokemon(null);
      setSelectedPokemon(null);
      if (!trimmed) {
        setListResetCount((c) => c + 1);
      }
      setPage(1);
    },
    [setPage, setUrlSelectedPokemon]
  );

  const selectPokemon = useCallback(
    (pokemonName: string) => {
      if (selectedPokemon?.name.toLowerCase() === pokemonName.toLowerCase()) {
        setSelectedPokemon(null);
        setUrlSelectedPokemon(null);
        return;
      }
      setUrlSelectedPokemon(pokemonName);
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
  }, []);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useGetPokemonListQuery(
    { offset, limit: ITEMS_PER_PAGE, listResetCount },
    { skip: !!searchQuery.trim() }
  );

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchPokemonQuery(searchQuery.trim().toLowerCase(), {
    skip: !searchQuery,
  });

  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetPokemonDetailsQuery(selectedPokemonName ?? '', {
    skip: !selectedPokemonName,
  });

  useEffect(() => {
    if (searchQuery && searchData) {
      setResults([legacyApi.parsePokemonToProcessed(searchData)]);
      setTotalCount(1);
    } else if (!searchQuery && listData) {
      setResults(legacyApi.parseListToProcessed(listData));
      setTotalCount(listData.count);
    }
  }, [searchQuery, searchData, listData]);

  useEffect(() => {
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
      // RTK Query FetchBaseQueryError
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
  const isSearchInProgress = isSearchLoading;

  return {
    results,
    isLoading,
    error,
    selectedPokemon,
    currentPage,
    totalPages,
    totalCount,
    isSearchInProgress,
    searchPokemon: async (query: string): Promise<void> => {
      searchPokemon(query);
    },
    loadPage: async (page: number): Promise<void> => {
      loadPage(page);
    },
    selectPokemon: async (pokemonName: string): Promise<void> => {
      selectPokemon(pokemonName);
    },
    clearResults,
    clearSelection,
    clearSelectionSync,
    forceUrlCleanup,
    setUrlSelectedPokemon,
    setSelectedPokemon,
    setPage,
    clearParams,
  };
}
