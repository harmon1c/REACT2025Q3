import { describe, it, expect } from 'vitest';
import { API_ROUTES, API_BASE_URL } from './constants';

describe('API_ROUTES builders', () => {
  it('builds list url with custom params', () => {
    const url = API_ROUTES.getPokemonList(40, 10);
    expect(url).toBe(`${API_BASE_URL}/pokemon?offset=40&limit=10`);
  });

  it('builds details url (lowercases input)', () => {
    const url = API_ROUTES.getPokemonDetails('PiKaChu');
    expect(url).toBe(`${API_BASE_URL}/pokemon/pikachu`);
  });

  it('builds search url (lowercases input)', () => {
    const url = API_ROUTES.searchPokemon('BuLbAsAuR');
    expect(url).toBe(`${API_BASE_URL}/pokemon/bulbasaur`);
  });
});
