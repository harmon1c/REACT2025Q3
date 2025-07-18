import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Results, type ResultItem } from './Results';

const mockOnPokemonClick = vi.fn();

const mockResults: ResultItem[] = [
  {
    id: 1,
    name: 'pikachu',
    description: 'Electric type Pokemon',
  },
  {
    id: 2,
    name: 'charizard',
    description: 'Fire/Flying type Pokemon',
  },
  {
    id: 3,
    name: 'bulbasaur',
    description: 'Grass/Poison type Pokemon',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Results Component', () => {
  describe('Rendering Tests', () => {
    it('renders correct number of items when data is provided', () => {
      render(
        <Results
          results={mockResults}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('displays "no results" message when data array is empty', () => {
      render(
        <Results
          results={[]}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('No Pokemon Found')).toBeInTheDocument();
      expect(
        screen.getByText(/We couldn't find any Pokemon matching your search/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Popular searches: pikachu, charizard, bulbasaur/i)
      ).toBeInTheDocument();
    });

    it('shows loading state while fetching data', () => {
      render(
        <Results
          results={[]}
          isLoading={true}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
      expect(
        screen.getByText('Please wait while we fetch the information')
      ).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('correctly displays item names and descriptions', () => {
      const singleResult: ResultItem[] = [
        {
          id: 25,
          name: 'pikachu',
          description: 'Electric type Pokemon with lightning abilities',
        },
      ];

      render(
        <Results
          results={singleResult}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(
        screen.getByText('Electric type Pokemon with lightning abilities')
      ).toBeInTheDocument();
    });

    it('handles missing or undefined data gracefully', () => {
      const incompleteResults: ResultItem[] = [
        {
          id: 1,
          name: 'missingno',
          description: '',
        },
      ];

      render(
        <Results
          results={incompleteResults}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Missingno')).toBeInTheDocument();
    });

    it('renders multiple results correctly', () => {
      render(
        <Results
          results={mockResults}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      mockResults.forEach((result) => {
        expect(
          screen.getByText(
            result.name.charAt(0).toUpperCase() + result.name.slice(1)
          )
        ).toBeInTheDocument();
        expect(screen.getByText(result.description)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('displays error message when API call fails', () => {
      const errorMessage = 'Failed to fetch Pokemon data';

      render(
        <Results
          results={[]}
          isLoading={false}
          error={errorMessage}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(
        screen.getByText('Please try searching for a different Pokemon')
      ).toBeInTheDocument();
    });

    it('shows appropriate error for 4xx status codes', () => {
      const notFoundError = 'Pokemon not found (404)';

      render(
        <Results
          results={[]}
          isLoading={false}
          error={notFoundError}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText(notFoundError)).toBeInTheDocument();
    });

    it('shows appropriate error for 5xx status codes', () => {
      const serverError = 'Server error (500) - Please try again later';

      render(
        <Results
          results={[]}
          isLoading={false}
          error={serverError}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText(serverError)).toBeInTheDocument();
    });

    it('prioritizes loading state over error state when both are present', () => {
      const errorMessage = 'Network error occurred';

      render(
        <Results
          results={[]}
          isLoading={true}
          error={errorMessage}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
      expect(
        screen.getByText('Please wait while we fetch the information')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Oops! Something went wrong')
      ).not.toBeInTheDocument();
    });

    it('prioritizes error state over empty results', () => {
      const errorMessage = 'Connection timeout';

      render(
        <Results
          results={[]}
          isLoading={false}
          error={errorMessage}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('No Pokemon Found')).not.toBeInTheDocument();
    });
  });

  describe('State Priority Tests', () => {
    it('shows loading state when isLoading is true regardless of results', () => {
      render(
        <Results
          results={mockResults}
          isLoading={true}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
      expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    });

    it('shows results when not loading and no error', () => {
      render(
        <Results
          results={mockResults}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(
        screen.queryByText('Loading Pokemon data...')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Oops! Something went wrong')
      ).not.toBeInTheDocument();
    });
  });
});
