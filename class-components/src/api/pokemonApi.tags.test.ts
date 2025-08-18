import { describe, it, expect } from 'vitest';
import { pokemonApi } from './pokemonApiSlice';

describe('pokemonApi endpoint registration', () => {
  it('registers getPokemonList', () => {
    expect(Object.keys(pokemonApi.endpoints)).toContain('getPokemonList');
  });
  it('registers getPokemonDetails', () => {
    expect(Object.keys(pokemonApi.endpoints)).toContain('getPokemonDetails');
  });
});
