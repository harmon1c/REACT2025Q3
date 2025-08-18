import type { PokemonDetails } from '@/api/types';

export function buildPokemonCsv(details: PokemonDetails[]): string {
  const header = ['id', 'name', 'height', 'weight', 'base_experience', 'types'];
  const escape = (val: unknown): string => {
    if (val == null) {
      return '""';
    }
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const rows = details.map((d) => {
    const types = d.types.map((t) => t.type.name).join('|');
    return [d.id, d.name, d.height, d.weight, d.base_experience, types]
      .map(escape)
      .join(',');
  });
  return [header.join(','), ...rows].join('\n');
}
