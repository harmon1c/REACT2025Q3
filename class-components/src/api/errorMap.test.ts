import { describe, it, expect } from 'vitest';
import { mapErrorToMessage } from './errorMap';

describe('mapErrorToMessage', () => {
  it('returns translation key for POKEMON_NOT_FOUND error', () => {
    expect(mapErrorToMessage(new Error('POKEMON_NOT_FOUND'))).toBe(
      'pokemon.not_found'
    );
  });
  it('returns message for generic Error', () => {
    expect(mapErrorToMessage(new Error('OTHER'))).toBe('OTHER');
  });
  it('echoes string input', () => {
    expect(mapErrorToMessage('simple')).toBe('simple');
  });
  it('returns unknown_error for null', () => {
    expect(mapErrorToMessage(null)).toBe('unknown_error');
  });
  it('returns unknown_error for number', () => {
    expect(mapErrorToMessage(42)).toBe('unknown_error');
  });
});
