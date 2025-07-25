import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pokemonApi, getErrorMessage } from '../api';
import { usePokemonSearch } from './usePokemonSearch';

vi.mock('../api', () => ({
  pokemonApi: {
    searchPokemon: vi.fn(),
    getPokemonList: vi.fn(),
    getPokemonDetails: vi.fn(),
    parsePokemonToProcessed: vi.fn(),
    parseListToProcessed: vi.fn(),
  },
  getErrorMessage: vi.fn(),
}));

vi.mock('./useLocalStorage', () => ({
  useLocalStorage: (): [string, () => void, () => void] => [
    '',
    vi.fn(),
    vi.fn(),
  ],
}));

const mockSearchPokemon = vi.mocked(pokemonApi.searchPokemon);
const mockGetErrorMessage = vi.mocked(getErrorMessage);

describe('usePokemonSearch Hook', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('initializes with default values', (): void => {
    const { result } = renderHook(() => usePokemonSearch());

    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedPokemon).toBe(null);
  });

  it('provides search function', (): void => {
    const { result } = renderHook(() => usePokemonSearch());

    expect(typeof result.current.searchPokemon).toBe('function');
  });

  it('provides clear function', (): void => {
    const { result } = renderHook(() => usePokemonSearch());

    expect(typeof result.current.clearResults).toBe('function');
  });

  it('provides selectPokemon function', (): void => {
    const { result } = renderHook(() => usePokemonSearch());

    expect(typeof result.current.selectPokemon).toBe('function');
  });

  it('can call searchPokemon with search term', async (): Promise<void> => {
    const mockPokemonDetails = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ type: { name: 'electric', url: 'url' } }],
      abilities: [
        { ability: { name: 'static', url: 'url' }, is_hidden: false, slot: 1 },
      ],
      sprites: {
        front_default: '',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const mockProcessedPokemon = {
      id: 25,
      name: 'pikachu',
      image: 'test.png',
      description: 'test pokemon',
    };

    mockSearchPokemon.mockResolvedValue(mockPokemonDetails);
    vi.mocked(pokemonApi.parsePokemonToProcessed).mockReturnValue(
      mockProcessedPokemon
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.searchPokemon('pikachu');
    });

    expect(mockSearchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('can perform search', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.searchPokemon('bulbasaur');
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('can clear search', async (): Promise<void> => {
    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      result.current.clearResults();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('handles empty search query by fetching pokemon list', async (): Promise<void> => {
    const mockListResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'url' },
        { name: 'ivysaur', url: 'url' },
      ],
    };
    const mockProcessedList = [
      {
        id: 1,
        name: 'bulbasaur',
        image: 'bulbasaur.png',
        description: 'Grass Pokemon',
      },
      {
        id: 2,
        name: 'ivysaur',
        image: 'ivysaur.png',
        description: 'Grass Pokemon',
      },
    ];

    vi.mocked(pokemonApi.getPokemonList).mockResolvedValue(mockListResponse);
    vi.mocked(pokemonApi.parseListToProcessed).mockReturnValue(
      mockProcessedList
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.searchPokemon('  ');
    });

    expect(pokemonApi.getPokemonList).toHaveBeenCalledWith(0, 20);
    expect(result.current.results).toEqual(mockProcessedList);
  });

  it('handles search API errors', async (): Promise<void> => {
    const errorMessage = 'Pokemon not found';
    mockSearchPokemon.mockRejectedValue(new Error('API Error'));
    mockGetErrorMessage.mockReturnValue(errorMessage);

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.searchPokemon('invalid-pokemon');
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('can select a pokemon', async (): Promise<void> => {
    const mockPokemonDetails = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ type: { name: 'electric', url: 'url' } }],
      abilities: [
        { ability: { name: 'static', url: 'url' }, is_hidden: false, slot: 1 },
      ],
      sprites: {
        front_default: '',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const mockProcessedPokemon = {
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      description: 'Electric Pokemon',
    };

    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue(
      mockPokemonDetails
    );
    vi.mocked(pokemonApi.parsePokemonToProcessed).mockReturnValue(
      mockProcessedPokemon
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.selectPokemon('pikachu');
    });

    expect(pokemonApi.getPokemonDetails).toHaveBeenCalledWith('pikachu');
    expect(result.current.selectedPokemon).toEqual(mockProcessedPokemon);
  });

  it('deselects pokemon when selecting same pokemon', async (): Promise<void> => {
    const mockPokemonDetails = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ type: { name: 'electric', url: 'url' } }],
      abilities: [
        { ability: { name: 'static', url: 'url' }, is_hidden: false, slot: 1 },
      ],
      sprites: {
        front_default: '',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const mockProcessedPokemon = {
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      description: 'Electric Pokemon',
    };

    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue(
      mockPokemonDetails
    );
    vi.mocked(pokemonApi.parsePokemonToProcessed).mockReturnValue(
      mockProcessedPokemon
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.selectPokemon('pikachu');
    });

    expect(result.current.selectedPokemon).toEqual(mockProcessedPokemon);

    await act(async () => {
      await result.current.selectPokemon('pikachu');
    });

    expect(result.current.selectedPokemon).toBe(null);
  });

  it('handles pokemon selection API errors', async (): Promise<void> => {
    const errorMessage = 'Failed to load pokemon details';
    vi.mocked(pokemonApi.getPokemonDetails).mockRejectedValue(
      new Error('API Error')
    );
    mockGetErrorMessage.mockReturnValue(errorMessage);

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.selectPokemon('invalid-pokemon');
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.selectedPokemon).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('can clear selection', async (): Promise<void> => {
    const mockPokemonDetails = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ type: { name: 'electric', url: 'url' } }],
      abilities: [
        { ability: { name: 'static', url: 'url' }, is_hidden: false, slot: 1 },
      ],
      sprites: {
        front_default: '',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const mockProcessedPokemon = {
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      description: 'Electric Pokemon',
    };

    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue(
      mockPokemonDetails
    );
    vi.mocked(pokemonApi.parsePokemonToProcessed).mockReturnValue(
      mockProcessedPokemon
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.selectPokemon('pikachu');
    });

    expect(result.current.selectedPokemon).toEqual(mockProcessedPokemon);

    await act(async () => {
      result.current.clearSelection();
    });

    expect(result.current.selectedPokemon).toBe(null);
  });

  it('can load initial data with search term', async (): Promise<void> => {
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [{ type: { name: 'grass', url: 'url' } }],
      abilities: [
        {
          ability: { name: 'overgrow', url: 'url' },
          is_hidden: false,
          slot: 1,
        },
      ],
      sprites: {
        front_default: '',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const mockProcessedPokemon = {
      id: 1,
      name: 'bulbasaur',
      image: 'bulbasaur.png',
      description: 'Grass Pokemon',
    };

    vi.mocked(pokemonApi.searchPokemon).mockResolvedValue(mockPokemonDetails);
    vi.mocked(pokemonApi.parsePokemonToProcessed).mockReturnValue(
      mockProcessedPokemon
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.loadInitialData('bulbasaur');
    });

    expect(pokemonApi.searchPokemon).toHaveBeenCalledWith('bulbasaur');
    expect(result.current.results).toEqual([mockProcessedPokemon]);
  });

  it('can load initial data without search term', async (): Promise<void> => {
    const mockListResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'url' },
        { name: 'ivysaur', url: 'url' },
      ],
    };
    const mockProcessedList = [
      {
        id: 1,
        name: 'bulbasaur',
        image: 'bulbasaur.png',
        description: 'Grass Pokemon',
      },
      {
        id: 2,
        name: 'ivysaur',
        image: 'ivysaur.png',
        description: 'Grass Pokemon',
      },
    ];

    vi.mocked(pokemonApi.getPokemonList).mockResolvedValue(mockListResponse);
    vi.mocked(pokemonApi.parseListToProcessed).mockReturnValue(
      mockProcessedList
    );

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.loadInitialData();
    });

    expect(pokemonApi.getPokemonList).toHaveBeenCalledWith(0, 20);
    expect(result.current.results).toEqual(mockProcessedList);
  });

  it('handles initial data loading API errors', async (): Promise<void> => {
    const errorMessage = 'Failed to load initial data';
    vi.mocked(pokemonApi.getPokemonList).mockRejectedValue(
      new Error('API Error')
    );
    mockGetErrorMessage.mockReturnValue(errorMessage);

    const { result } = renderHook(() => usePokemonSearch());

    await act(async () => {
      await result.current.loadInitialData();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
