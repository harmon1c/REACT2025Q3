export const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const API_ROUTES = {
  getPokemonList: (offset = 0, limit = 20): string => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    return `${API_BASE_URL}/pokemon?${params.toString()}`;
  },

  getPokemonDetails: (nameOrId: string): string =>
    `${API_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`,

  searchPokemon: (query: string): string =>
    `${API_BASE_URL}/pokemon/${query.toLowerCase()}`,
};

export const API_LIMITS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
