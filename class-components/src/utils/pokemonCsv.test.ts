import { describe, it, expect } from 'vitest';
import type { PokemonDetails } from '@/api/types';
import { buildPokemonCsv } from './pokemonCsv';

describe('buildPokemonCsv', () => {
  const sample: PokemonDetails[] = [
    {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [
        { type: { name: 'electric', url: 't/electric' } },
        { type: { name: 'mouse', url: 't/mouse' } },
      ],
      abilities: [
        {
          ability: { name: 'static', url: 'a/static' },
          is_hidden: false,
          slot: 1,
        },
      ],
      sprites: {
        front_default: null,
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    },
  ];

  it('produces a CSV string with header and rows', () => {
    const csv = buildPokemonCsv(sample);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('id,name,height,weight,base_experience,types');
    expect(lines[1]).toContain('25');
    expect(lines[1]).toContain('pikachu');
    expect(lines[1]).toContain('electric|mouse');
  });

  it('escapes quotes in values', () => {
    const withQuote: PokemonDetails[] = [
      {
        ...sample[0],
        name: 'pika"chu',
      },
    ];
    const csv = buildPokemonCsv(withQuote);
    expect(csv).toMatch(/"pika""chu"/);
  });
});
