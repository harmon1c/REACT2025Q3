import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateStaticParams, generateMetadata } from './route-helpers';

let scenario: 'success' | 'error' = 'success';
vi.mock('@/api/serverFetchers', () => ({
  fetchPokemonDetails: vi.fn(() => {
    if (scenario === 'error') {
      return Promise.reject(new Error('fail'));
    }
    return Promise.resolve({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      abilities: [
        { ability: { name: 'static' }, is_hidden: false, slot: 1 },
        { ability: { name: 'lightning-rod' }, is_hidden: true, slot: 3 },
      ],
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      sprites: { front_default: 'img.png' },
      stats: [],
      moves: [],
      order: 25,
      past_types: [],
      species: { name: 'pikachu', url: '' },
      forms: [],
      game_indices: [],
      held_items: [],
      is_default: true,
      location_area_encounters: '',
    });
  }),
}));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(
    async () =>
      (key: string): string =>
        key === 'details' ? 'Details' : key
  ),
}));

describe('route-helpers', () => {
  beforeEach(() => {
    scenario = 'success';
  });

  it('generateStaticParams returns predefined pokemon names', async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([
      { name: 'pikachu' },
      { name: 'bulbasaur' },
      { name: 'charmander' },
      { name: 'squirtle' },
      { name: 'mew' },
    ]);
  });

  it('generateMetadata returns populated metadata on success', async () => {
    const meta = await generateMetadata({
      params: { name: 'pikachu', locale: 'en' },
    });
    expect(meta.title).toContain('Pikachu');
    expect(meta.title).toContain('Details');
    expect(meta.openGraph).toBeDefined();
  });

  it('generateMetadata returns fallback title on error', async () => {
    scenario = 'error';
    const meta = await generateMetadata({
      params: { name: 'missing', locale: 'en' },
    });
    expect(meta.title).toBe('Pokemon Not Found');
  });
});
