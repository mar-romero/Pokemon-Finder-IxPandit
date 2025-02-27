import React from 'react';
import { render, screen } from '@testing-library/react';
import { PokemonProvider, usePokemonContext } from '../PokemonContext';
import { usePokemon } from '@/hooks/usePokemon';
import { act } from 'react';

jest.mock('@/hooks/usePokemon', () => ({
  usePokemon: jest.fn()
}));

const TestComponent = () => {
  const { pokemons, loading } = usePokemonContext();
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading...' : 'Not loading'}</div>
      <div data-testid="pokemon-count">{pokemons.length}</div>
      <ul>
        {pokemons.map(pokemon => (
          <li key={pokemon.id} data-testid="pokemon-item">{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

describe('PokemonContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (usePokemon as jest.Mock).mockReturnValue({
      pokemons: [
        { id: 1, name: 'bulbasaur', image: 'url1' },
        { id: 2, name: 'ivysaur', image: 'url2' }
      ],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 10,
      totalResults: 1118,
      queryParam: '',
      suggestions: [],
      updateSuggestions: jest.fn(),
      handleSearch: jest.fn(),
      handlePageChange: jest.fn(),
      isClient: true,
      selectedHabitat: null,
      habitatPokemons: [],
      handleHabitatFilter: jest.fn()
    });
  });

  it('should provide pokemon data to children components', async () => {
    await act(async () => {
      render(
        <PokemonProvider>
          <TestComponent />
        </PokemonProvider>
      );
    });
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    expect(screen.getByTestId('pokemon-count')).toHaveTextContent('2');
    expect(screen.getAllByTestId('pokemon-item')).toHaveLength(2);
    expect(screen.getAllByTestId('pokemon-item')[0]).toHaveTextContent('bulbasaur');
    expect(screen.getAllByTestId('pokemon-item')[1]).toHaveTextContent('ivysaur');
  });

  it('should not render children when isClient is false', async () => {
    (usePokemon as jest.Mock).mockReturnValue({
      isClient: false
    });
    
    let container: HTMLElement = document.createElement('div');
    await act(async () => {
      const renderResult = render(
        <PokemonProvider>
          <TestComponent />
        </PokemonProvider>
      );
      container = renderResult.container;
    });
    
    expect(container.firstChild).toBeNull();
  });
  
  

  it('should throw error when context is used outside provider', () => {
    const consoleError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePokemonContext must be used within a PokemonProvider');
    
    console.error = consoleError;
  });

  it('should handle loading state correctly', async () => {
    (usePokemon as jest.Mock).mockReturnValue({
      pokemons: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      queryParam: '',
      suggestions: [],
      updateSuggestions: jest.fn(),
      handleSearch: jest.fn(),
      handlePageChange: jest.fn(),
      isClient: true,
      selectedHabitat: null,
      habitatPokemons: [],
      handleHabitatFilter: jest.fn()
    });
    
    await act(async () => {
      render(
        <PokemonProvider>
          <TestComponent />
        </PokemonProvider>
      );
    });
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('pokemon-count')).toHaveTextContent('0');
  });
});
