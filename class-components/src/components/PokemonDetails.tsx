import React from 'react';
import { type PokemonDetail } from '../utils/pokemonUtils';

interface PokemonDetailsListProps {
  details: PokemonDetail[];
  className?: string;
}

export function PokemonDetailsList({
  details,
  className = 'space-y-3',
}: PokemonDetailsListProps): React.JSX.Element {
  return (
    <div className={className}>
      {details.map((detail, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-300 transition-colors duration-200"
        >
          {detail.label && detail.value !== detail.label ? (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {detail.label}
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {detail.value}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-700">{detail.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

interface PokemonDetailsGridProps {
  details: PokemonDetail[];
  className?: string;
}

export function PokemonDetailsGrid({
  details,
  className = 'grid grid-cols-1 md:grid-cols-2 gap-4',
}: PokemonDetailsGridProps): React.JSX.Element {
  return (
    <div className={className}>
      {details.map((detail, index) => (
        <div
          key={index}
          className="bg-white rounded-md p-2 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors duration-200"
        >
          {detail.label && detail.value !== detail.label ? (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {detail.label}
              </p>
              <p className="text-xs text-gray-800 font-medium">
                {detail.value}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-700 font-medium">{detail.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
