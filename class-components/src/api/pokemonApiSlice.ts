import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonListResponse, PokemonDetails } from './types';
import { API_BASE_URL } from './constants';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    // Accepts an optional dummy param for manual refetch (listResetCount)
    getPokemonList: builder.query<
      PokemonListResponse,
      { offset?: number; limit?: number; listResetCount?: number }
    >({
      query: ({ offset = 0, limit = 20 }) =>
        `pokemon?offset=${offset}&limit=${limit}`,
      // Use listResetCount in providesTags for cache busting
      providesTags: (_result, _error, arg) => {
        const tags: { type: 'PokemonList'; id: string }[] = [
          { type: 'PokemonList', id: 'LIST' },
        ];
        if (arg?.listResetCount !== undefined) {
          tags.push({ type: 'PokemonList', id: `LIST-${arg.listResetCount}` });
        }
        return tags;
      },
    }),
    getPokemonDetails: builder.query<PokemonDetails, string>({
      query: (nameOrId) => `pokemon/${nameOrId.toLowerCase()}`,
      providesTags: (_: unknown, __: unknown, nameOrId: string) => [
        { type: 'PokemonDetails', id: nameOrId },
      ],
    }),
    searchPokemon: builder.query<PokemonDetails, string>({
      query: (query) => `pokemon/${query.toLowerCase()}`,
      providesTags: (_: unknown, __: unknown, query: string) => [
        { type: 'PokemonDetails', id: query },
      ],
    }),
  }),
  tagTypes: ['PokemonList', 'PokemonDetails'],
});

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonQuery,
} = pokemonApi;
