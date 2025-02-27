/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon, PokemonListResponse, PokemonDetails,  Evolution, PokemonHabitat , AbilityResponse, Ability, EffectEntry, PokemonSpecies } from '@/types/pokemon';

const CONFIG = {
  BASE_URL: 'https://pokeapi.co/api/v2',
  DEFAULT_LIMIT: 100,
  CACHE_THRESHOLD: 500,
  REVALIDATE_TIME: 3600,
  IMAGE_BASE_URL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
};

interface ICache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  getAll(): T[];
  size(): number;
}

class Cache<T> implements ICache<T> {
  protected cache: Map<string, T>;

  constructor() {
    this.cache = new Map<string, T>();
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  getAll(): T[] {
    return Array.from(this.cache.values());
  }

  size(): number {
    return this.cache.size;
  }
}

class PokemonCache extends Cache<Pokemon> {
  private isInitialFetchInProgress: boolean;
  private fetchPromise: Promise<Pokemon[]> | null;

  constructor() {
    super();
    this.isInitialFetchInProgress = false;
    this.fetchPromise = null;
  }

  addPokemon(pokemon: Pokemon): void {
    this.cache.set(pokemon.name, pokemon);
  }

  isWellPopulated(): boolean {
    return this.size() > CONFIG.CACHE_THRESHOLD;
  }

  isFetchInProgress(): boolean {
    return this.isInitialFetchInProgress && this.fetchPromise !== null;
  }

  setFetchInProgress(status: boolean): void {
    this.isInitialFetchInProgress = status;
  }

  setFetchPromise(promise: Promise<Pokemon[]> | null): void {
    this.fetchPromise = promise;
  }

  getFetchPromise(): Promise<Pokemon[]> | null {
    return this.fetchPromise;
  }
}

interface IApiClient {
  get<T>(endpoint: string): Promise<T>;
}

class ApiClient implements IApiClient {
  private baseUrl: string;
  private revalidateTime: number;

  constructor(baseUrl: string, revalidateTime: number) {
    this.baseUrl = baseUrl;
    this.revalidateTime = revalidateTime;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, { next: { revalidate: this.revalidateTime } });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} for URL: ${url}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

class PokemonTransformer {
  static fromApiResult(result: { name: string; url: string }): Pokemon {
    const segments = result.url.split('/').filter(Boolean);
    const id = parseInt(segments[segments.length - 1], 10);
    
    return {
      id,
      name: result.name,
      image: `${CONFIG.IMAGE_BASE_URL}/${id}.png`
    };
  }

  static extractIdFromUrl(url: string): number {
    return parseInt(url.split('/').filter(Boolean).pop() || '0', 10);
  }
}

class PokemonService {
  private apiClient: IApiClient;
  private cache: PokemonCache;

  constructor(apiClient: IApiClient, cache: PokemonCache) {
    this.apiClient = apiClient;
    this.cache = cache;
  }

  async fetchPokemonDetails(url: string): Promise<PokemonDetails> {
    return this.apiClient.get<PokemonDetails>(url.replace(CONFIG.BASE_URL, ''));
  }

