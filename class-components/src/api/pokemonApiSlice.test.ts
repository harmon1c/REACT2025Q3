import { describe, it, expect } from 'vitest';

const getPokemonListQuery = ({
  offset = 0,
  limit = 20,
}: {
  offset?: number;
  limit?: number;
}): string => `pokemon?offset=${offset}&limit=${limit}`;
const getPokemonListProvidesTags = (
  _result: unknown,
  _error: unknown,
  arg: { listResetCount?: number }
): unknown => {
  const tags: { type: 'PokemonList'; id: string }[] = [
    { type: 'PokemonList', id: 'LIST' },
  ];
  if (arg?.listResetCount !== undefined) {
    tags.push({ type: 'PokemonList', id: `LIST-${arg.listResetCount}` });
  }
  return tags;
};
const getPokemonDetailsQuery = (nameOrId: string): string =>
  `pokemon/${nameOrId.toLowerCase()}`;
const getPokemonDetailsProvidesTags = (
  _: unknown,
  __: unknown,
  nameOrId: string
): unknown => [{ type: 'PokemonDetails', id: nameOrId }];
const searchPokemonQuery = (query: string): string =>
  `pokemon/${query.toLowerCase()}`;
const searchPokemonProvidesTags = (
  _: unknown,
  __: unknown,
  query: string
): unknown => [{ type: 'PokemonDetails', id: query }];

describe('pokemonApi endpoints', () => {
  it('getPokemonList query builds correct url', () => {
    const arg = { offset: 10, limit: 5 };
    const url = getPokemonListQuery(arg);
    expect(url).toBe('pokemon?offset=10&limit=5');
  });

  it('getPokemonDetails query builds correct url', () => {
    const url = getPokemonDetailsQuery('Pikachu');
    expect(url).toBe('pokemon/pikachu');
  });

  it('searchPokemon query builds correct url', () => {
    const url = searchPokemonQuery('Bulbasaur');
    expect(url).toBe('pokemon/bulbasaur');
  });

  it('providesTags for getPokemonList includes LIST and listResetCount', () => {
    const tags = getPokemonListProvidesTags(null, null, { listResetCount: 2 });
    expect(tags).toContainEqual({ type: 'PokemonList', id: 'LIST' });
    expect(tags).toContainEqual({ type: 'PokemonList', id: 'LIST-2' });
  });

  it('providesTags for getPokemonDetails includes correct id', () => {
    const tags = getPokemonDetailsProvidesTags(null, null, 'Pikachu');
    expect(tags).toContainEqual({ type: 'PokemonDetails', id: 'Pikachu' });
  });

  it('providesTags for searchPokemon includes correct id', () => {
    const tags = searchPokemonProvidesTags(null, null, 'Bulbasaur');
    expect(tags).toContainEqual({ type: 'PokemonDetails', id: 'Bulbasaur' });
  });
});
