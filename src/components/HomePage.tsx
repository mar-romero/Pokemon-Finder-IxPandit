import React from 'react';
import { usePokemonContext } from '@/context/PokemonContext';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import PokemonList from '@/components/PokemonList';
import Pagination from '@/components/Pagination';
import ErrorMessage from '@/components/ErrorMessage';
import ResultsSummary from '@/components/ResultsSummary';


const HomePage: React.FC = () => {
  const {
    pokemons,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    queryParam,
    suggestions,
    selectedHabitat,
    handleSearch,
    handlePageChange,
    handleHabitatFilter,
    habitatPokemons
  } = usePokemonContext();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <PageHeader 
        title="Pokemon Finder" 
        subtitle="Search for any Pokemon by name" 
      />
      
      <SearchBar 
        onSearch={handleSearch}
        onHabitatFilter={handleHabitatFilter}
        isLoading={loading}
        initialQuery={queryParam}
        suggestions={suggestions}
        selectedHabitat={selectedHabitat}
      />
      
      <ErrorMessage message={error || null} />
      
      <div className="mt-6">
        <ResultsSummary 
          totalResults={selectedHabitat ? habitatPokemons.length : totalResults}
          searchQuery={queryParam}
          selectedHabitat={selectedHabitat}
        />
        
        <PokemonList 
          pokemons={pokemons} 
          isLoading={loading} 
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default HomePage;