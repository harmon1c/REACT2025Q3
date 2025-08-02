import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../context/ThemeContext';
import { Card } from './Card';
import { type ResultItem } from './Results';

const mockOnPokemonClick = vi.fn();

const mockListItemPokemon: ResultItem = {
  id: 2,
  name: 'charizard',
  description: 'Fire/Flying type Pokemon. Click to view details',
};

const mockSimpleDetailedPokemon: ResultItem = {
  id: 25,
  name: 'pikachu',
  description: 'Electric type Pokemon',
};

const mockDetailedPokemon: ResultItem = {
  id: 1,
  name: 'bulbasaur',
  description:
    'Height: 0.7m | Weight: 6.9kg | Type: Grass/Poison | Abilities: Overgrow, Chlorophyll',
};

beforeEach(() => {
  vi.clearAllMocks();

  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
});

describe('Card Component', () => {
  describe('Detailed Card Rendering', () => {
    it('renders simple description as a single detail item', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );

      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getAllByText('Electric type Pokemon')).toHaveLength(2); // label and value
    });
  });

  describe('List Item Card Rendering', () => {
    it('renders list item pokemon name correctly', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });

    it('renders list item with View Details button', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument();
    });
  });

  describe('Interaction Tests', () => {
    it('calls onPokemonClick when View Details button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card
              item={mockListItemPokemon}
              onPokemonClick={mockOnPokemonClick}
            />
          </ThemeProvider>
        </Provider>
      );

      const viewButton = screen.getByRole('button', { name: /view details/i });
      await user.click(viewButton);

      await waitFor(() => {
        expect(mockOnPokemonClick).toHaveBeenCalledWith('charizard');
      });
    });
  });
});

