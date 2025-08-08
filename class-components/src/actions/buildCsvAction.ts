'use server';
import { z } from 'zod';
import { fetchMultiplePokemonDetails } from '@/api/serverFetchers';
import { buildPokemonCsv } from '@/utils/pokemonCsv';

const idsSchema = z.array(z.string().min(1)).min(1).max(200);

export async function buildCsvAction(ids: string[]): Promise<string> {
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) {
    throw new Error('INVALID_PAYLOAD');
  }
  const details = await fetchMultiplePokemonDetails(parsed.data);
  if (!details.length) {
    throw new Error('NO_DATA');
  }
  return buildPokemonCsv(details);
}
