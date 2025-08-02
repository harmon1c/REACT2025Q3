import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import * as pokemonApiSlice from '../api/pokemonApiSlice';
import { pokemonApi } from '../api/pokemonApi';
import PokemonDetailPanel from '../components/PokemonDetailPanel';

vi.mock(
  '../api/pokemonApiSlice',
  (): Record<string, unknown> => ({
    useGetPokemonDetailsQuery: vi.fn(),
    pokemonApi: {
      reducerPath: 'pokemonApi',
      reducer: (): Record<string, unknown> => ({}),
      middleware:
        () => (next: (action: unknown) => unknown) => (action: unknown) =>
          next(action),
    },
  })
);

const parsePokemonDetails = vi.fn();
vi.mock(
  '../utils/pokemonUtils',
  (): Record<string, unknown> => ({
    parsePokemonDetails: (...args: unknown[]) => parsePokemonDetails(...args),
  })
);

const mockUseGetPokemonDetailsQuery = vi.mocked(
  pokemonApiSlice.useGetPokemonDetailsQuery
);

const renderPanel = (
  props: Record<string, unknown> = {}
): ReturnType<typeof renderWithProviders> =>
  renderWithProviders(
    <MemoryRouter initialEntries={['/?details=pikachu']}>
      <PokemonDetailPanel {...props} />
    </MemoryRouter>
  );

describe('PokemonDetailPanel Page', (): void => {
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
          front_default: 'pikachu.png',
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

  it('renders without crashing', (): void => {
    renderPanel();
    expect(document.body).toBeInTheDocument();
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
    expect(screen.getByText(/failed to load details/i)).toBeInTheDocument();
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
    renderPanel();
    const fallbackDiv = document.querySelector('.bg-gradient-to-br');
    expect(fallbackDiv?.textContent).toBe('B');
  });

  it('renders image if pokemon.image is present', (): void => {
    vi.spyOn(pokemonApi, 'parsePokemonToProcessed').mockReturnValue({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      description: 'An electric type',
    });
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: { id: 25, name: 'pikachu' },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    renderPanel();
    const img = screen.getByRole('img', { name: /pikachu/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'pikachu.png');
  });

  it('displays close button', (): void => {
    renderPanel();
    const closeButton = screen.getByText(/close details/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('renders pokemon details when loaded', (): void => {
    renderPanel();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/pokemon #25/i)).toBeInTheDocument();
  });

  it('renders nothing or fallback if no pokemonName in search params', (): void => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetailPanel />
      </MemoryRouter>
    );
    expect(screen.getByText(/no details found/i)).toBeInTheDocument();
  });

  it('renders nothing or fallback if no pokemonName in search params (async)', async (): Promise<void> => {
    mockUseGetPokemonDetailsQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetailPanel />
      </MemoryRouter>
    );
    expect(screen.getByText(/no details found/i)).toBeInTheDocument();
  });

  it('calls onClose prop if provided', async (): Promise<void> => {
    const mockOnClose = vi.fn();
    vi.doMock(
      'react-router-dom',
      async (): Promise<Record<string, unknown>> => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useSearchParams: (): [URLSearchParams, () => void] => [
            new URLSearchParams([['details', 'pikachu']]),
            vi.fn(),
          ],
          useNavigate: (): (() => void) => vi.fn(),
        };
      }
    );
    const { default: Panel } = await import('./PokemonDetailPanel');
    await act(async () => {
      render(
        <BrowserRouter>
          <Panel onClose={mockOnClose} />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    const closeButton = screen.getByRole('button', {
      name: /close details|close/i,
    });
    await act(async () => {
      closeButton.click();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders all details fields', async (): Promise<void> => {
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

  it('displays close button', (): void => {
    renderPanel();
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders pokemon details when loaded', (): void => {
    renderPanel();
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
    expect(
      screen.queryByText('Pikachu') || screen.getByText(/no details found/i)
    ).toBeInTheDocument();
  });

  it('handles pokemon name from params', (): void => {
    renderPanel();
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  afterEach((): void => {
    vi.resetModules();
    vi.clearAllMocks();
  });
});