  async fetchPokemonPage(offset = 0, limit = CONFIG.DEFAULT_LIMIT): Promise<{
    error: string | undefined;
    pokemons: Pokemon[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    try {
      const data = await this.apiClient.get<PokemonListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
      
      const pokemons = data.results.map(result => {
        const pokemon = PokemonTransformer.fromApiResult(result);
        this.cache.addPokemon(pokemon);
        return pokemon;
      });
      
      return {
        pokemons,
        count: data.count,
        next: data.next,
        previous: data.previous,
        error: undefined
      };
    } catch (error) {
      return {
        pokemons: [],
        count: 0,
        next: null,
        previous: null,
        error: (error as Error).message
      };
    }
  }

  async fetchAllPokemon(): Promise<Pokemon[]> {
    if (this.cache.isFetchInProgress()) {
      const promise = this.cache.getFetchPromise();
      if (promise) return promise;
    }
    
    if (this.cache.isWellPopulated()) {
      return this.cache.getAll();
    }
    
    this.cache.setFetchInProgress(true);
    
    const promise = (async () => {
      try {
        const allPokemons: Pokemon[] = [];
        let url = `/pokemon?limit=${CONFIG.DEFAULT_LIMIT}`;
        
        while (url) {
          const data = await this.apiClient.get<PokemonListResponse>(url);
          
          const pokemons = data.results.map(result => {
            const pokemon = PokemonTransformer.fromApiResult(result);
            this.cache.addPokemon(pokemon); 
            return pokemon;
          });
          
          allPokemons.push(...pokemons);
          url = data.next ? data.next.replace(CONFIG.BASE_URL, '') : '';
        }
        
        return allPokemons;
      } finally {
        this.cache.setFetchInProgress(false);
        this.cache.setFetchPromise(null);
      }
    })();
    
    this.cache.setFetchPromise(promise);
    
    return promise;
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    if (!query) {
      const { pokemons } = await this.fetchPokemonPage(0, 20);
      return pokemons;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    if (this.cache.isWellPopulated()) {
      return this.cache.getAll()
        .filter(pokemon => pokemon.name.toLowerCase().includes(normalizedQuery));
    }
    
    const allPokemon = await this.fetchAllPokemon();
    return allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(normalizedQuery)
    );
  }


  async fetchPokemonAbilities(id: number): Promise<Ability[]> {
    try {
      if (typeof id === 'number') {
        const pokemonDetails = await this.fetchPokemonDetails(`/pokemon/${id}`);
        console.log('pokemonDetails', pokemonDetails);
        const abilitiesPromises = pokemonDetails.abilities.map(async (abilityInfo) => {
          const abilityName = (abilityInfo.ability.name);
          return this.fetchAbilityDetails(abilityName);
        });
        
        return Promise.all(abilitiesPromises);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async fetchAbilityDetails(name: string): Promise<Ability> {
    const abilityData = await this.apiClient.get<AbilityResponse>(`/ability/${name}`);
    const englishEffect = abilityData.effect_entries.find(
      (entry: EffectEntry) => entry.language.name === "en"
    );
    
    return {
      id: abilityData.id,
      name: abilityData.name,
      effect: englishEffect?.effect || "",
      short_effect: englishEffect?.short_effect || ""
    };
  }

  async fetchPokemonHabitat(habitat: string): Promise<Pokemon[]> {
    const data = await this.apiClient.get<PokemonHabitat>(`/pokemon-habitat/${habitat}`);
    
    return Promise.all(data.pokemon_species.map(async (species) => {
      const id = PokemonTransformer.extractIdFromUrl(species.url);
      return {
        id,
        name: species.name,
        image: `${CONFIG.IMAGE_BASE_URL}/${id}.png`
      };
    }));
  }

async fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  return this.apiClient.get<PokemonSpecies>(`/pokemon-species/${id}`);
}

async fetchPokemonEvolutions(pokemonId: number): Promise<Evolution> {
  try {
    let species;
    try {
      species = await this.fetchPokemonSpecies(pokemonId);
    } catch (error) {
      console.error(`No species data found for Pokemon ${pokemonId}, ${error}`);
      return {
        id: 0,
        chain: {
          species: { name: "", url: "" },
          evolves_to: []
        }
      };
    }
    
    if (!species.evolution_chain || !species.evolution_chain.url) {
      return {
        id: 0,
        chain: {
          species: { name: "", url: "" },
          evolves_to: []
        }
      };
    }
    
    const evolutionChainUrl = species.evolution_chain.url;
    const evolutionChainId = PokemonTransformer.extractIdFromUrl(evolutionChainUrl);
    
    return this.apiClient.get<Evolution>(`/evolution-chain/${evolutionChainId}`);
  } catch (error) {
    console.error(`Error fetching evolution chain for Pokemon ${pokemonId}:`, error);
    return {
      id: 0,
      chain: {
        species: { name: "", url: "" },
        evolves_to: []
      }
    };
  }
}

}



const apiClient = new ApiClient(CONFIG.BASE_URL, CONFIG.REVALIDATE_TIME);
const pokemonCache = new PokemonCache();
const pokemonService = new PokemonService(apiClient, pokemonCache);

export const fetchPokemonDetails = (url: string) => pokemonService.fetchPokemonDetails(url);
export const fetchPokemonPage = (offset?: number, limit?: number) => pokemonService.fetchPokemonPage(offset, limit);
export const fetchAllPokemon = () => pokemonService.fetchAllPokemon();
export const searchPokemon = (query: string) => pokemonService.searchPokemon(query);
export const fetchPokemonEvolutions = (id: number) => pokemonService.fetchPokemonEvolutions(id);
export const fetchPokemonAbilities = (id: number) => pokemonService.fetchPokemonAbilities(id);
export const fetchAbilityDetails = (name: string) => pokemonService.fetchAbilityDetails(name);
export const fetchPokemonHabitat = (habitat: string) => pokemonService.fetchPokemonHabitat(habitat);
export const fetchPokemonSpecies = (id: number) => pokemonService.fetchPokemonSpecies(id);

export { pokemonService };
