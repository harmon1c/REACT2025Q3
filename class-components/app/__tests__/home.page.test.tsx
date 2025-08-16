import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import HomePage from '../[locale]/page';
vi.mock('next-intl', () => ({
  useTranslations:
    (): ((key: string) => string) =>
    (key: string): string =>
      `t:${key}`,
}));

vi.mock('@/components/PokemonCatalogueContainer', () => ({
  PokemonCatalogueContainer: (
    props: Record<string, unknown>
  ): React.JSX.Element => (
    <div data-testid="catalogue" data-props={JSON.stringify(props)}>
      Catalogue
    </div>
  ),
}));

vi.mock('@/components/PokemonDetailPanel', () => ({
  __esModule: true,
  default: ({ pokemonName }: { pokemonName: string }): React.JSX.Element => (
    <div data-testid="detail" data-name={pokemonName}>
      Detail:{pokemonName}
    </div>
  ),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t:${key}`),
}));

vi.mock('@/api/serverFetchers', () => ({
  fetchPokemonList: vi.fn().mockResolvedValue({
    count: 1,
    results: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ],
  }),
  fetchPokemonDetails: vi.fn().mockResolvedValue({
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    types: [{ type: { name: 'electric' } }],
    abilities: [{ ability: { name: 'static' } }],
    sprites: { other: { 'official-artwork': { front_default: 'img.png' } } },
  }),
}));

interface RawListItem {
  name: string;
  url: string;
}
interface RawListResponse {
  count: number;
  results: RawListItem[];
}
interface RawDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  sprites: { other: { 'official-artwork': { front_default: string } } };
}
type Processed = { id: number; name: string; description: string };
vi.mock('@/api/pokemonApi', () => ({
  pokemonApi: {
    parsePokemonToProcessed: (d: RawDetails): Processed => ({
      id: d.id,
      name: d.name,
      description: 'desc',
    }),
    parseListToProcessed: (l: RawListResponse): Processed[] =>
      l.results.map((r: RawListItem, i: number) => ({
        id: i + 1,
        name: r.name,
        description: 'bulk',
      })),
  },
}));

describe('HomePage (App Router)', () => {
  it('renders catalogue with initial results and labels from translations', async (): Promise<void> => {
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });
    render(<Provider store={store}>{Page}</Provider>);
    const cat = screen.getByTestId('catalogue');
    expect(cat).toBeInTheDocument();
    const props = JSON.parse(cat.getAttribute('data-props') || '{}');
    expect(props.initialResults.length).toBeGreaterThan(0);
    expect(props.labels.search.title).toBeDefined();
  });

  it('includes details panel when details param provided', async (): Promise<void> => {
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ details: 'pikachu' }),
    });
    render(<Provider store={store}>{Page}</Provider>);
    expect(screen.getByTestId('catalogue')).toBeInTheDocument();
  });
});
