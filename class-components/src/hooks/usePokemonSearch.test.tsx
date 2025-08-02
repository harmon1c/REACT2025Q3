import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { store } from '../store';
import * as pokemonApiSlice from '../api/pokemonApiSlice';
import { usePokemonSearch } from './usePokemonSearch';

vi.mock('../api/pokemonApiSlice', () => {
  return {
    useGetPokemonListQuery: vi.fn(),
    useSearchPokemonQuery: vi.fn(),
    useGetPokemonDetailsQuery: vi.fn(),
    pokemonApi: {
      reducerPath: 'pokemonApi',
      reducer: (): Record<string, unknown> => ({}),
      middleware:
        (): ((
          next: (action: unknown) => unknown
        ) => (action: unknown) => unknown) =>
        (next: (action: unknown) => unknown) =>
        (action: unknown) =>
          next(action),
    },
  };
});

const mockUseGetPokemonListQuery = vi.mocked(
  pokemonApiSlice.useGetPokemonListQuery
);
const mockUseSearchPokemonQuery = vi.mocked(
  pokemonApiSlice.useSearchPokemonQuery
);
const mockUseGetPokemonDetailsQuery = vi.mocked(
  pokemonApiSlice.useGetPokemonDetailsQuery
);

describe('usePokemonSearch (smoke)', (): void => {
  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement => <Provider store={store}>{children}</Provider>;

  const listQueryResult = {
    data: {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'url' }],
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  };
  const searchQueryResult = {
    data: {
      id: 25,
      name: 'pikachu',
      description: 'Electric Pokemon',
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  };
  const detailsQueryResult = {
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  };

  beforeEach((): void => {
    vi.clearAllMocks();
    mockUseGetPokemonListQuery.mockImplementation(() => listQueryResult);
    mockUseSearchPokemonQuery.mockImplementation(() => searchQueryResult);
    mockUseGetPokemonDetailsQuery.mockImplementation(() => detailsQueryResult);
  });

  it('returns default results and functions', (): void => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });
    expect(Array.isArray(result.current.results)).toBe(true);
    expect(typeof result.current.searchPokemon).toBe('function');
    expect(typeof result.current.clearResults).toBe('function');
    expect(typeof result.current.selectPokemon).toBe('function');
  });

  it('searchPokemon updates results', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });
    await act(async () => {
      await result.current.searchPokemon('pikachu');
    });
    expect(result.current.results[0]).toMatchObject({
      id: 25,
      name: 'Pikachu',
      description: expect.stringContaining('electric'),
      image: null,
    });
  });

  it('clearResults resets results', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });
    await act(async () => {
      result.current.clearResults();
    });
    expect(Array.isArray(result.current.results)).toBe(true);
  });
});
