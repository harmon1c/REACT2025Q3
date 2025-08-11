import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PokemonDetailsList, PokemonDetailsGrid } from './PokemonDetails';

const mockDetails = [
  { label: 'Name', value: 'Pikachu' },
  { label: 'ID', value: 'Pokemon #25' },
  { label: 'Height', value: '0.4m' },
  { label: 'Weight', value: '6.0kg' },
  { label: 'Base Experience', value: '112' },
  { label: 'Type', value: 'Electric' },
  { label: 'Abilities', value: 'Static, Lightning Rod' },
];

describe('PokemonDetailsList Component', () => {
  it('renders pokemon details correctly', () => {
    render(<PokemonDetailsList details={mockDetails} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Pokemon #25')).toBeInTheDocument();
  });

  it('displays height and weight information', () => {
    render(<PokemonDetailsList details={mockDetails} />);

    expect(screen.getByText('0.4m')).toBeInTheDocument();
    expect(screen.getByText('6.0kg')).toBeInTheDocument();
  });

  it('displays base experience', () => {
    render(<PokemonDetailsList details={mockDetails} />);

    expect(screen.getByText('112')).toBeInTheDocument();
  });

  it('shows pokemon types', () => {
    render(<PokemonDetailsList details={mockDetails} />);

    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('displays pokemon abilities', () => {
    render(<PokemonDetailsList details={mockDetails} />);

    expect(screen.getByText('Static, Lightning Rod')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<PokemonDetailsList details={mockDetails} />);

    const detailsContainer = container.querySelector('.space-y-3');
    expect(detailsContainer).toBeInTheDocument();
  });
});

describe('PokemonDetailsGrid Component', () => {
  it('renders pokemon details in grid layout', () => {
    render(<PokemonDetailsGrid details={mockDetails} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('applies grid styling classes', () => {
    const { container } = render(<PokemonDetailsGrid details={mockDetails} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles multiple details correctly', () => {
    const multipleDetails = [
      { label: 'Name', value: 'Bulbasaur' },
      { label: 'Type', value: 'Grass/Poison' },
    ];

    render(<PokemonDetailsGrid details={multipleDetails} />);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Grass/Poison')).toBeInTheDocument();
  });

  it('handles single detail correctly', () => {
    const singleDetail = [{ label: 'Ability', value: 'Static' }];

    render(<PokemonDetailsGrid details={singleDetail} />);

    expect(screen.getByText('Static')).toBeInTheDocument();
  });
});
