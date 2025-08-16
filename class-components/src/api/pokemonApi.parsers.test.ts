import { describe, it, expect } from 'vitest';
import { pokemonApi } from './pokemonApi';
import type { PokemonDetails, PokemonListResponse } from './types';

describe('pokemonApi parsers', () => {
  it('parsePokemonToProcessed capitalizes name and builds description/image', () => {
    const details: PokemonDetails = {
      id: 7,
      name: 'squirtle',
      height: 5,
      weight: 90,
      base_experience: 63,
      types: [
        { type: { name: 'water', url: 't/water' } },
        { type: { name: 'shell', url: 't/shell' } },
      ],
      abilities: [
        {
          ability: { name: 'torrent', url: 'a/torrent' },
          is_hidden: false,
          slot: 1,
        },
      ],
      sprites: {
        front_default: 'front.png',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    };
    const processed = pokemonApi.parsePokemonToProcessed(details);
    expect(processed.name).toBe('Squirtle');
    expect(processed.id).toBe(7);
    expect(processed.image).toBe('front.png');
    expect(processed.description).toContain('TYPES: water, shell');
    expect(processed.description).toContain('BASE EXPERIENCE: 63');
  });

  it('parseListToProcessed maps list entries and derives id + image', () => {
    const list: PokemonListResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/' },
      ],
    };
    const processed = pokemonApi.parseListToProcessed(list);
    expect(processed.length).toBe(2);
    const first = processed[0];
    const second = processed[1];
    expect(first.id).toBe(1);
    expect(first.name).toBe('Bulbasaur');
    expect(first.image).toMatch(/1\.png$/);
    expect(second.id).toBe(151);
    expect(second.name).toBe('Mew');
    expect(second.image).toMatch(/151\.png$/);
  });
});
