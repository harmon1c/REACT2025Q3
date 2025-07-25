import { describe, it, expect, vi, afterEach } from 'vitest';
import { pokemonApi } from './pokemonApi';
import {
  handleApiError,
  formatApiError,
  getErrorMessage,
  PokemonApiError,
} from './errorHandler';

global.fetch = vi.fn();

describe('pokemonApi', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('getPokemonList calls correct endpoint and returns data', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ count: 1, results: [] }),
    };
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);
    const data = await pokemonApi.getPokemonList(0, 10);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('offset=0'));
    expect(data).toEqual({ count: 1, results: [] });
  });

  it('getPokemonDetails throws on error', async () => {
    const mockResponse = { ok: false, status: 404 };
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);
    await expect(
      pokemonApi.getPokemonDetails('missingno')
    ).rejects.toBeInstanceOf(PokemonApiError);
  });

  it('parsePokemonToProcessed returns processed data', () => {
    const processed = pokemonApi.parsePokemonToProcessed({
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass', url: 'type-url' } }],
      abilities: [
        {
          ability: { name: 'overgrow', url: 'ability-url' },
          is_hidden: false,
          slot: 1,
        },
      ],
      height: 7,
      weight: 69,
      base_experience: 64,
      sprites: {
        front_default: null,
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
    });
    expect(processed).toHaveProperty('description');
    expect(processed.name).toBe('Bulbasaur');
  });

  it('parseListToProcessed returns array of processed', () => {
    const processed = pokemonApi.parseListToProcessed({
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });
    expect(processed.length).toBe(2);
    expect(processed[0]?.name).toBe('Bulbasaur');
  });
});

describe('errorHandler', () => {
  class TestResponse implements Response {
    public readonly ok = false;
    public readonly headers = new Headers();
    public readonly redirected = false;
    public readonly statusText = '';
    public readonly type: ResponseType = 'basic';
    public readonly url = '';
    public readonly body: null = null;
    public readonly bodyUsed = false;
    public readonly status: number;
    public constructor(status: number) {
      this.status = status;
    }
    public arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }
    public blob(): Promise<Blob> {
      return Promise.resolve(new Blob());
    }
    public formData(): Promise<FormData> {
      return Promise.resolve(new FormData());
    }
    public json(): Promise<object> {
      return Promise.resolve({});
    }
    public text(): Promise<string> {
      return Promise.resolve('');
    }
    public clone(): Response {
      return this;
    }
    public bytes(): Promise<Uint8Array<ArrayBuffer>> {
      return Promise.resolve(new Uint8Array(new ArrayBuffer(0)));
    }
  }

  it('handleApiError returns correct error for 404', () => {
    const error = handleApiError(new TestResponse(404));
    expect(error).toBeInstanceOf(PokemonApiError);
    expect(error.status).toBe(404);
    expect(error.message).toMatch(/not found/i);
  });

  it('handleApiError returns correct error for 400', () => {
    const error = handleApiError(new TestResponse(400));
    expect(error).toBeInstanceOf(PokemonApiError);
    expect(error.status).toBe(400);
    expect(error.message).toMatch(/400/);
  });

  it('handleApiError returns correct error for 500', () => {
    const error = handleApiError(new TestResponse(500));
    expect(error).toBeInstanceOf(PokemonApiError);
    expect(error.status).toBe(500);
    expect(error.message).toMatch(/500/);
  });

  it('handleApiError returns correct error for 503', () => {
    const error = handleApiError(new TestResponse(503));
    expect(error).toBeInstanceOf(PokemonApiError);
    expect(error.status).toBe(503);
    expect(error.message).toMatch(/503/);
  });

  it('handleApiError returns correct error for unknown status', () => {
    const error = handleApiError(new TestResponse(418));
    expect(error).toBeInstanceOf(PokemonApiError);
    expect(error.status).toBe(418);
    expect(error.message).toMatch(/418/);
  });

  it('formatApiError handles plain Error', () => {
    const err = new Error('plain error');
    const formatted = formatApiError(err);
    expect(formatted).toEqual({ message: 'plain error' });
  });

  it('formatApiError handles unknown', () => {
    const formatted = formatApiError('not-an-error');
    expect(formatted).toEqual({
      message: 'An unexpected error occurred. Please try again.',
    });
  });

  it('getErrorMessage returns fallback for non-404', () => {
    const err = new PokemonApiError('fail', 500);
    const msg = getErrorMessage(err, 'pikachu');
    expect(msg).toBe('fail');
  });

  it('getErrorMessage returns fallback for unknown', () => {
    const msg = getErrorMessage('not-an-error');
    expect(msg).toBe('An unexpected error occurred. Please try again.');
  });

  it('formatApiError formats PokemonApiError', () => {
    const err = new PokemonApiError('fail', 500);
    const formatted = formatApiError(err);
    expect(formatted).toEqual({ message: 'fail', status: 500 });
  });

  it('getErrorMessage returns custom message for 404', () => {
    const err = new PokemonApiError('not found', 404);
    const msg = getErrorMessage(err, 'pikachu');
    expect(msg).toContain('pikachu');
  });
});
