import React from 'react';
import { parsePokemonDetails } from '../utils/pokemonUtils';
import { type ResultItem } from './Results';

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
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
        <div
          className={`p-4 cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500'
              : 'hover:bg-gray-50'
          }`}
          onClick={(e) => {
            e.preventDefault();
            void handleClick(e);
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {capitalizeFirstLetter(item.name)[0]}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {capitalizeFirstLetter(item.name)}
              </h3>
              <p className="text-gray-500 text-xs">Pokemon #{item.id}</p>
            </div>
          </div>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                void handleClick(e);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                isSelected
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500'
              }`}
            >
              {isSelected ? 'Hide Details' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailedView = (): React.JSX.Element => {
    const details = parsePokemonDetails(item.description);

    const abilities = details.find(
      (detail) => detail.label.toLowerCase() === 'abilities'
    );
    const otherDetails = details.filter(
      (detail) => detail.label.toLowerCase() !== 'abilities'
    );

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-md p-3 border border-blue-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {capitalizeFirstLetter(item.name)[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {capitalizeFirstLetter(item.name)}
              </h3>
              <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Pokemon #{item.id}
              </span>
            </div>
            <div className="text-xl opacity-30">⚡</div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {otherDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white rounded-md p-1.5 shadow-sm border border-gray-200"
                >
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                    {detail.label}
                  </p>
                  <p className="text-xs text-gray-800 font-medium">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>

            {abilities && (
              <div className="bg-white rounded-md p-1.5 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                  {abilities.label}
                </p>
                <p className="text-xs text-gray-800 font-medium">
                  {abilities.value}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isListItem()) {
    return renderListItemCard();
  }

  return renderDetailedView();
}
