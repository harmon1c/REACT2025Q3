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
  return (
    <div className="space-y-6">
      {items.map((item) => (
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
