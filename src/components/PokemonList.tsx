import React, { memo } from 'react';
import type { Pokemon } from '@/types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemons: Pokemon[];
  isLoading?: boolean;
}


const PokemonListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg animate-pulse">
          <div className="w-full pt-[100%] bg-gray-200"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NoResultsMessage: React.FC = () => (
  <div className="text-center py-10">
    <p className="text-lg text-gray-600">No Pokemon found. Try a different search.</p>
  </div>
);

const PokemonList: React.FC<PokemonListProps> = ({ pokemons, isLoading = false }) => {
  if (isLoading) {
    return <PokemonListSkeleton />;
  }
  
  if (pokemons.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="pokemon-grid">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default memo(PokemonList);