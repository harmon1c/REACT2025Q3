import React, { Component } from 'react';
import { Card } from './Card';
import { type ResultItem } from './Results';

interface CardListProps {
  items: ResultItem[];
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  selectedPokemon?: ResultItem | null | undefined;
}

export class CardList extends Component<CardListProps> {
  public override render(): React.JSX.Element {
    const { items, onPokemonClick, selectedPokemon } = this.props;

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
}
