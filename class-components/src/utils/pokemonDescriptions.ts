export const getPokemonDescription = (
  originalDescription: string,
  pokemonId: number,
  t: (key: string, params?: Record<string, string | number | Date>) => string
): string => {
  if (originalDescription.includes('Click to view details')) {
    return t('pokemon.click_to_view_details', { id: pokemonId });
  }

  return originalDescription;
};

export const isPokemonListItem = (description: string): boolean => {
  return description.includes('Click to view details');
};
