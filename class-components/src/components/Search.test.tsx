import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

const mockOnSearch = vi.fn();
const mockOnClear = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(window.localStorage.getItem).mockReturnValue(null);
  vi.mocked(window.localStorage.setItem).mockClear();
});

describe('Search Component', () => {
  describe('Rendering Tests', () => {
    it('renders search input and search button', () => {
      render(<Search onSearch={mockOnSearch} />);

      expect(
        screen.getByPlaceholderText(/enter pokemon name/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
      expect(screen.getByText('Search Pokemon')).toBeInTheDocument();
    });

    it('renders clear button', () => {
      render(<Search onSearch={mockOnSearch} onClear={mockOnClear} />);

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('displays initial query when provided', () => {
      const initialQuery = 'pikachu';
      render(<Search onSearch={mockOnSearch} initialQuery={initialQuery} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue(initialQuery);
    });

    it('shows empty input when no initial query is provided', () => {
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue('');
    });

    it('displays previously saved search term from localStorage on mount', () => {
      vi.mocked(window.localStorage.getItem).mockReturnValue('savedPokemon');

      render(<Search onSearch={mockOnSearch} initialQuery="savedPokemon" />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue('savedPokemon');
    });
  });

  describe('User Interaction Tests', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      await user.type(input, 'charizard');

      expect(input).toHaveValue('charizard');
    });

    it('triggers search callback with correct parameters on form submit', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, 'bulbasaur');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('bulbasaur');
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('triggers search callback when form is submitted via Enter key', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);

      await user.type(input, 'squirtle');
      await user.keyboard('{Enter}');

      expect(mockOnSearch).toHaveBeenCalledWith('squirtle');
    });

    it('trims whitespace from search input before calling onSearch', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, '  eevee  ');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('eevee');
    });
  });

  describe('Clear Functionality Tests', () => {
    it('clears input and calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} onClear={mockOnClear} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'jigglypuff');
      await user.click(clearButton);

      expect(input).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('clears input without calling onClear when onClear prop is not provided', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'psyduck');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });
  });

  describe('LocalStorage Integration', () => {
    it('saves search term to localStorage when search is performed', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, 'mewtwo');
      await user.click(searchButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'searchTerm',
        'mewtwo'
      );
    });

    it('saves trimmed search term to localStorage', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, '  mew  ');
      await user.click(searchButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'searchTerm',
        'mew'
      );
    });

    it('saves empty string to localStorage when empty search is performed', async () => {
      const user = userEvent.setup();
      render(<Search onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'searchTerm',
        ''
      );
    });

    it('retrieves saved search term on component mount when initialQuery is provided', () => {
      const savedQuery = 'storedPokemon';
      render(<Search onSearch={mockOnSearch} initialQuery={savedQuery} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue(savedQuery);
    });
  });
});
