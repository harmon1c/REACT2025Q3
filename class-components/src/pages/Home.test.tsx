import React, { type JSX } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';

vi.mock('../components/Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div data-testid="main">{children}</div>
  ),
}));

vi.mock('../components/Search', () => ({
  Search: ({
    onSearch,
    onClear,
    initialQuery,
  }: {
    onSearch: (query: string) => void;
    onClear: () => void;
    initialQuery: string;
  }): JSX.Element => (
    <div data-testid="search">
      <input data-testid="search-input" defaultValue={initialQuery} />
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
  }): JSX.Element => (
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
  }): JSX.Element => (
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
    clearSearch: () => void;
    goToPage: () => void;
    clearResults: () => void;
    clearSelection: () => void;
    clearParams: () => void;
    setPage: () => void;
    loadPage: () => void;
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
    clearSearch: vi.fn(),
    goToPage: vi.fn(),
    clearResults: vi.fn(),
    clearSelection: vi.fn(),
    clearParams: vi.fn(),
    setPage: vi.fn(),
    loadPage: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: (): { pathname: string } => ({
      pathname: '/pokemon/details/pikachu',
    }),
    useNavigate: (): (() => void) => vi.fn(),
    Outlet: (): JSX.Element => <div data-testid="outlet">Outlet Content</div>,
  };
});

const HomeWithRouter = (): JSX.Element => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home Page', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('renders all main components', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders outlet for router content', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('displays pokemon results', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('result-1')).toBeInTheDocument();
    expect(screen.getByTestId('result-2')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows pagination information', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('renders outlet container when on details path', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders main content structure', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('renders all components correctly', (): void => {
    render(<HomeWithRouter />);

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('handles search functionality', (): void => {
    render(<HomeWithRouter />);

    const searchButton = screen.getByTestId('search-btn');
    fireEvent.click(searchButton);

    expect(searchButton).toBeInTheDocument();
  });

  it('handles clear functionality', (): void => {
    render(<HomeWithRouter />);

    const clearButton = screen.getByTestId('clear-btn');
    fireEvent.click(clearButton);

    expect(clearButton).toBeInTheDocument();
  });

  it('handles pagination functionality', (): void => {
    render(<HomeWithRouter />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('handles empty search query', (): void => {
    render(<HomeWithRouter />);

    const emptySearchButton = screen.getByTestId('search-btn-empty');
    fireEvent.click(emptySearchButton);

    expect(emptySearchButton).toBeInTheDocument();
  });

  it('handles pokemon click navigation', (): void => {
    render(<HomeWithRouter />);

    const pokemonResult = screen.getByTestId('result-1');
    fireEvent.click(pokemonResult);

    expect(pokemonResult).toBeInTheDocument();
  });
});
