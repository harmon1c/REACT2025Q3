import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Card } from './Card';
import { type ResultItem } from './Results';

interface CardListProps {
  items: ResultItem[];
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
}
export function CardList({
  items,
  onPokemonClick,
}: CardListProps): React.JSX.Element {
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  const isItemSelected = (item: ResultItem): boolean =>
    selectedItems.some((selected) => String(selected.id) === String(item.id));

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
            isSelected={isItemSelected(item)}
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
          isSelected={isItemSelected(item)}
        />
      ))}
    </div>
  );
}
