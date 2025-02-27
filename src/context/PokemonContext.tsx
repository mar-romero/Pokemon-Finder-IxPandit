import React, { createContext, useContext, ReactNode } from 'react';
import { usePokemon } from '@/hooks/usePokemon';
import type { HabitatName, Pokemon } from '@/types/pokemon';

interface PokemonContextType {
  pokemons: Pokemon[];
  loading: boolean;
  error?: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  queryParam: string;
  updateSuggestions: (query: string) => void; 
  suggestions: Pokemon[]; 
  handleSearch: (query: string) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
  handleHabitatFilter: (habitat: HabitatName | null) => Promise<void>;
  selectedHabitat: HabitatName | null;
  habitatPokemons: Pokemon[];
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    pokemons,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    queryParam,
    suggestions,
    updateSuggestions,
    handleSearch,
    handlePageChange,
    isClient,
    selectedHabitat,
    habitatPokemons,
    handleHabitatFilter,
  } = usePokemon();


  if (!isClient) {
    return null;
  }

  const value = {
    pokemons,
    loading,
    error: error || undefined,
    currentPage,
    totalPages,
    totalResults,
    updateSuggestions,
    queryParam,
    suggestions,
    handleHabitatFilter,
    habitatPokemons,
    selectedHabitat,
    handleSearch,
    handlePageChange,
  };
  
  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};