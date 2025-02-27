import React from 'react';
import { render, screen } from '@testing-library/react';
import PokemonList from '../PokemonList';
import type { Pokemon } from '@/types/pokemon';

jest.mock('../PokemonCard', () => {
  return function MockPokemonCard({ pokemon }: { pokemon: Pokemon }) {
    return <div data-testid="pokemon-card">{pokemon.name}</div>;
  };
});

describe('PokemonList Component', () => {
  const mockPokemons: Pokemon[] = [
    { id: 1, name: 'bulbasaur', image: '/bulbasaur.png', types: ['grass'] },
    { id: 2, name: 'charmander', image: '/charmander.png', types: ['fire'] },
  ];

  test('renders correctly with pokemon data', () => {
    render(<PokemonList pokemons={mockPokemons} />);
    
    expect(screen.getByTestId('pokemon-grid')).toBeInTheDocument();
    
    const pokemonCards = screen.getAllByTestId('pokemon-card');
    expect(pokemonCards).toHaveLength(2);
    
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  test('renders loading skeleton when isLoading is true', () => {
    render(<PokemonList pokemons={[]} isLoading={true} />);
    
    const skeletonItems = screen.getAllByRole('generic').filter(
      element => element.className.includes('animate-pulse')
    );
    expect(skeletonItems).toHaveLength(8);
  });

  test('renders no results message when pokemon array is empty', () => {
    render(<PokemonList pokemons={[]} />);
    
    expect(screen.getByText('No Pokemon found. Try a different search.')).toBeInTheDocument();
    
    expect(screen.queryByTestId('pokemon-grid')).not.toBeInTheDocument();
  });

  test('does not render skeleton or no results message when has pokemons', () => {
    render(<PokemonList pokemons={mockPokemons} />);
    
    const skeletonItems = screen.queryAllByRole('generic').filter(
      element => element?.className?.includes('animate-pulse')
    );
    expect(skeletonItems).toHaveLength(0);
    
    expect(screen.queryByText('No Pokemon found. Try a different search.')).not.toBeInTheDocument();
  });

  test('renders correct number of columns based on viewport', () => {
    render(<PokemonList pokemons={mockPokemons} />);
    
    const grid = screen.getByTestId('pokemon-grid');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'gap-6'
    );
  });
});
