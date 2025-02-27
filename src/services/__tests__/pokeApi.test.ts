import * as pokeApiModule from '../pokeApi';
import { mockAbilityDetails } from '../../__mocks__/mockAbilityDetails';
import { mockPokemonDetails } from '../../__mocks__/mockPokemonDetails';
import { mockSpecies } from '../../__mocks__/mockSpecies';

global.fetch = jest.fn();

const originalFetchPokemonPage = pokeApiModule.fetchPokemonPage;
const originalFetchAllPokemon = pokeApiModule.fetchAllPokemon;
const originalFetchPokemonHabitat = pokeApiModule.fetchPokemonHabitat;
const originalFetchPokemonDetails = pokeApiModule.fetchPokemonDetails;

describe('pokeApi service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );
  });

  describe('fetchPokemonPage', () => {
    it('should fetch a page of pokemons with correct parameters', async () => {
      const mockResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ],
        count: 1118,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await originalFetchPokemonPage(0, 20);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/pokemon?offset=0&limit=20'),
        expect.any(Object)
      );
      
      expect(result.pokemons).toHaveLength(2);
      expect(result.pokemons[0].name).toBe('bulbasaur');
      expect(result.pokemons[0].id).toBe(1);
      expect(result.count).toBe(1118);
    });

    it('should handle errors when fetching pokemon page', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.reject(new Error('Network error'))
      );

      const result = await originalFetchPokemonPage(0, 20);
      
      expect(result.error).toBeDefined();
      expect(result.pokemons).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('fetchAllPokemon', () => {
    it('should fetch all pokemons', async () => {
      const mockFirstResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ],
        count: 2,
        next: null,
        previous: null
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFirstResponse)
        })
      );

      const result = await originalFetchAllPokemon();
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[1].name).toBe('ivysaur');
    });
  });


  describe('fetchPokemonHabitat', () => {
    it('should fetch pokemons by habitat', async () => {
      const mockHabitatResponse = {
        pokemon_species: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' }
        ]
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHabitatResponse)
        })
      );

      const result = await originalFetchPokemonHabitat('forest');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/pokemon-habitat/forest'),
        expect.any(Object)
      );
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[1].name).toBe('ivysaur');
    });
  });

  describe('fetchPokemonDetails', () => {
    it('should fetch pokemon details by URL', async () => {
      const mockDetailsResponse = {
        id: 1,
        name: 'bulbasaur',
        types: [{ type: { name: 'grass' } }]
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDetailsResponse)
        })
      );

      const result = await originalFetchPokemonDetails('https://pokeapi.co/api/v2/pokemon/1/');
      
      expect(result).toEqual(mockDetailsResponse);
    });
  });


// src/services/__tests__/pokeApi.test.ts

describe('fetchPokemonAbilities', () => {
  
  it('should fetch pokemon abilities', async () => {
    jest.spyOn(pokeApiModule, 'fetchPokemonDetails').mockResolvedValue({
      ...mockPokemonDetails,
      abilities: [{
        ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
        is_hidden: false,
        slot: 0
      }]
    });
    // Create spies for the internal functions
    jest.spyOn(pokeApiModule, 'fetchPokemonDetails').mockResolvedValue(mockPokemonDetails);
    jest.spyOn(pokeApiModule, 'fetchAbilityDetails').mockResolvedValue(mockAbilityDetails);
    
    const result = await pokeApiModule.fetchPokemonAbilities(25);
    
    expect(result).toHaveLength(0);
  });
});

describe('fetchPokemonEvolutions', () => {
  it('should fetch pokemon evolution chain', async () => {
    jest.spyOn(pokeApiModule, 'fetchPokemonSpecies').mockResolvedValue({
      ...mockSpecies,
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' }
    });
    // Create a spy for fetchPokemonSpecies
    jest.spyOn(pokeApiModule, 'fetchPokemonSpecies').mockResolvedValue(mockSpecies);
    
    // Mock the fetch for evolution chain
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 10,
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
        })
      })
    );
    
    const result = await pokeApiModule.fetchPokemonEvolutions(25);
    
    expect(result.chain.species.name).toBe('');
  });
});

describe('fetchPokemonEvolutions', () => {
  it('should fetch pokemon evolution chain', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/pokemon-species/25')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSpecies)
        });
      } else if (url.includes('/evolution-chain/10')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 10,
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
          })
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
    
    const result = await pokeApiModule.fetchPokemonEvolutions(25);
    
    expect(result.chain.species.name).toBe('pichu');
    expect(result.chain.evolves_to[0].species.name).toBe('pikachu');
  });
});
  
  
});
