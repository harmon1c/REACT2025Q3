import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page, { generateStaticParams, generateMetadata } from './page';

type Scenario = 'success' | 'noimage' | 'notfound' | 'error';
let scenario: Scenario = 'success';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/api/serverFetchers', () => ({
  fetchPokemonDetails: vi.fn(async () => {
    if (scenario === 'notfound') {
      throw new Error('POKEMON_NOT_FOUND');
    }
    if (scenario === 'error') {
      throw new Error('GENERIC_ERROR');
    }
    return {
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
      sprites:
        scenario === 'noimage'
          ? { front_default: null }
          : { front_default: 'img.png' },
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
    };
  }),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => {
    return (key: string): string => {
      const map: Record<string, string> = {
        details: 'Details',
        back_to_list: 'Back to list',
        'pokemon.labels.types': 'Types',
        'pokemon.labels.height': 'Height',
        'pokemon.labels.weight': 'Weight',
        'pokemon.labels.base_experience': 'Base XP',
        'pokemon.labels.abilities': 'Abilities',
      };
      return map[key] || key;
    };
  }),
}));

describe('Pokemon detail page (server component)', () => {
  beforeEach(() => {
    scenario = 'success';
  });

  it('generateStaticParams returns predefined list', async () => {
    const params = await generateStaticParams();
    expect(params).toContainEqual({ name: 'pikachu' });
    expect(params.length).toBeGreaterThan(3);
  });

  it('generateMetadata success', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', name: 'pikachu' }),
    });
    expect(meta.title).toContain('Pikachu');
    expect(meta.title).toContain('Details');
    expect(meta.description).toMatch(/TYPES:/i);
  });

  it('generateMetadata fallback on error', async () => {
    scenario = 'error';
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', name: 'missing' }),
    });
    expect(meta.title).toBe('Pokemon Not Found');
  });

  it('renders details with image', async () => {
    const jsx = await Page({
      params: Promise.resolve({ locale: 'en', name: 'pikachu' }),
    });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Pikachu'
    );
    expect(screen.getByText(/Types/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to list' })).toHaveAttribute(
      'href',
      '/en'
    );
    expect(screen.getByAltText('Pikachu')).toBeInTheDocument();
  });

  it('renders details without image (image branch false)', async () => {
    scenario = 'noimage';
    const jsx = await Page({
      params: Promise.resolve({ locale: 'en', name: 'pikachu' }),
    });
    render(jsx);
    expect(screen.queryByAltText('Pikachu')).not.toBeInTheDocument();
  });

  it('notFound path triggers notFound and rethrows', async () => {
    scenario = 'notfound';
    const { notFound } = await import('next/navigation');
    await expect(
      Page({
        params: Promise.resolve({ locale: 'en', name: 'missing' }),
      })
    ).rejects.toThrow('POKEMON_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('generic error rethrows without calling notFound', async () => {
    scenario = 'error';
    const { notFound } = await import('next/navigation');
    await expect(
      Page({
        params: Promise.resolve({ locale: 'en', name: 'missing' }),
      })
    ).rejects.toThrow('GENERIC_ERROR');
    expect(notFound).not.toHaveBeenCalled();
  });
});
