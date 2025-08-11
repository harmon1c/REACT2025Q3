import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../[locale]/page';

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
  getTranslations: vi.fn().mockResolvedValue((k: string) => k),
}));

const listOk = { count: 1, results: [{ name: 'bulbasaur', url: 'u' }] };
const detailOk = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [],
  abilities: [],
  sprites: { other: { 'official-artwork': { front_default: 'img.png' } } },
};

// Mutable mocks for different scenarios
const fetchPokemonList = vi.fn();
const fetchPokemonDetails = vi.fn();
vi.mock('@/api/serverFetchers', () => ({
  fetchPokemonList: (...args: unknown[]): unknown => fetchPokemonList(...args),
  fetchPokemonDetails: (...args: unknown[]): unknown =>
    fetchPokemonDetails(...args),
}));
vi.mock('@/api/pokemonApi', () => ({
  pokemonApi: {
    parsePokemonToProcessed: (d: {
      id: number;
      name: string;
    }): { id: number; name: string; description: string } => ({
      id: d.id,
      name: d.name,
      description: 'd',
    }),
    parseListToProcessed: (l: {
      results: Array<{ name: string }>;
    }): Array<{ id: number; name: string; description: string }> =>
      l.results.map((r: { name: string }, i: number) => ({
        id: i + 1,
        name: r.name,
        description: 'l',
      })),
  },
}));

describe('HomePage branches', () => {
  it('search branch: successful detail fetch', async () => {
    fetchPokemonDetails.mockResolvedValueOnce(detailOk);
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ search: 'bulbasaur' }),
    });
    render(Page);
    const props = JSON.parse(
      screen.getByTestId('catalogue').getAttribute('data-props') || '{}'
    );
    expect(props.initialResults[0].name).toBe('bulbasaur');
    expect(props.initialTotalCount).toBe(1);
  });

  it('search branch: detail fetch failure caught', async () => {
    fetchPokemonDetails.mockRejectedValueOnce(new Error('fail'));
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ search: 'missing' }),
    });
    render(Page);
    const props = JSON.parse(
      screen.getByTestId('catalogue').getAttribute('data-props') || '{}'
    );
    expect(props.initialResults).toHaveLength(0);
    expect(props.initialTotalCount).toBe(0);
  });

  it('list branch: list fetch failure caught silently', async () => {
    fetchPokemonList.mockRejectedValueOnce(new Error('list fail'));
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ page: '2' }),
    });
    render(Page);
    const props = JSON.parse(
      screen.getByTestId('catalogue').getAttribute('data-props') || '{}'
    );
    expect(props.initialResults).toHaveLength(0); // fallback empty due to failure
  });

  it('list branch: details prefetch attempted and ignored on failure', async () => {
    fetchPokemonList.mockResolvedValueOnce(listOk);
    fetchPokemonDetails.mockRejectedValueOnce(new Error('prefetch fail'));
    const Page = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ details: 'bulbasaur' }),
    });
    render(Page);
    const props = JSON.parse(
      screen.getByTestId('catalogue').getAttribute('data-props') || '{}'
    );
    expect(props.selectedPokemonName).toBe('bulbasaur');
  });
});
