import { describe, it, expect } from 'vitest';
import {
  PokemonApiError,
  handleApiError,
  formatApiError,
  getErrorMessage,
} from './errorHandler';

const makeResponse = (status: number): Response =>
  new Response(null, { status });

describe('PokemonApiError', () => {
  it('sets name, message, and status', () => {
    const err = new PokemonApiError('fail', 500);
    expect(err.name).toBe('PokemonApiError');
    expect(err.message).toBe('fail');
    expect(err.status).toBe(500);
  });
});

describe('handleApiError', () => {
  it('returns correct error for 404', () => {
    const err = handleApiError(makeResponse(404));
    expect(err).toBeInstanceOf(PokemonApiError);
    expect(err.status).toBe(404);
    expect(err.message).toMatch(/not found/i);
  });
  it('returns correct error for 400', () => {
    const err = handleApiError(makeResponse(400));
    expect(err.status).toBe(400);
    expect(err.message).toMatch(/400/);
  });
  it('returns correct error for 500', () => {
    const err = handleApiError(makeResponse(500));
    expect(err.status).toBe(500);
    expect(err.message).toMatch(/500/);
  });
  it('returns correct error for 503', () => {
    const err = handleApiError(makeResponse(503));
    expect(err.status).toBe(503);
    expect(err.message).toMatch(/503/);
  });
  it('returns default error for other status', () => {
    const err = handleApiError(makeResponse(418));
    expect(err.status).toBe(418);
    expect(err.message).toMatch(/418/);
  });
});

describe('formatApiError', () => {
  it('formats PokemonApiError', () => {
    const err = new PokemonApiError('fail', 401);
    expect(formatApiError(err)).toEqual({ message: 'fail', status: 401 });
  });
  it('formats generic Error', () => {
    const err = new Error('fail');
    expect(formatApiError(err)).toEqual({ message: 'fail' });
  });
  it('formats unknown', () => {
    expect(formatApiError('oops')).toEqual({
      message: expect.stringMatching(/unexpected/i),
    });
  });
});

describe('getErrorMessage', () => {
  it('returns custom 404 message with pokemonName', () => {
    const err = new PokemonApiError('fail', 404);
    expect(getErrorMessage(err, 'Pikachu')).toMatch(/Pikachu/);
  });
  it('returns formatted message for other errors', () => {
    const err = new PokemonApiError('fail', 500);
    expect(getErrorMessage(err)).toBe('fail');
  });
  it('returns formatted message for generic Error', () => {
    const err = new Error('fail');
    expect(getErrorMessage(err)).toBe('fail');
  });
  it('returns fallback for unknown', () => {
    expect(getErrorMessage('oops')).toMatch(/unexpected/i);
  });
});
