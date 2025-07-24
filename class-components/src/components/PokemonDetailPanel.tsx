import React from 'react';
import type { ProcessedPokemon } from '../api';
import { parsePokemonDetails } from '../utils/pokemonUtils';

interface PokemonDetailPanelProps {
  pokemon: ProcessedPokemon;
  onClose: () => void;
  isLoading?: boolean;
}

export const PokemonDetailPanel: React.FC<PokemonDetailPanelProps> = ({
  pokemon,
  onClose,
  isLoading = false,
}) => {
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const details = parsePokemonDetails(pokemon.description);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading pokemon details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-fit">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-800">Pokemon Details</h2>
      </div>

      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-white text-lg font-bold">
            {pokemon.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">
          {capitalizeFirstLetter(pokemon.name)}
        </h3>
        <p className="text-xs text-blue-600 font-medium">
          Pokemon #{pokemon.id}
        </p>
      </div>

      <div className="space-y-2 mb-3">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">
          Information
        </h4>
        <div className="space-y-1 text-sm">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-xs uppercase tracking-wide">
                {detail.label}:
              </span>
              <span className="text-gray-700 text-sm font-medium">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <button
            onClick={onClose}
            className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1.5 text-xs"
            aria-label="Close details"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Close Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
