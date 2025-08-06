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

// Function to get localized Pokemon detail labels
export const getLocalizedLabel = (
  englishLabel: string,
  t: (key: string) => string
): string => {
  const labelMap: Record<string, string> = {
    TYPES: 'pokemon.labels.types',
    HEIGHT: 'pokemon.labels.height',
    WEIGHT: 'pokemon.labels.weight',
    'BASE EXPERIENCE': 'pokemon.labels.base_experience',
    ABILITIES: 'pokemon.labels.abilities',
  };

  const key = labelMap[englishLabel.toUpperCase()];
  return key ? t(key) : englishLabel;
};
