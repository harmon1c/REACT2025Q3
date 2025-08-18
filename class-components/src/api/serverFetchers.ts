import { API_ROUTES } from './constants';
import type { PokemonDetails, PokemonListResponse } from './types';

export const REVALIDATE = {
  LIST: 60,
  DETAILS: 300,
};

interface ListParams {
  offset?: number;
  limit?: number;
  cache?: 'force-cache' | 'no-store';
  revalidateSeconds?: number;
}

export async function fetchPokemonList({
  offset = 0,
  limit = 20,
  cache,
  revalidateSeconds = REVALIDATE.LIST,
}: ListParams = {}): Promise<PokemonListResponse> {
  const url = API_ROUTES.getPokemonList(offset, limit).toString();
  const res = await fetch(url, {
    next: { revalidate: cache === 'no-store' ? 0 : revalidateSeconds },
    cache: cache === 'no-store' ? 'no-store' : 'force-cache',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon list (status ${res.status})`);
  }
  return res.json();
}

interface DetailsParams {
  nameOrId: string;
  cache?: 'force-cache' | 'no-store';
  revalidateSeconds?: number;
}

export async function fetchPokemonDetails({
  nameOrId,
  cache,
  revalidateSeconds = REVALIDATE.DETAILS,
}: DetailsParams): Promise<PokemonDetails> {
  const url = API_ROUTES.getPokemonDetails(nameOrId).toString();
  const res = await fetch(url, {
    next: { revalidate: cache === 'no-store' ? 0 : revalidateSeconds },
    cache: cache === 'no-store' ? 'no-store' : 'force-cache',
  });
  if (res.status === 404) {
    throw new Error('POKEMON_NOT_FOUND');
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon details (status ${res.status})`);
  }
  return res.json();
}

export async function fetchMultiplePokemonDetails(
  namesOrIds: string[]
): Promise<PokemonDetails[]> {
  const results = await Promise.all(
    namesOrIds.map(async (id) => {
      try {
        return await fetchPokemonDetails({ nameOrId: id });
      } catch {
        return null;
      }
    })
  );
  return results.filter((r): r is PokemonDetails => r !== null);
}
