import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonCatalogueContainer } from './PokemonCatalogueContainer';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: (): { push: typeof push } => ({ push }),
}));

const searchPokemon = vi.fn();
const loadPage = vi.fn();
const clearResults = vi.fn();
vi.mock('@/hooks/usePokemonData', () => ({
  usePokemonData: (): Record<string, unknown> => ({
    results: [{}],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 3,
    searchPokemon,
    loadPage,
    clearResults,
  }),
}));

vi.mock('./Search', () => ({
  Search: ({
    value,
    onSearch,
    onClear,
    onChange,
  }: {
    value: string;
    onSearch: (q: string) => void;
    onClear: () => void;
    onChange: (v: string) => void;
  }): React.JSX.Element => (
    <div>
      <span data-testid="search-value">{value}</span>
      <button data-testid="change" onClick={() => onChange('bulb')}>
        change
      </button>
      <button data-testid="search-btn" onClick={() => onSearch('bulbasaur')}>
        go
      </button>
      <button data-testid="clear-btn" onClick={() => onClear()}>
        clr
      </button>
    </div>
  ),
}));
vi.mock('./Results', () => ({
  Results: (): React.JSX.Element => <div data-testid="results" />,
}));
vi.mock('./Pagination', () => ({
  Pagination: ({
    onPageChange,
  }: {
    onPageChange: (p: number) => void;
  }): React.JSX.Element => (
    <button data-testid="next-page" onClick={() => onPageChange(2)}>
      next
    </button>
  ),
}));
vi.mock('./Panel', () => ({
  Panel: ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <div data-testid="panel">{children}</div>
  ),
}));
vi.mock('./Main', () => ({
  Main: ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <main>{children}</main>
  ),
}));

const labels = {
  search: {
    title: 't',
    description: 'd',
    placeholder: 'p',
    button: 'b',
    clear: 'c',
  },
  results: {
    loading: 'l',
    loading_description: 'ld',
    error_title: 'et',
    error_suggestion: 'es',
    no_results_title: 'nrt',
    no_results_description: 'nrd',
    popular_searches: 'ps',
  },
  pagination: { previous: 'prev', next: 'next' },
};

describe('PokemonCatalogueContainer', () => {
  beforeEach(() => {
    push.mockReset();
    searchPokemon.mockReset();
    loadPage.mockReset();
    clearResults.mockReset();
    window.localStorage.clear();
  });

  it('prefills search from initialSearchQuery', () => {
    render(
      <PokemonCatalogueContainer labels={labels} initialSearchQuery="pikachu" />
    );
    expect(screen.getByTestId('search-value').textContent).toBe('pikachu');
  });

  it('updates searchTerm on input change', () => {
    render(<PokemonCatalogueContainer labels={labels} />);
    fireEvent.click(screen.getByTestId('change'));
    expect(screen.getByTestId('search-value').textContent).toBe('bulb');
  });

  it('triggers search flow and saves term', () => {
    render(<PokemonCatalogueContainer labels={labels} />);
    fireEvent.click(screen.getByTestId('search-btn'));
    expect(searchPokemon).toHaveBeenCalledWith('bulbasaur');
    expect(window.localStorage.getItem('searchTerm')).toBe('bulbasaur');
  });

  it('clears search and results', () => {
    window.localStorage.setItem('searchTerm', 'abc');
    render(<PokemonCatalogueContainer labels={labels} />);
    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(window.localStorage.getItem('searchTerm')).toBe('');
    expect(clearResults).toHaveBeenCalled();
  });

  it('changes page', () => {
    render(<PokemonCatalogueContainer labels={labels} />);
    fireEvent.click(screen.getByTestId('next-page'));
    expect(loadPage).toHaveBeenCalledWith(2);
  });

  it('injects onClose into detailsPanel when shown', () => {
    const Details = (props: { onClose?: () => void }): React.JSX.Element => (
      <button data-testid="details-close" onClick={props.onClose}>
        close
      </button>
    );
    render(
      <PokemonCatalogueContainer
        labels={labels}
        showDetailsPanel
        detailsPanel={<Details />}
      />
    );
    fireEvent.click(screen.getByTestId('details-close'));
    expect(push).toHaveBeenCalledWith('/');
  });
});
