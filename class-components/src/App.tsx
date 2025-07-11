import React, { Component } from 'react';
import { Search } from './components/Search';
import { Results, type ResultItem } from './components/Results';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTester } from './components/ErrorTester';
import { Header } from './components/Header';
import { Main } from './components/Main';

interface AppState {
  results: ResultItem[];
  isLoading: boolean;
  error: string | null;
  selectedPokemon: ResultItem | null;
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      results: [],
      isLoading: false,
      error: null,
      selectedPokemon: null,
    };
  }

  public override componentDidMount(): void {
    const savedSearchTerm = localStorage.getItem('searchTerm');
    if (savedSearchTerm) {
      this.handleSearch(savedSearchTerm);
    } else {
      this.handleSearch('');
    }
  }

  private handleSearch = async (query: string): Promise<void> => {
    this.setState({ isLoading: true, error: null, selectedPokemon: null });

    try {
      const url = query
        ? `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
        : 'https://pokeapi.co/api/v2/pokemon?limit=20';

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Pokemon "${query}" not found. Please check the name and try again.`
          );
        } else if (response.status >= 500) {
          throw new Error(
            `Server error (${response.status}). Please try again later.`
          );
        } else if (response.status >= 400) {
          throw new Error(
            `Request error (${response.status}). Please check your input and try again.`
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      let results: ResultItem[];
      if (query) {
        // pokemon search
        results = [
          {
            id: data.id,
            name: data.name,
            description: `Type: ${data.types.map((type: { type: { name: string } }) => type.type.name).join(', ')} | Height: ${data.height}dm | Weight: ${data.weight}kg | Base Experience: ${data.base_experience}`,
          },
        ];
      } else {
        // pokemon list
        results = data.results.map(
          (pokemon: { name: string; url: string }, index: number) => ({
            id: index + 1,
            name: pokemon.name,
            description: `Pokemon #${index + 1} - Click to view details`,
          })
        );
      }

      this.setState({ results, isLoading: false });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
        results: [],
      });
    }
  };

  private handleSearchSync = (query: string): void => {
    void this.handleSearch(query);
  };

  private handleClear = (): void => {
    this.setState({
      results: [],
      isLoading: false,
      error: null,
      selectedPokemon: null,
    });
    localStorage.removeItem('searchTerm');
  };

  private handlePokemonClick = async (pokemonName: string): Promise<void> => {
    if (this.state.selectedPokemon?.name === pokemonName) {
      this.setState({ selectedPokemon: null });
      return;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Pokemon "${pokemonName}" not found. Please try a different Pokemon.`
          );
        } else if (response.status >= 500) {
          throw new Error(
            `Server error (${response.status}). Please try again later.`
          );
        } else if (response.status >= 400) {
          throw new Error(
            `Request error (${response.status}). Please check your input and try again.`
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const data = await response.json();

      const detailedPokemon: ResultItem = {
        id: data.id,
        name: data.name,
        description: `Type: ${data.types
          .map((type: { type: { name: string } }) => type.type.name)
          .join(
            ', '
          )} | Height: ${data.height}dm | Weight: ${data.weight}kg | Base Experience: ${data.base_experience} | Abilities: ${data.abilities
          .map((ability: { ability: { name: string } }) => ability.ability.name)
          .join(', ')}`,
      };

      this.setState({
        selectedPokemon: detailedPokemon,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  public override render(): React.JSX.Element {
    const { results, isLoading, error, selectedPokemon } = this.state;
    const savedSearchTerm = localStorage.getItem('searchTerm') || '';

    return (
      <ErrorBoundary>
        <Main>
          <Header title="Pokemon Search" />

          <Search
            onSearch={this.handleSearchSync}
            onClear={this.handleClear}
            initialQuery={savedSearchTerm}
          />

          <Results
            results={results}
            isLoading={isLoading}
            error={error}
            onPokemonClick={this.handlePokemonClick}
            selectedPokemon={selectedPokemon}
          />

          <ErrorTester />
        </Main>
      </ErrorBoundary>
    );
  }
}

export default App;
