import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

vi.mock('./components/Search', () => ({
  Search: ({
    onSearch,
    onClear,
    initialQuery,
  }: {
    onSearch: (query: string) => void;
    onClear: () => void;
    initialQuery: string;
  }): React.JSX.Element => (
    <div data-testid="mock-search">
      <input
        data-testid="search-input"
        defaultValue={initialQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button data-testid="search-button" onClick={() => onSearch('pikachu')}>
        Search
      </button>
      <button data-testid="clear-button" onClick={onClear}>
        Clear
      </button>
    </div>
  ),
}));

vi.mock('./components/Results', () => ({
  Results: ({
    results,
    isLoading,
    error,
    onPokemonClick,
    selectedPokemon,
  }: {
    results: Array<{ id: number; name: string; description: string }>;
    isLoading: boolean;
    error: string | null;
    onPokemonClick: (name: string) => void;
    selectedPokemon: { id: number; name: string; description: string } | null;
  }): React.JSX.Element => (
    <div data-testid="mock-results">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {results.map((result) => (
        <div
          key={result.id}
          data-testid={`result-item-${result.id}`}
          onClick={() => onPokemonClick(result.name)}
        >
          {result.name}: {result.description}
        </div>
      ))}
      {selectedPokemon && (
        <div data-testid="selected-pokemon">
          Selected: {selectedPokemon.name}
        </div>
      )}
    </div>
  ),
}));

vi.mock('./components/ErrorBoundary', () => ({
  ErrorBoundary: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => (
    <div data-testid="mock-error-boundary">{children}</div>
  ),
}));

vi.mock('./components/ErrorTester', () => ({
  ErrorTester: (): React.JSX.Element => (
    <div data-testid="mock-error-tester">Error Tester</div>
  ),
}));

vi.mock('./components/Header', () => ({
  Header: ({ title }: { title: string }): React.JSX.Element => (
    <div data-testid="mock-header">{title}</div>
  ),
}));

vi.mock('./components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <div data-testid="mock-main">{children}</div>
  ),
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockPokemonListResponse = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
  ],
};

const mockBulbasaurResponse = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [
    { ability: { name: 'overgrow' } },
    { ability: { name: 'chlorophyll' } },
  ],
};

const mockPikachuResponse = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockReturnValue(null);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('App Component', () => {
  describe('Initial Rendering Tests', () => {
    it('renders all main components', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-error-boundary')).toBeInTheDocument();
        expect(screen.getByTestId('mock-main')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-search')).toBeInTheDocument();
        expect(screen.getByTestId('mock-results')).toBeInTheDocument();
        expect(screen.getByTestId('mock-error-tester')).toBeInTheDocument();
      });
    });

    it('displays header with correct title', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByText('Pokemon Search')).toBeInTheDocument();
      });
    });
  });

  describe('Initial API Call Tests', () => {
    it('makes initial API call on component mount with empty query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      render(<App />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
        );
      });
    });

    it('makes initial API call with saved search term from localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue('pikachu');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPikachuResponse,
      });

      render(<App />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
      });
    });

    it('passes saved search term to Search component', async () => {
      mockLocalStorage.getItem.mockReturnValue('charizard');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toHaveValue('charizard');
      });
    });
  });

  describe('Loading State Tests', () => {
    it('shows loading state during initial API call', async () => {
      let resolvePromise:
        | ((value: { ok: boolean; json: () => Promise<unknown> }) => void)
        | undefined;
      const promise = new Promise<{
        ok: boolean;
        json: () => Promise<unknown>;
      }>((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(promise);

      render(<App />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      if (resolvePromise) {
        resolvePromise({
          ok: true,
          json: async () => mockPokemonListResponse,
        });
      }

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });

    it('shows loading state during search', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => mockPikachuResponse,
              });
            }, 100);
          });
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('API Success Scenarios', () => {
    it('handles successful pokemon list API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('result-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('result-item-3')).toBeInTheDocument();
      });

      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      expect(screen.getByText(/venusaur/i)).toBeInTheDocument();
    });

    it('handles successful pokemon search API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPikachuResponse,
      });

      mockLocalStorage.getItem.mockReturnValue('pikachu');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
        expect(screen.getByText(/electric/i)).toBeInTheDocument();
        expect(screen.getByText(/Height: 4dm/i)).toBeInTheDocument();
        expect(screen.getByText(/Weight: 60kg/i)).toBeInTheDocument();
      });
    });

    it('updates component state based on API responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Scenarios', () => {
    it('handles 404 Not Found errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      mockLocalStorage.getItem.mockReturnValue('invalidpokemon');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(
          screen.getByText(/Pokemon "invalidpokemon" not found/)
        ).toBeInTheDocument();
      });
    });

    it('handles 500 Server Error correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(
          screen.getByText(/Server error \(500\). Please try again later/i)
        ).toBeInTheDocument();
      });
    });

    it('handles 400 Bad Request errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(
          screen.getByText(
            /Request error \(400\). Please check your input and try again/
          )
        ).toBeInTheDocument();
      });
    });

    it('handles network errors correctly', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('clears results when API error occurs', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.queryByTestId('result-item-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality Tests', () => {
    it('makes API call when search is triggered', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPikachuResponse,
        });

      render(<App />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith(
          'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
      });
    });

    it('resets selected pokemon when new search is performed', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPikachuResponse,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const resultItem = screen.getByTestId('result-item-1');
      fireEvent.click(resultItem);

      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('selected-pokemon')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Clear Functionality Tests', () => {
    it('clears all state when clear is triggered', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);

      expect(screen.queryByTestId('result-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('searchTerm');
    });
  });

  describe('Pokemon Selection Tests', () => {
    it('handles pokemon click and fetches detailed information', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBulbasaurResponse,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const resultItem = screen.getByTestId('result-item-1');
      fireEvent.click(resultItem);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/bulbasaur'
        );
      });
    });

    it('handles pokemon selection errors', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const resultItem = screen.getByTestId('result-item-1');
      fireEvent.click(resultItem);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(
          screen.getByText(/Pokemon "bulbasaur" not found/i)
        ).toBeInTheDocument();
      });
    });

    it('toggles pokemon selection when clicking same pokemon', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBulbasaurResponse,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
      });

      const resultItem = screen.getByTestId('result-item-1');

      fireEvent.click(resultItem);

      await waitFor(() => {
        expect(screen.getByTestId('selected-pokemon')).toBeInTheDocument();
        expect(screen.getByText(/Selected: bulbasaur/i)).toBeInTheDocument();
      });

      fireEvent.click(resultItem);

      await waitFor(() => {
        expect(
          screen.queryByTestId('selected-pokemon')
        ).not.toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration Tests', () => {
    it('manages complete user flow: initial load -> search -> clear', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonListResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPikachuResponse,
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('result-item-1')).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
        );
      });

      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      });

      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);

      expect(screen.queryByText(/pikachu/i)).not.toBeInTheDocument();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('searchTerm');
    });

    it('handles localStorage integration correctly throughout app lifecycle', async () => {
      mockLocalStorage.getItem.mockReturnValue('charizard');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPikachuResponse,
      });

      render(<App />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('searchTerm');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/charizard'
        );
      });
    });
  });
});