describe('Card Component', () => {
  describe('Basic Rendering Tests', () => {
    it('renders pokemon name correctly capitalized', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );

      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    it('renders pokemon description for detailed card', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );

      expect(screen.getAllByText('Electric type Pokemon')).toHaveLength(2);
    });

    it('renders pokemon ID with "Pokemon #" prefix', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );

      expect(screen.getByText('Pokemon #25')).toBeInTheDocument();
    });

    it('renders first letter of pokemon name in avatar circle', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );

      const avatar = screen.getByText('P');
      expect(avatar).toBeInTheDocument();
    });

    it('renders without crashing when given minimal props', () => {
      const minimalPokemon: ResultItem = {
        id: 1,
        name: 'test',
        description: 'test description',
      };

      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={minimalPokemon} />
          </ThemeProvider>
        </Provider>
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Card Type Detection Tests', () => {
    it('renders detailed view for pokemon with structured description', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('0.7m')).toBeInTheDocument();
      expect(screen.getByText('6.9kg')).toBeInTheDocument();
    });

    it('renders list item view for pokemon with "Click to view details" in description', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Charizard')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument();
    });

    it('distinguishes between detailed and list item cards correctly', () => {
      const { rerender } = render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.queryByRole('button', { name: /view details/i })
      ).not.toBeInTheDocument();
      rerender(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument();
    });
  });

  describe('Interaction Tests', () => {
    it('calls onPokemonClick when card is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card
              item={mockListItemPokemon}
              onPokemonClick={mockOnPokemonClick}
            />
          </ThemeProvider>
        </Provider>
      );
      const card = screen
        .getByRole('button', { name: /view details/i })
        .closest('div');
      if (card?.parentElement) {
        await user.click(card.parentElement);
      }
      await waitFor(() => {
        expect(mockOnPokemonClick).toHaveBeenCalledWith('charizard');
      });
    });

    it('calls onPokemonClick when "View Details" button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card
              item={mockListItemPokemon}
              onPokemonClick={mockOnPokemonClick}
            />
          </ThemeProvider>
        </Provider>
      );
      const viewButton = screen.getByRole('button', { name: /view details/i });
      await user.click(viewButton);
      await waitFor(() => {
        expect(mockOnPokemonClick).toHaveBeenCalledWith('charizard');
      });
    });

    it('handles missing onPokemonClick gracefully', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} />
          </ThemeProvider>
        </Provider>
      );
      const viewButton = screen.getByRole('button', { name: /view details/i });
      await user.click(viewButton);
      expect(mockOnPokemonClick).not.toHaveBeenCalled();
    });

    it('prevents event propagation when button is clicked', async () => {
      const parentClickHandler = vi.fn();
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <div onClick={parentClickHandler}>
              <Card
                item={mockListItemPokemon}
                onPokemonClick={mockOnPokemonClick}
              />
            </div>
          </ThemeProvider>
        </Provider>
      );
      const viewButton = screen.getByRole('button', { name: /view details/i });
      await user.click(viewButton);
      await waitFor(() => {
        expect(mockOnPokemonClick).toHaveBeenCalledWith('charizard');
      });
      expect(parentClickHandler).not.toHaveBeenCalled();
    });
  });

  describe('Selection State Tests', () => {
    it('shows "View Details" button when not selected', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} isSelected={false} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument();
    });

    it('shows "View Details" button when selected', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} isSelected={true} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument();
    });

    it('applies selected styling when isSelected is true', () => {
      const { container } = render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} isSelected={true} />
          </ThemeProvider>
        </Provider>
      );
      const clickableDiv = container.querySelector(
        'div[class*="cursor-pointer"]'
      );
      expect(clickableDiv).toHaveClass(
        'bg-gradient-to-r',
        'from-blue-50',
        'to-indigo-50'
      );
    });

    it('applies normal styling when isSelected is false', () => {
      const { container } = render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} isSelected={false} />
          </ThemeProvider>
        </Provider>
      );
      const clickableDiv = container.querySelector(
        'div[class*="cursor-pointer"]'
      );
      expect(clickableDiv).toHaveClass('hover:bg-gray-50');
      expect(clickableDiv).not.toHaveClass('bg-gradient-to-r');
    });

    it('renders pokemon details when selected and selectedPokemon is provided', () => {
      const selectedPokemon: ResultItem = {
        id: 25,
        name: 'pikachu',
        description:
          'Height: 0.4m | Weight: 6.0kg | Type: Electric | Abilities: Static, Lightning Rod',
      };
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={selectedPokemon} isSelected={true} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('0.4m')).toBeInTheDocument();
      expect(screen.getByText('6.0kg')).toBeInTheDocument();
      expect(screen.getByText('Electric')).toBeInTheDocument();
    });

    it('does not render details panel when selected but no selectedPokemon provided', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockListItemPokemon} isSelected={true} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Charizard')).toBeInTheDocument();
      expect(screen.queryByText('Height')).not.toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('correctly parses and displays structured pokemon details', () => {
      const detailedPokemon: ResultItem = {
        id: 3,
        name: 'venusaur',
        description:
          'Height: 2.0m | Weight: 100.0kg | Type: Grass/Poison | Abilities: Overgrow, Chlorophyll',
      };
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={detailedPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('2.0m')).toBeInTheDocument();
      expect(screen.getByText('100.0kg')).toBeInTheDocument();
      expect(screen.getByText('Grass/Poison')).toBeInTheDocument();
      expect(screen.getByText('Overgrow, Chlorophyll')).toBeInTheDocument();
    });

    it('handles empty description gracefully', () => {
      const emptyDescPokemon: ResultItem = {
        id: 999,
        name: 'missingno',
        description: '',
      };
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={emptyDescPokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(screen.getByText('Missingno')).toBeInTheDocument();
      expect(screen.getByText('Pokemon #999')).toBeInTheDocument();
    });

    it('displays unstructured descriptions as plain text', () => {
      const simplePokemon: ResultItem = {
        id: 150,
        name: 'mewtwo',
        description:
          'A legendary psychic-type Pokemon created through genetic manipulation.',
      };
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={simplePokemon} />
          </ThemeProvider>
        </Provider>
      );
      expect(
        screen.getAllByText(
          'A legendary psychic-type Pokemon created through genetic manipulation.'
        )
      ).toHaveLength(2); // Should appear as both label and value
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper button roles for interactive elements', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card
              item={mockListItemPokemon}
              onPokemonClick={mockOnPokemonClick}
            />
          </ThemeProvider>
        </Provider>
      );
      const button = screen.getByRole('button', { name: /view details/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveProperty('tagName', 'BUTTON');
    });

    it('has proper heading structure', () => {
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={mockSimpleDetailedPokemon} />
          </ThemeProvider>
        </Provider>
      );
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Pikachu');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card
              item={mockListItemPokemon}
              onPokemonClick={mockOnPokemonClick}
            />
          </ThemeProvider>
        </Provider>
      );
      const button = screen.getByRole('button', { name: /view details/i });
      await user.tab(); // checkbox
      await user.tab(); // button
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(mockOnPokemonClick).toHaveBeenCalledWith('charizard');
      });
    });

    it('renders avatar image if item.image is provided', () => {
      const pokemonWithImage = {
        ...mockSimpleDetailedPokemon,
        image: 'https://img.pokemontest.com/pikachu.png',
      };
      render(
        <Provider store={store}>
          <ThemeProvider>
            <Card item={pokemonWithImage} />
          </ThemeProvider>
        </Provider>
      );
      const img = screen.getByRole('img', { name: /pikachu/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        'src',
        'https://img.pokemontest.com/pikachu.png'
      );
    });
  });
});
