'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CardList } from './CardList';
const SelectedFlyout = dynamic(
  () => import('./SelectedFlyout').then((m) => m.SelectedFlyout),
  {
    ssr: false,
    loading: () => null,
  }
);

export interface ResultItem {
  id: number;
  name: string;
  description: string;
  image?: string | null;
}

interface ResultsProps {
  results: ResultItem[];
  isLoading: boolean;
  error: string | null;
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  selectedPokemon?: ResultItem | null | undefined;
  labels: {
    loading: string;
    loading_description: string;
    error_title: string;
    error_suggestion: string;
    no_results_title: string;
    no_results_description: string;
    popular_searches: string;
  };
}

export function Results({
  results,
  isLoading,
  error,
  onPokemonClick,
  labels,
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
            {labels.loading}
          </span>
          <div className="mt-3 text-gray-400 text-sm">
            {labels.loading_description}
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
            {labels.error_title}
          </h3>
          <p className="text-gray-600 max-w-md leading-relaxed mb-4">{error}</p>
          <div className="text-gray-400 text-sm">{labels.error_suggestion}</div>
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
            {labels.no_results_title}
          </h3>
          <p className="text-gray-500 max-w-md leading-relaxed mb-4">
            {labels.no_results_description}
          </p>
          <div className="text-gray-400 text-sm">{labels.popular_searches}</div>
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
    <div className="relative w-full max-h-[18rem] overflow-y-auto custom-scrollbar">
      <div className="w-full">
        <CardList items={results} onPokemonClick={onPokemonClick} />
      </div>
      <SelectedFlyout />
    </div>
  );
}

export default Results;
