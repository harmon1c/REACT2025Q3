import React, { useState, useEffect } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  initialQuery?: string;
}

export function Search({
  onSearch,
  onClear,
  initialQuery = '',
}: SearchProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedQuery = searchTerm.trim();
    onSearch(trimmedQuery);
  };

  const handleClear = (): void => {
    setSearchTerm('');
    onClear?.();
  };

  return (
    <div className="mb-12 w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Search Pokemon
        </h2>
        <p className="text-gray-600">
          Enter a Pokemon name to search for detailed information
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-4 w-full">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter Pokemon name (e.g., Pikachu)..."
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400 shadow-lg hover:shadow-xl hover:border-gray-300"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-2 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <svg
              className="w-4 h-4 inline mr-2"
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
            className="px-2 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <svg
              className="w-4 h-4 inline mr-2"
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
