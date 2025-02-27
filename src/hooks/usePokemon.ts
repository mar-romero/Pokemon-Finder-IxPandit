import { useState, useEffect, useCallback,useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { HabitatName, Pokemon } from '@/types/pokemon';
import { searchPokemon, fetchPokemonPage, fetchAllPokemon, fetchPokemonHabitat } from '@/services/pokeApi';

export const ITEMS_PER_PAGE = 20;

export const usePokemon = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalResults, setTotalResults] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [selectedHabitat, setSelectedHabitat] = useState<HabitatName | null>(null);
  const [habitatPokemons, setHabitatPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);

  


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const initializePokemonData = async () => {
      try {
        const allPokemon = await fetchAllPokemon();
        setAllPokemons(allPokemon);
      } catch (error) {
        console.error("Error loading initial Pokemon data:", error);
      }
    };

    if (isClient) {
      initializePokemonData();
    }
  }, [isClient]);

  const updateUrlParams = useCallback((query: string, page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!isClient) return;
  
    const loadPageData = async () => {
      setLoading(true);
      try {
        if (selectedHabitat) {
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;
          setPokemons(filteredPokemons.slice(start, end)); 
          setTotalResults(filteredPokemons.length);
        } else if (!queryParam) {
          const { pokemons: initialPokemons, count } = await fetchPokemonPage(
            (currentPage - 1) * ITEMS_PER_PAGE,
            ITEMS_PER_PAGE
          );
          setPokemons(initialPokemons);
          setTotalResults(count);
        } else {
          const results = await searchPokemon(queryParam);
          setPokemons(results);
          setTotalResults(results.length);
          setSuggestions(results.slice(0, 5));
        }
      } catch (error) {
        setError(`Error al cargar datos. Intenta nuevamente. ${error}`);
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };
  
    loadPageData();
  }, [isClient, queryParam, currentPage, selectedHabitat, habitatPokemons]);
  
  

  const updateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    
    const filteredSuggestions = selectedHabitat 
    ? habitatPokemons.filter(p => p.name.toLowerCase().includes(normalizedQuery))
    : allPokemons.filter(p => p.name.toLowerCase().includes(normalizedQuery));
  
  setSuggestions(filteredSuggestions.slice(0, 5));
}, [allPokemons, habitatPokemons, selectedHabitat]);


  const handleSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      let results: Pokemon[];
      
      if (searchQuery === '') {
        if (selectedHabitat) {
          results = habitatPokemons;
          setFilteredPokemons(habitatPokemons);
        } else {
          const { pokemons: initial, count } = await fetchPokemonPage(0, ITEMS_PER_PAGE);
          results = initial;
          setTotalResults(count);
        }
      }  else if (selectedHabitat) {
        results = habitatPokemons.filter(pokemon => 
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPokemons(results);
      } else {
        results = await searchPokemon(searchQuery);
      }
      
      setPokemons(results.slice(0, ITEMS_PER_PAGE));
      setTotalResults(results.length);
      updateUrlParams(searchQuery, 1);
      setCurrentPage(1);
      setSuggestions(results.slice(0, 5));
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching pokemons';
      setError(errorMessage);
      console.error('Error fetching pokemons:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedHabitat, habitatPokemons, updateUrlParams, ITEMS_PER_PAGE]);


  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    if (!selectedHabitat && !queryParam) {
      setLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const { pokemons: newPokemons, count } = await fetchPokemonPage(offset, ITEMS_PER_PAGE);
        setPokemons(newPokemons);
        setTotalResults(count);
      } catch (error) {
        setError('Error cargando datos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedHabitat, queryParam, ITEMS_PER_PAGE]);

  const totalPages = useMemo(() => {
    const total = selectedHabitat ? filteredPokemons.length : totalResults;
    return Math.ceil(total / ITEMS_PER_PAGE);
  }, [selectedHabitat, filteredPokemons.length, totalResults, ITEMS_PER_PAGE]);



const handleHabitatFilter = useCallback(async (habitat: HabitatName | null) => {
    setLoading(true);
    setError(null);
    try {
      if (habitat) {
        const results = await fetchPokemonHabitat(habitat);
        setHabitatPokemons(results);
        setFilteredPokemons(results);
        setPokemons(results.slice(0, ITEMS_PER_PAGE));
        setTotalResults(results.length);
        setSelectedHabitat(habitat);
      } else {
        setHabitatPokemons([]);
        setFilteredPokemons([]);
        setSelectedHabitat(null);
        const { pokemons: initial, count } = await fetchPokemonPage(0, ITEMS_PER_PAGE);
        setPokemons(initial);
        setTotalResults(count);
      }
      setCurrentPage(1);
    } catch (error) {
      setError('Error fetching habitat Pokémon');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [ITEMS_PER_PAGE]);

  return {
    pokemons,
    totalPages,
    totalResults: selectedHabitat ? filteredPokemons.length : totalResults,
    loading,
    error,
    currentPage,
    isClient,
    queryParam,
    selectedHabitat,
    updateUrlParams,
    setSelectedHabitat,
    updateSuggestions,
    handleSearch,
    habitatPokemons,
    setHabitatPokemons,
    handlePageChange,
    handleHabitatFilter,
    suggestions,
    setSuggestions,
    setLoading,
    setError,
    setPokemons,
    setTotalResults,
    setCurrentPage,
    ITEMS_PER_PAGE,
  };

};
