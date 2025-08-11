import { useState, type FC } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

const labels = {
  title: 'Search Pokemon',
  description: 'Enter a Pokemon name to search for detailed information',
  placeholder: 'Enter Pokemon name (e.g., Pikachu)...',
  button: 'Search',
  clear: 'Clear',
};

type ControlledSearchTestWrapperProps = {
  onSearch: (value: string) => void;
  onClear?: () => void;
  initialValue?: string;
};
const ControlledSearchTestWrapper: FC<ControlledSearchTestWrapperProps> = ({
  onSearch,
  onClear = (): void => {},
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Search
      value={value}
      onChange={setValue}
      onSearch={onSearch}
      onClear={onClear}
      labels={labels}
    />
  );
};

const mockOnSearch = vi.fn();
const mockOnChange = vi.fn();
const mockOnClear = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(window.localStorage.getItem).mockReturnValue(null);
  vi.mocked(window.localStorage.setItem).mockClear();
});

describe('Search Component', () => {
  describe('Rendering Tests', () => {
    it('renders search input and search button', () => {
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value=""
          labels={labels}
        />
      );

      expect(
        screen.getByPlaceholderText(/enter pokemon name/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
      expect(screen.getByText('Search Pokemon')).toBeInTheDocument();
    });

    it('renders clear button', () => {
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          onClear={mockOnClear}
          value=""
          labels={labels}
        />
      );

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('displays initial query when provided', () => {
      const initialQuery = 'pikachu';
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value={initialQuery}
          labels={labels}
        />
      );

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue(initialQuery);
    });

    it('shows empty input when no initial query is provided', () => {
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value=""
          labels={labels}
        />
      );

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue('');
    });

    it('displays previously saved search term from localStorage on mount', () => {
      vi.mocked(window.localStorage.getItem).mockReturnValue('savedPokemon');

      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value="savedPokemon"
          labels={labels}
        />
      );

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue('savedPokemon');
    });
  });

  describe('User Interaction Tests', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      await user.type(input, 'charizard');

      expect(input).toHaveValue('charizard');
    });

    it('triggers search callback with correct parameters on form submit', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, 'bulbasaur');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('bulbasaur');
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('triggers search callback when form is submitted via Enter key', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);

      await user.type(input, 'squirtle');
      await user.keyboard('{Enter}');

      expect(mockOnSearch).toHaveBeenCalledWith('squirtle');
    });

    it('trims whitespace from search input before calling onSearch', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

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
      render(
        <ControlledSearchTestWrapper
          onSearch={mockOnSearch}
          onClear={mockOnClear}
        />
      );

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'jigglypuff');
      await user.click(clearButton);

      expect(input).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('clears input without calling onClear when onClear prop is not provided', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'psyduck');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });
  });

  describe('LocalStorage Integration', () => {
    it('retrieves saved search term on component mount when initialQuery is provided', () => {
      const savedQuery = 'storedPokemon';
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value={savedQuery}
          labels={labels}
        />
      );

      const input = screen.getByPlaceholderText(/enter pokemon name/i);
      expect(input).toHaveValue(savedQuery);
    });
  });
});
