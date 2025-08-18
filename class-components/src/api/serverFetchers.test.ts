import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchMultiplePokemonDetails,
} from './serverFetchers';

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('serverFetchers', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetchPokemonList returns parsed json on success', async () => {
    const payload = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'pikachu', url: 'u' }],
    };
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => payload });
    const res = await fetchPokemonList({ offset: 0, limit: 1 });
    expect(res.results[0].name).toBe('pikachu');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('fetchPokemonDetails throws POKEMON_NOT_FOUND on 404', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, json: () => ({}) });
    await expect(
      fetchPokemonDetails({ nameOrId: 'missing' })
    ).rejects.toThrowError('POKEMON_NOT_FOUND');
  });

  it('fetchMultiplePokemonDetails filters out failed fetches', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => ({
          id: 25,
          name: 'pikachu',
          height: 4,
          weight: 60,
          base_experience: 112,
          types: [],
          abilities: [],
          sprites: {
            front_default: null,
            back_default: null,
            front_shiny: null,
            back_shiny: null,
          },
        }),
      })
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => ({}) });
    const list = await fetchMultiplePokemonDetails(['25', '26']);
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('pikachu');
  });

  it('fetchPokemonList throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => ({}),
    });
    await expect(fetchPokemonList({ offset: 0, limit: 1 })).rejects.toThrow(
      /Failed to fetch Pokemon list/
    );
  });

  it('fetchPokemonDetails throws generic error on non-404 failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => ({}),
    });
    await expect(fetchPokemonDetails({ nameOrId: 'pikachu' })).rejects.toThrow(
      /Failed to fetch Pokemon details/
    );
  });
});
