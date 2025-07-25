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
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Results Component', () => {
  describe('Rendering Tests', () => {
    it('renders pokemon when data is provided', () => {
      render(
        <Results
          results={mockResults}
          isLoading={false}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
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
    });

    it('shows loading state when isLoading is true', () => {
      render(
        <Results
          results={[]}
          isLoading={true}
          error={null}
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
    });

    it('displays error message when error is provided', () => {
      render(
        <Results
          results={[]}
          isLoading={false}
          error="Network error"
          onPokemonClick={mockOnPokemonClick}
        />
      );

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
