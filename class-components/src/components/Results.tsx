import React from 'react';
import { CardList } from './CardList';

export interface ResultItem {
  id: number;
  name: string;
  description: string;
}

interface ResultsProps {
  results: ResultItem[];
  isLoading: boolean;
  error: string | null;
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  selectedPokemon?: ResultItem | null | undefined;
}

export function Results({
  results,
  isLoading,
  error,
  onPokemonClick,
  selectedPokemon,
}: ResultsProps): React.JSX.Element {
  const renderLoadingState = (): React.JSX.Element => {
    return (
      <div className="p-12 min-h-[400px]">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <span className="mt-6 text-gray-600 text-xl font-medium">
            Loading Pokemon data...
          </span>
          <div className="mt-3 text-gray-400 text-sm">
            Please wait while we fetch the information
          </div>
        </div>
      </div>
    );
  };

  const renderErrorState = (error: string): React.JSX.Element => {
    return (
      <div className="p-12 min-h-[400px] border border-red-200 rounded-2xl">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md leading-relaxed mb-4">{error}</p>
          <div className="text-gray-400 text-sm">
            Please try searching for a different Pokemon
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (): React.JSX.Element => {
    return (
      <div className="p-12 min-h-[400px] border border-gray-200 rounded-2xl">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            No Pokemon Found
          </h3>
          <p className="text-gray-500 max-w-md leading-relaxed mb-4">
            We couldn&apos;t find any Pokemon matching your search. Try a
            different name or browse the complete list.
          </p>
          <div className="text-gray-400 text-sm">
            Popular searches: pikachu, charizard, bulbasaur
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState(error);
  }

  if (results.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-8 w-full">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Search Results
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>

      <div className="w-full">
        <CardList
          items={results}
          onPokemonClick={onPokemonClick}
          selectedPokemon={selectedPokemon}
        />
      </div>
    </div>
  );
}

export default Results;
