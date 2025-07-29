import { API_ROUTES } from './constants';
import { handleApiError, PokemonApiError } from './errorHandler';
import type {
  PokemonListResponse,
  PokemonDetails,
  ProcessedPokemon,
} from './types';

class PokemonApi {
  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw handleApiError(response);
    }

    return response.json();
  }

  public async getPokemonList(
    offset = 0,
    limit = 20
  ): Promise<PokemonListResponse> {
    const url = API_ROUTES.getPokemonList(offset, limit);
    return this.fetchJson<PokemonListResponse>(url);
  }

  public async getPokemonDetails(nameOrId: string): Promise<PokemonDetails> {
    const url = API_ROUTES.getPokemonDetails(nameOrId);
    return this.fetchJson<PokemonDetails>(url);
  }

  public async searchPokemon(query: string): Promise<PokemonDetails> {
    const url = API_ROUTES.searchPokemon(query);
    return this.fetchJson<PokemonDetails>(url);
  }

  public parsePokemonToProcessed(pokemon: PokemonDetails): ProcessedPokemon {
    const types = pokemon.types.map((t) => t.type.name).join(', ');
    const abilities = pokemon.abilities.map((a) => a.ability.name).join(', ');

    const description = [
      `Types: ${types}`,
      `Height: ${pokemon.height}dm`,
      `Weight: ${pokemon.weight}kg`,
      `Base Experience: ${pokemon.base_experience}`,
      `Abilities: ${abilities}`,
    ].join(' | ');

    return {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      description,
      image: pokemon.sprites?.front_default ?? null,
    };
  }

  public parseListToProcessed(
    listResponse: PokemonListResponse
  ): ProcessedPokemon[] {
    return listResponse.results.map((item, index) => {
      const urlParts = item.url.split('/').filter(Boolean);
      const idString = urlParts[urlParts.length - 1];
      const id = idString ? parseInt(idString, 10) : index + 1;
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      return {
        id,
        name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        description: `Pokemon #${id} - Click to view details`,
        image,
      };
    });
  }
}

export const pokemonApi = new PokemonApi();

export type { PokemonListResponse, PokemonDetails, ProcessedPokemon };
export { PokemonApiError };
