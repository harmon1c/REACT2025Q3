export interface PokemonDetail {
  label: string;
  value: string;
}

export const parsePokemonDetails = (description: string): PokemonDetail[] => {
  const details = description.split(' | ');

  return details.map((detail) => {
    const [label, value] = detail.split(':');
    return {
      label: label?.trim() || '',
      value: value?.trim() || detail.trim(),
    };
  });
};
