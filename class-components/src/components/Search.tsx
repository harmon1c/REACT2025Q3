import React from 'react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear?: () => void;
}

export function Search(props: SearchProps): React.JSX.Element {
  const { value, onChange, onSearch, onClear } = props;
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onChange(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = (): void => {
    onChange('');
    onClear?.();
  };

  return (
    <div className="mb-6 w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Search Pokemon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Enter a Pokemon name to search for detailed information
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 w-full">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter Pokemon name (e.g., Pikachu)..."
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm hover:shadow-md hover:border-gray-300
              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 dark:focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap text-sm
              dark:from-blue-700 dark:to-indigo-800 dark:hover:from-blue-800 dark:hover:to-indigo-900"
          >
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap text-sm
              dark:from-gray-400 dark:to-gray-500 dark:hover:from-gray-300 dark:hover:to-gray-400"
          >
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
