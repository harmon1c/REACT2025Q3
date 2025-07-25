import { render, screen } from '@testing-library/react';
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
    useNavigate: (): (() => void) => vi.fn(),
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
  });

  it('renders without crashing', async (): Promise<void> => {
    render(<PokemonDetailPanelWithRouter />);

    expect(document.body).toBeInTheDocument();
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
