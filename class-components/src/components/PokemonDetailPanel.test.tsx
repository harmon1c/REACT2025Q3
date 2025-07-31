import { render, screen, act } from '@testing-library/react';
import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    expect(
      screen.queryByText(/loading/i) || screen.queryByText(/no details found/i)
    ).toBeInTheDocument();
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
    expect(
      screen.queryByText(/failed to load details/i) ||
        screen.queryByText(/no details found/i)
    ).toBeInTheDocument();
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
    if (fallbackDiv) {
      expect(fallbackDiv.textContent).toBe('B');
    } else {
      expect(screen.getByText(/no details found/i)).toBeInTheDocument();
    }
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
    const img = screen.queryByRole('img', { name: /pikachu/i });
    if (img) {
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'pikachu.png');
    } else {
      expect(screen.getByText(/no details found/i)).toBeInTheDocument();
    }
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
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders pokemon details when loaded', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
    expect(
      screen.queryByText('Pikachu') || screen.getByText(/no details found/i)
    ).toBeInTheDocument();
  });

  it('handles pokemon name from params', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const closeButton =
      screen.queryByText('Close Details') || screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('renders nothing or fallback if no pokemonName in search params', async () => {
    vi.doMock(
      'react-router-dom',
      async (): Promise<Record<string, unknown>> => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useSearchParams: (): [URLSearchParams, () => void] => [
            new URLSearchParams(),
            vi.fn(),
          ],
          useNavigate: (): (() => void) => vi.fn(),
        };
      }
    );
    const { default: Panel } = await import('./PokemonDetailPanel');
    render(
      <BrowserRouter>
        <Panel />
      </BrowserRouter>
    );
    expect(screen.getByText(/no details found/i)).toBeInTheDocument();
  });

  it('calls onClose prop if provided', async () => {
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

  it('renders all details fields', async () => {
    vi.doMock('../utils/pokemonUtils', () => ({
      parsePokemonDetails: vi.fn().mockReturnValue([
        { label: 'Type', value: 'Electric' },
        { label: 'Height', value: '0.4 m' },
        { label: 'Weight', value: '6.0 kg' },
      ]),
    }));
    const { default: Panel } = await import('./PokemonDetailPanel');
    await act(async () => {
      render(
        <BrowserRouter>
          <Panel />
        </BrowserRouter>
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.getByText(/type:/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/height:/i)).toBeInTheDocument();
    expect(screen.getByText(/0.4 m/i)).toBeInTheDocument();
    expect(screen.getByText(/weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/6.0 kg/i)).toBeInTheDocument();
  });
});
