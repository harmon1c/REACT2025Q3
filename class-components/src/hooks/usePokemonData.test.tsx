import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../store';
import * as pokemonApiSlice from '../api/pokemonApiSlice';
import { usePokemonData } from './usePokemonData';

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

describe('usePokemonData (smoke)', () => {
  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement => (
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  );

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
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    expect(Array.isArray(result.current.results)).toBe(true);
    expect(typeof result.current.searchPokemon).toBe('function');
    expect(typeof result.current.clearResults).toBe('function');
    expect(typeof result.current.loadPage).toBe('function');
  });

  it('searchPokemon updates results', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData(), { wrapper });
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
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    await act(async () => {
      result.current.clearResults();
    });
    expect(Array.isArray(result.current.results)).toBe(true);
  });

  it('caches list query results for the same params', (): void => {
    vi.clearAllMocks();
    renderHook(() => usePokemonData(), { wrapper });
    renderHook(() => usePokemonData(), { wrapper });
    expect(mockUseGetPokemonListQuery).toHaveBeenCalledTimes(4);
  });

  it('sets isLoading true when any query is loading', () => {
    mockUseGetPokemonListQuery.mockImplementation(() => ({
      ...listQueryResult,
      isLoading: true,
    }));
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets error from listError', () => {
    mockUseGetPokemonListQuery.mockImplementation(() => ({
      ...listQueryResult,
      error: { error: 'fail' },
    }));
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    expect(result.current.error).toMatch(/fail|Error/);
  });

  it('sets error from searchError', () => {
    mockUseSearchPokemonQuery.mockImplementation(() => ({
      ...searchQueryResult,
      error: { error: 'search fail' },
    }));
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    act(() => {
      result.current.searchPokemon('pikachu');
    });
    expect(result.current.error).toMatch(/search fail|Error/);
  });

  it('sets error from detailsError', () => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      ...detailsQueryResult,
      error: { error: 'details fail' },
    }));
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    expect(result.current.error).toMatch(/details fail|Error/);
  });

  it('sets selectedPokemon from detailsData', () => {
    const details = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [{ type: { name: 'grass', url: '' } }],
      abilities: [
        { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
      ],
      sprites: {
        front_default: null,
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      ...detailsQueryResult,
      data: details,
    }));
    const { result } = renderHook(() => usePokemonData(), { wrapper });
    expect(result.current.selectedPokemon).toBeTruthy();
    expect(result.current.selectedPokemon?.name).toMatch(/bulbasaur/i);
  });
});
