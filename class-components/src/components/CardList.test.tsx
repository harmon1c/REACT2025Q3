import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../context/ThemeContext';
import { type ResultItem } from './Results';
import { CardList } from './CardList';

const mockOnPokemonClick = vi.fn();

const mockPokemonList: ResultItem[] = [
  {
    id: 1,
    name: 'bulbasaur',
    description: 'Grass/Poison type Pokemon',
  },
  {
    id: 2,
    name: 'ivysaur',
    description: 'Grass/Poison type Pokemon',
  },
  {
    id: 3,
    name: 'charizard',
    description: 'Fire/Flying type Pokemon. Click to view details',
  },
];

describe('CardList Component', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('renders all pokemon cards', (): void => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList
            items={mockPokemonList}
            onPokemonClick={mockOnPokemonClick}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('uses grid layout when showAsGrid is true', (): void => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList
            items={mockPokemonList}
            onPokemonClick={mockOnPokemonClick}
          />
        </ThemeProvider>
      </Provider>
    );

    const gridContainer = container.querySelector('.grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('uses single column layout when items have detailed descriptions', (): void => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList
            items={mockPokemonList}
            onPokemonClick={mockOnPokemonClick}
          />
        </ThemeProvider>
      </Provider>
    );

    const spaceContainer = container.querySelector('.space-y-4');
    expect(spaceContainer).toBeInTheDocument();
  });

  it('defaults to grid layout when showAsGrid is not specified', (): void => {
    const gridOnlyItems = mockPokemonList.map((item) => ({
      ...item,
      description: item.description.includes('Click to view details')
        ? item.description
        : item.description + '. Click to view details',
    }));

    const { container } = render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList items={gridOnlyItems} onPokemonClick={mockOnPokemonClick} />
        </ThemeProvider>
      </Provider>
    );

    const gridContainer = container.querySelector('.grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('passes onPokemonClick to Card components', (): void => {
    const gridItems = mockPokemonList.map((item) => ({
      ...item,
      description: item.description + '. Click to view details',
    }));

    render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList items={gridItems} onPokemonClick={mockOnPokemonClick} />
        </ThemeProvider>
      </Provider>
    );

    const viewDetailsButtons = screen.getAllByText('View Details');
    if (viewDetailsButtons[0]) {
      fireEvent.click(viewDetailsButtons[0]);
    }

    expect(mockOnPokemonClick).toHaveBeenCalledWith('bulbasaur');
  });

  it('handles empty pokemon list', (): void => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList items={[]} onPokemonClick={mockOnPokemonClick} />
        </ThemeProvider>
      </Provider>
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.children).toHaveLength(0);
  });

  it('applies correct CSS classes for grid layout', (): void => {
    const gridOnlyItems = mockPokemonList.map((item) => ({
      ...item,
      description: item.description + '. Click to view details',
    }));

    const { container } = render(
      <Provider store={store}>
        <ThemeProvider>
          <CardList items={gridOnlyItems} onPokemonClick={mockOnPokemonClick} />
        </ThemeProvider>
      </Provider>
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-2', 'w-full');
  });
});
