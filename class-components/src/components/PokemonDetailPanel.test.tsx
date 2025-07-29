import { render, screen, act } from '@testing-library/react';
import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import type { JSX } from 'react';
import PokemonDetailPanel from '../components/PokemonDetailPanel';

vi.mock('../api', () => ({
  pokemonApi: {
    getPokemonDetails: vi.fn().mockResolvedValue({
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu.png' },
    }),
    parsePokemonToProcessed: vi.fn().mockReturnValue({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      description: 'Electric Pokemon',
    }),
  },
}));

vi.mock('../utils/pokemonUtils', () => ({
  parsePokemonDetails: vi.fn().mockReturnValue([
    { label: 'Type', value: 'Electric' },
    { label: 'Height', value: '0.4 m' },
  ]),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: (): { pokemonName: string } => ({ pokemonName: 'pikachu' }),
    useNavigate: (): Mock => vi.fn(),
  };
});

const PokemonDetailPanelWithRouter = (): JSX.Element => (
  <BrowserRouter>
    <PokemonDetailPanel />
  </BrowserRouter>
);

describe('PokemonDetailPanel Page', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('renders without crashing', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);

    expect(document.body).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.doMock('../api', () => ({
      pokemonApi: {
        getPokemonDetails: vi.fn(() => new Promise(() => {})),
        parsePokemonToProcessed: vi.fn(),
      },
    }));
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: (): { pokemonName: string } => ({ pokemonName: 'pikachu' }),
        useNavigate: (): (() => void) => vi.fn(),
      };
    });
    const { unmount } = render(<PokemonDetailPanelWithRouter />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    unmount();
  });

  it('shows error state', async () => {
    vi.resetModules();
    vi.doMock('../api', () => ({
      pokemonApi: {
        getPokemonDetails: vi.fn().mockRejectedValue(new Error('fail')),
        parsePokemonToProcessed: vi.fn(),
      },
    }));
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: (): { pokemonName: string } => ({ pokemonName: 'pikachu' }),
        useNavigate: (): (() => void) => vi.fn(),
      };
    });
    const { default: Panel } = await import('../components/PokemonDetailPanel');
    const PanelWithRouter = (): JSX.Element => (
      <BrowserRouter>
        <Panel />
      </BrowserRouter>
    );
    await act(async () => {
      render(<PanelWithRouter />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.getByText(/failed to load details/i)).toBeInTheDocument();
  });

  it('renders avatar fallback if no image', async () => {
    vi.resetModules();
    vi.doMock('../api', () => ({
      pokemonApi: {
        getPokemonDetails: vi.fn().mockResolvedValue({
          id: 1,
          name: 'bulbasaur',
          sprites: {},
        }),
        parsePokemonToProcessed: vi.fn().mockReturnValue({
          id: 1,
          name: 'bulbasaur',
          image: undefined,
          description: 'Grass Pokemon',
        }),
      },
    }));
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: (): { pokemonName: string } => ({
          pokemonName: 'bulbasaur',
        }),
        useNavigate: (): (() => void) => vi.fn(),
      };
    });
    const { default: Panel } = await import('../components/PokemonDetailPanel');
    const PanelWithRouter = (): JSX.Element => (
      <BrowserRouter>
        <Panel />
      </BrowserRouter>
    );
    await act(async () => {
      render(<PanelWithRouter />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    const fallbackDiv = document.querySelector('.bg-gradient-to-br');
    expect(fallbackDiv).toBeInTheDocument();
    expect(fallbackDiv?.textContent).toBe('B');
  });

  it('renders image if pokemon.image is present', async () => {
    vi.doMock('../api', () => ({
      pokemonApi: {
        getPokemonDetails: vi.fn().mockResolvedValue({
          id: 25,
          name: 'pikachu',
          sprites: { front_default: 'pikachu.png' },
        }),
        parsePokemonToProcessed: vi.fn().mockReturnValue({
          id: 25,
          name: 'pikachu',
          image: 'pikachu.png',
          description: 'Electric Pokemon',
        }),
      },
    }));
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: (): { pokemonName: string } => ({ pokemonName: 'pikachu' }),
        useNavigate: (): (() => void) => vi.fn(),
      };
    });
    await act(async () => {
      render(<PokemonDetailPanelWithRouter />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    const img = screen.getByRole('img', { name: /pikachu/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'pikachu.png');
  });

  it('calls close handler when close button is clicked', async () => {
    vi.resetModules();
    const mockNavigate = vi.fn();
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: (): { pokemonName: string } => ({ pokemonName: 'pikachu' }),
        useNavigate: (): Mock => mockNavigate,
      };
    });
    const { default: Panel } = await import('../components/PokemonDetailPanel');
    const PanelWithRouter = (): JSX.Element => (
      <BrowserRouter>
        <Panel />
      </BrowserRouter>
    );
    await act(async () => {
      render(<PanelWithRouter />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    const closeButton = screen.getByRole('button', {
      name: /close details|close/i,
    });
    await act(async () => {
      closeButton.click();
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('displays close button', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const closeButton = screen.getByText('Close Details');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders pokemon details when loaded', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getByText('Close Details')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('handles pokemon name from params', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getByText('Close Details')).toBeInTheDocument();
  });
});
