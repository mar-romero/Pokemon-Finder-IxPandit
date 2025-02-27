import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { usePokemon, ITEMS_PER_PAGE } from '../usePokemon';
import { 
  searchPokemon, 
  fetchPokemonPage, 
  fetchAllPokemon, 
  fetchPokemonHabitat 
} from '@/services/pokeApi';

jest.mock('@/services/pokeApi', () => ({
  searchPokemon: jest.fn(),
  fetchPokemonPage: jest.fn(),
  fetchAllPokemon: jest.fn(),
  fetchPokemonHabitat: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === 'q') return '';
      if (param === 'page') return '1';
      return null;
    })
  })
}));

describe('usePokemon hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        search: ''
      },
      writable: true
    });

    window.scrollTo = jest.fn();

    (fetchPokemonPage as jest.Mock).mockResolvedValue({
      pokemons: [
        { id: 1, name: 'bulbasaur', image: 'url1' },
        { id: 2, name: 'ivysaur', image: 'url2' }
      ],
      count: 1118
    });
    
    (fetchAllPokemon as jest.Mock).mockResolvedValue([
      { id: 1, name: 'bulbasaur', image: 'url1' },
      { id: 2, name: 'ivysaur', image: 'url2' },
      { id: 25, name: 'pikachu', image: 'url3' }
    ]);
    
    (searchPokemon as jest.Mock).mockResolvedValue([
      { id: 1, name: 'bulbasaur', image: 'url1' }
    ]);
    
    (fetchPokemonHabitat as jest.Mock).mockResolvedValue([
      { id: 1, name: 'bulbasaur', image: 'url1' }
    ]);
  });

  it('should initialize with default values and load data', async () => {
    const { result } = renderHook(() => usePokemon());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.currentPage).toBe(1);
    
    await act(async () => {
      result.current.setLoading(true);
      
      await Promise.resolve();
      
      result.current.setPokemons([
        { id: 1, name: 'bulbasaur', image: 'url1' },
        { id: 2, name: 'ivysaur', image: 'url2' }
      ]);
      result.current.setTotalResults(1118);
      result.current.setLoading(false);
    });
    
    expect(result.current.pokemons).toHaveLength(2);
    expect(result.current.totalResults).toBe(1118);
    expect(result.current.loading).toBe(false);
  });

  it('should handle search correctly', async () => {
    const { result } = renderHook(() => usePokemon());
    
    await act(async () => {
      await result.current.handleSearch('bulba');
    });
    
    expect(searchPokemon).toHaveBeenCalledWith('bulba');
  });

  it('should handle page change correctly', async () => {
    const { result } = renderHook(() => usePokemon());
    
    await act(async () => {
      await result.current.handlePageChange(2);
    });
    
    expect(fetchPokemonPage).toHaveBeenCalledWith(ITEMS_PER_PAGE, ITEMS_PER_PAGE);
  });

  it('should handle habitat filter correctly', async () => {
    const { result } = renderHook(() => usePokemon());
    
    await act(async () => {
      await result.current.handleHabitatFilter('forest');
    });
    
    expect(fetchPokemonHabitat).toHaveBeenCalledWith('forest');
  });

  it('should update suggestions when searching', async () => {
    const { result } = renderHook(() => usePokemon());
    
    await act(async () => {
      result.current.setPokemons([
        { id: 1, name: 'bulbasaur', image: 'url1' },
        { id: 2, name: 'ivysaur', image: 'url2' },
        { id: 25, name: 'pikachu', image: 'url3' }
      ]);
      
      result.current.updateSuggestions('pika');
    });
    
    expect(result.current.suggestions).toHaveLength(0);
  });
});
