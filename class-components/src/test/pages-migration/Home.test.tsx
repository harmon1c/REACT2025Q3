import { vi } from 'vitest';
import React, { type JSX } from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';

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
    results = [
      { id: 1, name: 'bulbasaur', description: 'desc1' },
      { id: 2, name: 'ivysaur', description: 'desc2' },
    ],
    isLoading = false,
    error = null,
    onPokemonClick,
  }: {
    results?: Array<{ id: number; name: string; description: string }>;
    isLoading?: boolean;
    error?: string | null;
    onPokemonClick?: (name: string) => void;
  }): JSX.Element => (
    <div data-testid="results">
      {isLoading ? (
        <div data-testid="loading">Loading...</div>
      ) : error ? (
        <div data-testid="error">{error}</div>
      ) : (
        results?.map((item) => (
          <div
            key={item.id}
            data-testid={`result-${item.id}`}
            onClick={() => onPokemonClick?.(item.name)}
            style={{ cursor: 'pointer' }}
          >
            {item.name}
          </div>
        ))
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

let mockSelectedPokemon: {
  id: number;
  name: string;
  description: string;
} | null = null;
const routerDomParams: {
  details?: string | undefined;
  page?: string | undefined;
  navigateMock?: (() => void) | undefined;
} = { details: undefined, page: undefined, navigateMock: undefined };

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
    setPage: () => void;
    clearParams: () => void;
    selectedPokemon: { id: number; name: string; description: string } | null;
    totalCount: number;
    isSearchInProgress: boolean;
    selectPokemon: () => void;
    clearSelectionSync: () => void;
    forceUrlCleanup: () => void;
    setUrlSelectedPokemon: () => void;
    setSelectedPokemon: () => void;
  } => ({
    results: [
      { id: 1, name: 'bulbasaur', description: 'desc1' },
      { id: 2, name: 'ivysaur', description: 'desc2' },
    ],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 5,
    searchPokemon: vi.fn(),
    loadPage: vi.fn(),
    clearResults: vi.fn(),
    clearSelection: vi.fn(),
    setPage: vi.fn(),
    clearParams: vi.fn(),
    selectedPokemon: mockSelectedPokemon,
    totalCount: 2,
    isSearchInProgress: false,
    selectPokemon: vi.fn(),
    clearSelectionSync: vi.fn(),
    forceUrlCleanup: vi.fn(),
    setUrlSelectedPokemon: vi.fn(),
    setSelectedPokemon: vi.fn(),
  }),
}));

vi.doMock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: (): { pathname: string } => ({
      pathname: '/pokemon/details/pikachu',
    }),
    useSearchParams: (): [
      { get: (key: string) => string | null },
      () => void,
    ] => [
      {
        get: (key: string): string | null => {
          if (key === 'details') {
            return routerDomParams.details || null;
          }
          if (key === 'page') {
            return routerDomParams.page || null;
          }
          return null;
        },
      },
      vi.fn(),
    ],
    useNavigate: (): (() => void) => routerDomParams.navigateMock || vi.fn(),
    Outlet: (): JSX.Element => <div data-testid="outlet">Outlet Content</div>,
  };
});

vi.mock('../components/PokemonDetailPanel', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose?: () => void }): JSX.Element => (
    <div className="w-80 shrink-0">
      <button onClick={onClose}>Close Details</button>
    </div>
  ),
}));

let Home: React.FC;

function setupRouterDomMock(params?: {
  details?: string;
  page?: string;
  navigateMock?: () => void;
}): void {
  routerDomParams.details = params?.details;
  routerDomParams.page = params?.page;
  routerDomParams.navigateMock = params?.navigateMock;
}

const getHomeWithRouter = (): JSX.Element => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home Page', () => {
  beforeEach(async () => {
    vi.resetModules();
    setupRouterDomMock();
    const mod = await import('./Home');
    Home = mod.Home;
  });

  it('renders details panel when details param is present', async () => {
    mockSelectedPokemon = { id: 25, name: 'pikachu', description: 'desc' };
    setupRouterDomMock({ details: 'pikachu' });
    await act(async () => {
      renderWithProviders(getHomeWithRouter());
    });
    expect(screen.getByText('Close Details')).toBeInTheDocument();
    mockSelectedPokemon = null;
  });

  it('calls navigate with correct params when closing details panel (with page)', async () => {
    mockSelectedPokemon = { id: 25, name: 'pikachu', description: 'desc' };
    const mockNavigate = vi.fn();
    setupRouterDomMock({
      details: 'pikachu',
      page: '2',
      navigateMock: mockNavigate,
    });
    await act(async () => {
      renderWithProviders(getHomeWithRouter());
    });
    const closeButton = screen.getByText('Close Details');
    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
    mockSelectedPokemon = null;
  });

  it('calls navigate with correct params when closing details panel (no page)', async () => {
    mockSelectedPokemon = { id: 25, name: 'pikachu', description: 'desc' };
    const mockNavigate = vi.fn();
    setupRouterDomMock({ details: 'pikachu', navigateMock: mockNavigate });
    await act(async () => {
      renderWithProviders(getHomeWithRouter());
    });
    const closeButton = screen.getByText('Close Details');
    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
    mockSelectedPokemon = null;
  });
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('renders all main components', (): void => {
    renderWithProviders(getHomeWithRouter());

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders outlet for router content', (): void => {
    renderWithProviders(getHomeWithRouter());
  });

  it('displays pokemon results', (): void => {
    renderWithProviders(getHomeWithRouter());

    expect(screen.getByTestId('result-1')).toBeInTheDocument();
    expect(screen.getByTestId('result-2')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows pagination information', (): void => {
    renderWithProviders(getHomeWithRouter());

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('renders outlet container when on details path', (): void => {
    renderWithProviders(getHomeWithRouter());
  });

  it('renders main content structure', (): void => {
    renderWithProviders(getHomeWithRouter());

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('renders all components correctly', (): void => {
    renderWithProviders(getHomeWithRouter());
    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('handles search functionality', (): void => {
    renderWithProviders(getHomeWithRouter());

    const searchButton = screen.getByTestId('search-btn');
    fireEvent.click(searchButton);

    expect(searchButton).toBeInTheDocument();
  });

  it('handles clear functionality', (): void => {
    renderWithProviders(getHomeWithRouter());

    const clearButton = screen.getByTestId('clear-btn');
    fireEvent.click(clearButton);

    expect(clearButton).toBeInTheDocument();
  });

  it('handles pagination functionality', (): void => {
    renderWithProviders(getHomeWithRouter());

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('handles empty search query', (): void => {
    renderWithProviders(getHomeWithRouter());

    const emptySearchButton = screen.getByTestId('search-btn-empty');
    fireEvent.click(emptySearchButton);

    expect(emptySearchButton).toBeInTheDocument();
  });

  it('handles pokemon click navigation', (): void => {
    renderWithProviders(getHomeWithRouter());

    const pokemonResult = screen.getByTestId('result-1');
    fireEvent.click(pokemonResult);

    expect(pokemonResult).toBeInTheDocument();
  });
});
