import React, { Component } from 'react';
import { type ResultItem } from './Results';

interface CardProps {
  item: ResultItem;
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  isSelected?: boolean;
  selectedPokemon?: ResultItem | null | undefined;
}

export class Card extends Component<CardProps> {
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private handleClick = async (e?: React.MouseEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (this.props.onPokemonClick) {
      await this.props.onPokemonClick(this.props.item.name);
    }
  };

  private isListItem(): boolean {
    return this.props.item.description.includes('Click to view details');
  }

  private renderListItemCard(): React.JSX.Element {
    const { item, isSelected } = this.props;

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* base card */}
          <div
            className={`flex-1 p-6 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500'
                : 'hover:bg-gray-50'
            }`}
            onClick={(e) => {
              e.preventDefault();
              void this.handleClick(e);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {this.capitalizeFirstLetter(item.name)[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {this.capitalizeFirstLetter(item.name)}
                    </h3>
                    <p className="text-gray-500 text-sm">Pokemon #{item.id}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      void this.handleClick(e);
                    }}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg'
                    }`}
                  >
                    {isSelected ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
              <div className="text-4xl opacity-20 ml-4">
                {isSelected ? '🔍' : '⚡'}
              </div>
            </div>
          </div>

          {/* details */}
          {isSelected && (
            <div className="w-80 bg-gradient-to-b from-blue-50 to-indigo-100 border-l border-blue-200">
              {this.renderPokemonDetails()}
            </div>
          )}
        </div>
      </div>
    );
  }

  private renderPokemonDetails(): React.JSX.Element {
    const { selectedPokemon } = this.props;

    if (!selectedPokemon) {
      return <div></div>;
    }

    const details = selectedPokemon.description.split(' | ');

    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
            ⚡
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-1">
            {this.capitalizeFirstLetter(selectedPokemon.name)}
          </h4>
          <p className="text-blue-600 font-medium text-sm">
            Pokemon #{selectedPokemon.id}
          </p>
        </div>

        <div className="space-y-3">
          {details.map((detail, index) => {
            const [label, value] = detail.split(':');
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-300 transition-colors duration-200"
              >
                {label && value ? (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      {label.trim()}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {value.trim()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{detail}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private renderDetailedView(): React.JSX.Element {
    const { item } = this.props;

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {this.capitalizeFirstLetter(item.name)[0]}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {this.capitalizeFirstLetter(item.name)}
                </h3>
                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Pokemon #{item.id}
                </span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-30">⚡</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.description.split(' | ').map((detail, index) => {
            const [label, value] = detail.split(':');
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors duration-200"
              >
                {label && value ? (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      {label.trim()}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {value.trim()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 font-medium">{detail}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  public override render(): React.JSX.Element {
    const isListItem = this.isListItem();

    if (isListItem) {
      return this.renderListItemCard();
    }

    return this.renderDetailedView();
  }
}
