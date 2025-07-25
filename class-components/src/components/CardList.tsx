import React from 'react';
import { Card } from './Card';
import { type ResultItem } from './Results';

interface CardListProps {
  items: ResultItem[];
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  selectedPokemon?: ResultItem | null | undefined;
}

export function CardList({
  items,
  onPokemonClick,
  selectedPokemon,
}: CardListProps): React.JSX.Element {
  const hasDetailedCards =
    items?.some(
      (item) => !item.description.includes('Click to view details')
    ) || false;

  if (hasDetailedCards) {
    return (
      <div className="space-y-4 w-full">
        {items?.map((item) => (
          <Card
            key={item.id}
            item={item}
            onPokemonClick={onPokemonClick}
            isSelected={selectedPokemon?.name === item.name}
            selectedPokemon={selectedPokemon}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {items?.map((item) => (
        <Card
          key={item.id}
          item={item}
          onPokemonClick={onPokemonClick}
          isSelected={selectedPokemon?.name === item.name}
          selectedPokemon={selectedPokemon}
        />
      ))}
    </div>
  );
}
