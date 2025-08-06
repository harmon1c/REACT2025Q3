// Utility for getting localized Pokemon descriptions
export const getPokemonDescription = (
  originalDescription: string,
  pokemonId: number,
  t: (key: string, params?: Record<string, string | number | Date>) => string
): string => {
  // Check if this is the API-generated placeholder description
  if (originalDescription.includes('Click to view details')) {
    return t('pokemon.click_to_view_details', { id: pokemonId });
  }

  // Return the original description for actual Pokemon details
  return originalDescription;
};

export const isPokemonListItem = (description: string): boolean => {
  return description.includes('Click to view details');
};
