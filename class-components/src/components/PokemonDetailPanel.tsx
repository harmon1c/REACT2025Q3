import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parsePokemonDetails } from '../utils/pokemonUtils';
import { pokemonApi } from '../api';
import type { ProcessedPokemon, PokemonDetails } from '../api/types';

const PokemonDetailPanel: React.FC = () => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<ProcessedPokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = (): void => {
    navigate('/');
  };

  useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setIsLoading(true);
    setError(null);
    pokemonApi
      .getPokemonDetails(pokemonName)
      .then((details: PokemonDetails) => {
        setPokemon(pokemonApi.parsePokemonToProcessed(details));
      })
      .catch(() => setError('Failed to load details'))
      .finally(() => setIsLoading(false));
  }, [pokemonName]);

  if (isLoading) {
    return (
      <div className="sticky top-0 w-80 min-w-[320px] max-w-xs h-fit max-h-[600px] overflow-y-auto rounded-lg shadow-lg bg-white flex items-center justify-center p-6 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <span className="text-gray-700 dark:text-gray-200">Loading...</span>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="sticky top-0 w-80 min-w-[320px] max-w-xs h-fit max-h-[600px] overflow-y-auto rounded-lg shadow-lg bg-white flex items-center justify-center p-6 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <span className="text-gray-700 dark:text-gray-200">
          {error || 'No details found'}
        </span>
        <button
          onClick={handleClose}
          className="ml-4 px-2 py-1 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    );
  }

  const details = parsePokemonDetails(pokemon.description);

  return (
    <div className="sticky top-0 w-80 min-w-[320px] max-w-xs h-fit max-h-[600px] overflow-y-auto rounded-lg shadow-lg bg-white p-4 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Pokemon Details
        </h2>
      </div>
      <div className="text-center mb-4">
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-24 h-24 mx-auto mb-2 object-contain drop-shadow-lg rounded-full"
            loading="lazy"
          />
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-lg font-bold">
              {pokemon.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Pokemon #{pokemon.id}
        </p>
      </div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">
        Information
      </h4>
      <div className="space-y-1 text-sm mb-2">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium text-xs uppercase tracking-wide">
              {detail.label}:
            </span>
            <span className="text-gray-700 dark:text-gray-100 text-sm font-medium">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleClose}
        className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1.5 text-xs mt-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
        aria-label="Close details"
      >
        Close Details
      </button>
    </div>
  );
};

export default PokemonDetailPanel;
