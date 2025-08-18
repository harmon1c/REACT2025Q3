import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildPokemonCsv } from '@/utils/pokemonCsv';
import { fetchMultiplePokemonDetails } from '@/api/serverFetchers';
import { buildCsvAction } from './buildCsvAction';

let multipleReturn: unknown[] = [];
let csvReturn = 'csv-data';
vi.mock('@/api/serverFetchers', () => ({
  fetchMultiplePokemonDetails: vi.fn(() => Promise.resolve(multipleReturn)),
}));
vi.mock('@/utils/pokemonCsv', () => ({
  buildPokemonCsv: vi.fn(() => csvReturn),
}));

describe('buildCsvAction', () => {
  beforeEach(() => {
    multipleReturn = [];
    csvReturn = 'csv-data';
    vi.clearAllMocks();
  });

  it('throws on invalid payload (empty array)', async () => {
    await expect(buildCsvAction([])).rejects.toThrow('INVALID_PAYLOAD');
  });

  it('throws when no data returned', async () => {
    multipleReturn = [];
    await expect(buildCsvAction(['1'])).rejects.toThrow('NO_DATA');
  });

  it('returns csv string on success', async () => {
    multipleReturn = [{ id: '1' }];
    csvReturn = 'id\n1';
    const csv = await buildCsvAction(['1']);
    expect(csv).toBe('id\n1');
    expect(fetchMultiplePokemonDetails).toHaveBeenCalledWith(['1']);
    expect(buildPokemonCsv).toHaveBeenCalled();
  });
});
