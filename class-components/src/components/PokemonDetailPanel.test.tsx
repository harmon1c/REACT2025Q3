import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as pokemonApiSlice from '../api/pokemonApiSlice';
import { pokemonApi } from '../api/pokemonApi';
import PokemonDetailPanel from './PokemonDetailPanel';

vi.mock('next/navigation', () => ({
  useRouter: (): { push: (url: string) => void } => ({ push: vi.fn() }),
}));
vi.mock('next-intl', () => ({
  useTranslations:
    () =>
    (key: string, vars?: Record<string, unknown>): string => {
      if (key === 'pokemon.number' && vars?.id) {
        return `Pokemon #${vars.id}`;
      }
      const staticMap: Record<string, string> = {
        'pokemon.details': 'Pokemon Details',
        'pokemon.refresh': 'Refresh',
        'pokemon.close': 'Close',
        'pokemon.close_details': 'Close Details',
        'pokemon.information': 'Information',
        'pokemon.not_found': 'Pokemon not found',
        'pokemon.failed_to_load': 'Failed to load details',
        'pokemon.no_details': 'No details found',
        'pokemon.labels.types': 'Types',
        'pokemon.labels.height': 'Height',
        'pokemon.labels.weight': 'Weight',
        'pokemon.labels.base_experience': 'Base Experience',
        'pokemon.labels.abilities': 'Abilities',
      };
      return staticMap[key] ?? key;
    },
}));

vi.mock('../api/pokemonApiSlice', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: (): Record<string, unknown> => ({}),
    middleware:
      () =>
      (next: (action: unknown) => unknown) =>
      (action: unknown): unknown => {
        return next(action);
      },
  },
}));

const parsePokemonDetails = vi.fn();
const getLocalizedLabelMock = vi.fn((label: string) => label);
vi.mock(
  '../utils/pokemonUtils',
  (): Record<string, unknown> => ({
    parsePokemonDetails: (...args: unknown[]) => parsePokemonDetails(...args),
    getLocalizedLabel: (label: string) => getLocalizedLabelMock(label),
  })
);

const mockUseGetPokemonDetailsQuery = vi.mocked(
  pokemonApiSlice.useGetPokemonDetailsQuery
);

const renderPanel = (
  props: Partial<{ pokemonName: string; onClose: () => void }> = {}
): ReturnType<typeof render> =>
  render(<PokemonDetailPanel pokemonName="pikachu" {...props} />);

describe('PokemonDetailPanel (adapted)', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
    vi.resetModules();
    parsePokemonDetails.mockReturnValue([]);
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        base_experience: 112,
        types: [{ type: { name: 'electric', url: '' } }],
        abilities: [
          { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
        ],
        sprites: {
          front_default: '/pikachu.png',
          back_default: null,
          front_shiny: null,
          back_shiny: null,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
  });

  it('renders basic structure when data loaded', (): void => {
    renderPanel();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/pokemon #25/i)).toBeInTheDocument();
  });

  it('shows loading state', (): void => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    }));
    renderPanel();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', (): void => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: { message: 'fail' },
      refetch: vi.fn(),
    }));
    renderPanel();
    expect(
      screen.getByText(
        /failed to load details|pokemon not found|unknown_error/i
      )
    ).toBeInTheDocument();
  });

  it('renders avatar fallback if no image', (): void => {
    vi.spyOn(pokemonApi, 'parsePokemonToProcessed').mockReturnValue({
      id: 1,
      name: 'bulbasaur',
      image: null,
      description: 'A grass type',
    });
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: { id: 1, name: 'bulbasaur' },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    renderPanel({ pokemonName: 'bulbasaur' });
    const fallbackDiv = document.querySelector('.bg-gradient-to-br');
    expect(fallbackDiv?.textContent).toBe('B');
  });

  it('renders image if pokemon.image is present', (): void => {
    vi.spyOn(pokemonApi, 'parsePokemonToProcessed').mockReturnValue({
      id: 25,
      name: 'pikachu',
      image: '/pikachu.png',
      description: 'An electric type',
    });
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: { id: 25, name: 'pikachu' },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    renderPanel();
    const img = screen.getByAltText(/pikachu/i);
    expect(img).toBeInTheDocument();
  });

  it('displays close button', (): void => {
    renderPanel();
    const closeButton = screen.getByText(/close details/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('shows fallback if error or missing pokemon', (): void => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: { error: 'fail' },
      refetch: vi.fn(),
    }));
    renderPanel({ pokemonName: 'missing' });
    expect(
      screen.getByText(/pokemon not found|no details found|unknown_error/i)
    ).toBeInTheDocument();
  });

  it('calls onClose prop when close button clicked', async (): Promise<void> => {
    const mockOnClose = vi.fn();
    renderPanel({ onClose: mockOnClose });
    const closeButton = screen.getByRole('button', { name: /close details/i });
    await act(async () => {
      closeButton.click();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders all mapped detail fields', async (): Promise<void> => {
    parsePokemonDetails.mockReturnValue([
      { label: 'Type', value: 'Electric' },
      { label: 'Height', value: '0.4 m' },
      { label: 'Weight', value: '6.0 kg' },
    ]);
    renderPanel();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.getByText(/type:/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/height:/i)).toBeInTheDocument();
    expect(screen.getByText(/0.4 m/i)).toBeInTheDocument();
    expect(screen.getByText(/weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/6.0 kg/i)).toBeInTheDocument();
  });

  it('has close details button visible', (): void => {
    renderPanel();
    expect(
      screen.getByRole('button', { name: /close details/i })
    ).toBeInTheDocument();
  });

  afterEach((): void => {
    vi.resetModules();
    vi.clearAllMocks();
  });
});
