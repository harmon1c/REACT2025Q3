import React from 'react';
import { parsePokemonDetails } from '../utils/pokemonUtils';
import { type ResultItem } from './Results';
import { PokemonDetailsList, PokemonDetailsGrid } from './PokemonDetails';

interface CardProps {
  item: ResultItem;
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  isSelected?: boolean;
  selectedPokemon?: ResultItem | null | undefined;
}

export function Card({
  item,
  onPokemonClick,
  isSelected,
  selectedPokemon,
}: CardProps): React.JSX.Element {
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleClick = async (e?: React.MouseEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const scrollPosition = window.scrollY;

    if (onPokemonClick) {
      await onPokemonClick(item.name);

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'instant',
          });
        }
      }, 10);
    }
  };

  const isListItem = (): boolean => {
    return item.description.includes('Click to view details');
  };

  const renderListItemCard = (): React.JSX.Element => {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
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
              void handleClick(e);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {capitalizeFirstLetter(item.name)[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {capitalizeFirstLetter(item.name)}
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
                      void handleClick(e);
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
            <div className="min-w-80 max-w-md flex-shrink-0 bg-gradient-to-b from-blue-50 to-indigo-100 border-l border-blue-200">
              {renderPokemonDetails()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPokemonDetails = (): React.JSX.Element => {
    if (!selectedPokemon || !isSelected) {
      return <div></div>;
    }

    const details = parsePokemonDetails(selectedPokemon.description);

    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
            ⚡
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-1">
            {capitalizeFirstLetter(selectedPokemon.name)}
          </h4>
          <p className="text-blue-600 font-medium text-sm">
            Pokemon #{selectedPokemon.id}
          </p>
        </div>

        <PokemonDetailsList details={details} />
      </div>
    );
  };

  const renderDetailedView = (): React.JSX.Element => {
    const details = parsePokemonDetails(item.description);

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {capitalizeFirstLetter(item.name)[0]}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {capitalizeFirstLetter(item.name)}
                </h3>
                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Pokemon #{item.id}
                </span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-30">⚡</div>
        </div>

        <PokemonDetailsGrid details={details} />
      </div>
    );
  };

  if (isListItem()) {
    return renderListItemCard();
  }

  return renderDetailedView();
}
