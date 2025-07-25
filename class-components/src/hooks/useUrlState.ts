import { useSearchParams, useParams } from 'react-router-dom';
import { useCallback } from 'react';

interface UseUrlStateReturn {
  currentPage: number;
  selectedPokemonName: string | null;
  setPage: (page: number) => void;
  setSelectedPokemon: (name: string | null) => void;
  clearSelectedPokemon: () => void;
  forceUrlCleanup: () => void;
  clearParams: (params: string[]) => void;
}

export const useUrlState = (): UseUrlStateReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const currentPage =
    Number(params['page']) || Number(searchParams.get('page')) || 1;
  const selectedPokemonName = params['name'] || searchParams.get('details');

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (page > 1) {
          newParams.set('page', page.toString());
        } else {
          newParams.delete('page');
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const setSelectedPokemon = useCallback(
    (name: string | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (name) {
          newParams.set('details', name);
        } else {
          newParams.delete('details');
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const clearSelectedPokemon = useCallback(() => {
    setSelectedPokemon(null);
  }, [setSelectedPokemon]);

  const forceUrlCleanup = useCallback(() => {
    setTimeout(() => {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete('details');
      const newUrl = `${window.location.pathname}${currentParams.toString() ? '?' + currentParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }, 0);
  }, []);

  const clearParams = useCallback(
    (params: string[]) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        params.forEach((p) => newParams.delete(p));
        return newParams;
      });
    },
    [setSearchParams]
  );

  return {
    currentPage,
    selectedPokemonName,
    setPage,
    setSelectedPokemon,
    clearSelectedPokemon,
    forceUrlCleanup,
    clearParams,
  };
};
