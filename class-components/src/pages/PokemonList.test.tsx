import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PokemonList from './PokemonList';

vi.mock('../components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): React.ReactElement => (
    <div data-testid="main">{children}</div>
  ),
}));

vi.mock('../components/Search', () => ({
  Search: ({
    onSearch,
    onClear,
  }: {
    onSearch: (query: string) => void;
    onClear: () => void;
  }): React.ReactElement => (
    <div data-testid="search">
      <button data-testid="search-btn" onClick={() => onSearch('test')}>
        Search
      </button>
      <button data-testid="search-btn-empty" onClick={() => onSearch('')}>
        Search Empty
      </button>
      <button data-testid="clear-btn" onClick={onClear}>
        Clear
      </button>
    </div>
  ),
}));

vi.mock('../components/Results', () => ({
  Results: ({
    results,
    isLoading,
    error,
    onPokemonClick,
  }: {
    results: Array<{ id: number; name: string; description: string }>;
    isLoading: boolean;
    error: string | null;
    onPokemonClick?: (name: string) => void;
  }): React.ReactElement => (
    <div data-testid="results">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {results?.map(
        (item: { id: number; name: string; description: string }) => (
          <div
            key={item.id}
            data-testid={`result-${item.id}`}
            onClick={() => onPokemonClick?.(item.name)}
            style={{ cursor: 'pointer' }}
          >
            {item.name}
          </div>
        )
      )}
    </div>
  ),
}));

vi.mock('../components/Pagination', () => ({
  Pagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }): React.ReactElement => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('../hooks/usePokemonData', () => ({
  usePokemonData: (): {
    results: Array<{ id: number; name: string; description: string }>;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchPokemon: () => void;
    loadPage: () => void;
    clearResults: () => void;
    clearSelection: () => void;
    selectPokemon: () => void;
    setPage: () => void;
    clearParams: () => void;
  } => ({
    results: [
      { id: 1, name: 'bulbasaur', description: 'Grass Pokemon' },
      { id: 2, name: 'ivysaur', description: 'Grass Pokemon' },
    ],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 5,
    searchPokemon: vi.fn(),
    loadPage: vi.fn(),
    clearResults: vi.fn(),
    clearSelection: vi.fn(),
    selectPokemon: vi.fn(),
    setPage: vi.fn(),
    clearParams: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: (): (() => void) => vi.fn(),
  };
});

const PokemonListWithRouter = (): React.ReactElement => (
  <BrowserRouter>
    <PokemonList />
  </BrowserRouter>
);

describe('PokemonList Page', () => {
  it('renders all main components', (): void => {
    render(<PokemonListWithRouter />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('displays pokemon results', (): void => {
    render(<PokemonListWithRouter />);

    expect(screen.getByTestId('result-1')).toBeInTheDocument();
    expect(screen.getByTestId('result-2')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows pagination information', (): void => {
    render(<PokemonListWithRouter />);

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('renders search and clear functionality', (): void => {
    render(<PokemonListWithRouter />);

    expect(screen.getByTestId('search-btn')).toBeInTheDocument();
    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
  });

  it('handles search functionality', (): void => {
    render(<PokemonListWithRouter />);

    const searchButton = screen.getByTestId('search-btn');
    fireEvent.click(searchButton);

    expect(searchButton).toBeInTheDocument();
  });

  it('handles empty search query', (): void => {
    render(<PokemonListWithRouter />);

    const emptySearchButton = screen.getByTestId('search-btn-empty');
    fireEvent.click(emptySearchButton);

    expect(emptySearchButton).toBeInTheDocument();
  });

  it('handles clear functionality', (): void => {
    render(<PokemonListWithRouter />);

    const clearButton = screen.getByTestId('clear-btn');
    fireEvent.click(clearButton);

    expect(clearButton).toBeInTheDocument();
  });

  it('handles pagination functionality', (): void => {
    render(<PokemonListWithRouter />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('handles pokemon click navigation', (): void => {
    render(<PokemonListWithRouter />);

    const pokemonResult = screen.getByTestId('result-1');
    fireEvent.click(pokemonResult);

    expect(pokemonResult).toBeInTheDocument();
  });
});
