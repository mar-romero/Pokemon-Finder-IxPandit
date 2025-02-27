import React, { useState, useEffect, memo, useRef } from 'react';
import Image from 'next/image';
import { Pokemon, HabitatName } from '@/types/pokemon';
import { usePokemonContext } from '@/context/PokemonContext';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onHabitatFilter?: (habitat: HabitatName | null) => Promise<void>;
  isLoading?: boolean;
  initialQuery?: string;
  suggestions?: Pokemon[];
  selectedHabitat: HabitatName | null;
}

const habitats: HabitatName[] = [
  'cave', 'forest', 'grassland', 'mountain', 'rare',
  'rough-terrain', 'sea', 'urban', 'waters-edge'
];

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch = () => {},
  onHabitatFilter,
  isLoading = false,
  initialQuery = '',
  suggestions = []
}) => {
  const { updateSuggestions, selectedHabitat } = usePokemonContext();
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHabitatDropdown, setShowHabitatDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHabitatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearQuery = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchTriggered(true);
    onSearch(query);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (isSearchTriggered) {
      onSearch(query);
      setIsSearchTriggered(false);
    }
  }, [isSearchTriggered, query, onSearch]);
  
  const handleClearHabitat = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onHabitatFilter?.(null);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearchTriggered(false);
    updateSuggestions(value);
  };

  const handleSuggestionClick = (pokemonName: string) => {
    setQuery(pokemonName);
    onSearch(pokemonName);
    setShowSuggestions(false);
    
    updateSuggestions(pokemonName);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg shadow-sm focus:border-blue-500 focus:outline-none transition-colors pr-10 [&::-webkit-search-cancel-button]:hidden"
            placeholder="Enter Pokemon name (e.g. pika)"
            disabled={isLoading}
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {suggestions.map((pokemon) => (
                <button
                  key={pokemon.id}
                  type="button"
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(pokemon.name)}
                >
                  <div className="w-12 h-12 relative mr-3">
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="capitalize">{pokemon.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

               <button
          type="submit"
          className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isLoading}
        >
          Search
        </button>

        <div className="relative">
          <div
            onClick={() => setShowHabitatDropdown(!showHabitatDropdown)}
            className={`h-full px-4 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 flex items-center gap-2 cursor-pointer ${
              selectedHabitat 
                ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' 
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
            }`}
            role="button"
            tabIndex={0}
            aria-disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              {selectedHabitat ? (
                <>
                  <span className="capitalize">{selectedHabitat.replace('-', ' ')}</span>
                  <div
                    onClick={handleClearHabitat}

                    className="ml-2 hover:bg-green-600 rounded-full p-1 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    title="Clear filter"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </>
              ) : (
                'Filter'
              )}
            </div>
          </div>

          {showHabitatDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                {habitats.map((habitat) => (
                  <div
                    key={habitat}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left capitalize cursor-pointer"
                    onClick={() => {
                      onHabitatFilter?.(habitat);
                      setShowHabitatDropdown(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {habitat.replace('-', ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default memo(SearchBar);