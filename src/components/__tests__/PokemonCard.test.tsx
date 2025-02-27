/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonCard from '../PokemonCard';
import { fetchPokemonEvolutions, fetchPokemonAbilities } from '@/services/pokeApi';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert boolean props to strings for HTML attributes
    const imgProps = { ...props };
    delete imgProps.fill;
    delete imgProps.priority;
    
    return (
      <img 
        {...imgProps} 
        data-fill={props.fill ? "true" : undefined}
        data-priority={props.priority ? "true" : undefined}
      />
    );
  }
}));

jest.mock('@/services/pokeApi', () => ({
  fetchPokemonEvolutions: jest.fn(),
  fetchPokemonAbilities: jest.fn()
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});


describe('PokemonCard Component', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    image: '/pikachu.png',
    url: 'https://pokeapi.co/api/v2/pokemon/25/'
  };

  const mockEvolutions = {
    chain: {
      species: { name: 'pichu' },
      evolves_to: [
        {
          species: { name: 'pikachu' },
          evolves_to: [
            {
              species: { name: 'raichu' },
              evolves_to: []
            }
          ]
        }
      ]
    }
  };

  const mockAbilities = [
    { name: 'static', short_effect: 'Has a 30% chance of paralyzing attacking Pokémon on contact.' },
    { name: 'lightning-rod', short_effect: 'Draws in all Electric-type moves to boost Sp. Atk.' }
  ];

  const mockOnInvalidPokemon = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPokemonEvolutions as jest.Mock).mockResolvedValue(mockEvolutions);
    (fetchPokemonAbilities as jest.Mock).mockResolvedValue(mockAbilities);
  });

  test('renders correctly with pokemon data', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByAltText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  test('does not render when pokemon has no image', () => {
    const pokemonWithoutImage = { ...mockPokemon, image: '' };
    const { container } = render(<PokemonCard pokemon={pokemonWithoutImage} onInvalidPokemon={mockOnInvalidPokemon} />);
    
    expect(container.firstChild).toBeNull();
    expect(mockOnInvalidPokemon).not.toHaveBeenCalled(); 
  });

  test('flips card when clicked', async () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    expect(cardContainer).toBeInTheDocument();
    
    expect(cardContainer).not.toHaveClass('rotate-y-180');
    
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    expect(cardContainer).toHaveClass('rotate-y-180');
  });

  test('loads evolution and abilities data when card is flipped', async () => {
    (fetchPokemonEvolutions as jest.Mock).mockResolvedValue(mockEvolutions);
    (fetchPokemonAbilities as jest.Mock).mockResolvedValue(mockAbilities);
    
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    await waitFor(() => {
      expect(fetchPokemonEvolutions).toHaveBeenCalledWith(mockPokemon.id);
      expect(fetchPokemonAbilities).toHaveBeenCalledWith(mockPokemon.id);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Evolutions:')).toBeInTheDocument();
      expect(screen.getByText(/Base: pichu/)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Abilities:')).toBeInTheDocument();
      expect(screen.getByText('static')).toBeInTheDocument();
      expect(screen.getByText('lightning-rod')).toBeInTheDocument();
    });
  });

  test('handles error when fetching pokemon details', async () => {
    (fetchPokemonEvolutions as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    await waitFor(() => {
      expect(screen.getByText('This Pokemon has no available information')).toBeInTheDocument();
    });
  });

  test('calls onInvalidPokemon when API fails and callback is provided', async () => {
    (fetchPokemonEvolutions as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const pokemonWithImage = { ...mockPokemon };
    
    render(<PokemonCard pokemon={pokemonWithImage} onInvalidPokemon={mockOnInvalidPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    await waitFor(() => {
      expect(screen.getByText('This Pokemon has no available information')).toBeInTheDocument();
    });
    
    expect(mockOnInvalidPokemon).toHaveBeenCalledWith(pokemonWithImage.id);
  });

  test('displays no evolution data message when evolutions are null', async () => {
    (fetchPokemonEvolutions as jest.Mock).mockResolvedValue(null);
    
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    await waitFor(() => {
      expect(screen.getByText('No evolution data available')).toBeInTheDocument();
    });
  });

  test('displays no abilities data message when abilities are empty', async () => {
    (fetchPokemonAbilities as jest.Mock).mockResolvedValue([]);
    
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const cardContainer = screen.getByText('pikachu').closest('.cursor-pointer');
    if (cardContainer) {
      await userEvent.click(cardContainer);
    }
    
    await waitFor(() => {
      expect(screen.getByText('No abilities data available')).toBeInTheDocument();
    });
  });
});
