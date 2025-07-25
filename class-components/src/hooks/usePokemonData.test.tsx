import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pokemonApi } from '../api';
import { getErrorMessage } from '../api/errorHandler';
import { usePokemonData } from './usePokemonData';

vi.mock('../api', () => ({
  pokemonApi: {
    getPokemonList: vi.fn(),
    searchPokemon: vi.fn(),
    getPokemonDetails: vi.fn(),
    parsePokemonToProcessed: vi.fn(),
    parseListToProcessed: vi.fn(),
  },
}));

vi.mock('../api/errorHandler', () => ({
  getErrorMessage: vi.fn(),
}));

vi.mock('./useLocalStorage', () => ({
  useLocalStorage: (): [string, () => void, () => void] => [
    '',
    vi.fn(),
    vi.fn(),
  ],
}));

vi.mock('./useUrlState', () => ({
  useUrlState: (): {
    currentPage: number;
    selectedPokemonName: string | null;
    setPage: () => void;
    setSelectedPokemon: () => void;
    clearSelectedPokemon: () => void;
    forceUrlCleanup: () => void;
    clearParams: () => void;
  } => ({
    currentPage: 1,
    selectedPokemonName: null,
    setPage: vi.fn(),
    setSelectedPokemon: vi.fn(),
    clearSelectedPokemon: vi.fn(),
    forceUrlCleanup: vi.fn(),
    clearParams: vi.fn(),
  }),
}));

const mockGetPokemonList = vi.mocked(pokemonApi.getPokemonList);
const mockSearchPokemon = vi.mocked(pokemonApi.searchPokemon);
const mockParsePokemonToProcessed = vi.mocked(
  pokemonApi.parsePokemonToProcessed
);
const mockParseListToProcessed = vi.mocked(pokemonApi.parseListToProcessed);
const mockGetErrorMessage = vi.mocked(getErrorMessage);

describe('usePokemonData Hook', () => {
  beforeEach((): void => {
    vi.clearAllMocks();

    mockGetPokemonList.mockResolvedValue({
      count: 40,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'url1' },
        { name: 'ivysaur', url: 'url2' },
      ],
    });

    mockParseListToProcessed.mockReturnValue([
      {
        id: 1,
        name: 'bulbasaur',
        description: 'Grass Pokemon',
      },
      {
        id: 2,
        name: 'ivysaur',
        description: 'Grass Pokemon',
      },
    ]);

    mockSearchPokemon.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'pikachu.png',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ type: { name: 'electric', url: 'type/electric' } }],
      abilities: [],
    });

    mockParsePokemonToProcessed.mockReturnValue({
      id: 25,
      name: 'pikachu',
      description: 'Electric Pokemon',
    });

    mockGetErrorMessage.mockReturnValue('Test error');
  });

  it('initializes with default values', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.results).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        description: 'Grass Pokemon',
      },
      {
        id: 2,
        name: 'ivysaur',
        description: 'Grass Pokemon',
      },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
  });

  it('provides search function', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());
    return waitFor(() => {
      expect(typeof result.current.searchPokemon).toBe('function');
    });
  });

  it('provides clear function', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());
    return waitFor(() => {
      expect(typeof result.current.clearResults).toBe('function');
    });
  });

  it('provides goToPage function', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());
    return waitFor(() => {
      expect(typeof result.current.loadPage).toBe('function');
    });
  });

  it('can search for pokemon', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());

    await act(async () => {
      await result.current.searchPokemon('pikachu');
    });

    expect(mockSearchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('can clear search', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.clearResults();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.results).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        description: 'Grass Pokemon',
      },
      {
        id: 2,
        name: 'ivysaur',
        description: 'Grass Pokemon',
      },
    ]);
    expect(result.current.error).toBe(null);
  });

  it('can navigate to different page', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonData());

    await act(async () => {
      await result.current.loadPage(2);
    });

    expect(mockGetPokemonList).toHaveBeenCalled();
  });
  it('handles API error and sets error state', async () => {
    mockGetPokemonList.mockRejectedValueOnce(new Error('API fail'));
    const { result } = renderHook(() => usePokemonData());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(result.current.error).toBe('Test error');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles empty results from API', async () => {
    mockGetPokemonList.mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    // Remove default mock for this test to ensure empty array is returned
    mockParseListToProcessed.mockReset();
    mockParseListToProcessed.mockReturnValue([]);
    const { result } = renderHook(() => usePokemonData());
    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.totalPages).toBe(0);
    });
  }, 3000);

  it('sets error when searchPokemon fails', async () => {
    mockSearchPokemon.mockRejectedValueOnce(new Error('search fail'));
    const { result } = renderHook(() => usePokemonData());
    await act(async () => {
      await result.current.searchPokemon('failmon');
    });
    expect(result.current.error).toBe('Test error');
  });
});
