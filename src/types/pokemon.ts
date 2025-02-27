
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types?: string[];
    evolutions?: {
    name: string;
    image: string;
  }[];
  moves?: {
    name: string;
    power: number | null;
    accuracy: number | null;
  }[];
}

export interface Ability {
  id: number;
  name: string;
  effect: string;
  short_effect: string;
}

export interface AbilityLanguage {
  name: string;
  url: string;
}

export interface EffectEntry {
  effect: string;
  short_effect: string;
  language: AbilityLanguage;
}

export interface AbilityResponse {
  id: number;
  name: string;
  effect_entries: EffectEntry[];
}

export interface Ability {
  id: number;
  name: string;
  effect: string;
  short_effect: string;
  power?: number | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
}

export interface PokemonSearchState {
  query: string;
  results: Pokemon[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalResults: number;
}

export interface Evolution {
  id: number;
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
      evolves_to: Array<{
        species: {
          name: string;
          url: string;
        };
      }>;
    }>;
  };
}

export interface PokemonHabitat {
  id: number;
  name: string;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    }
  }[];
  pokemon_species: {
    name: string;
    url: string;
  }[];
}

export type HabitatName = 'cave' | 'forest' | 'grassland' | 'mountain' | 'rare' | 'rough-terrain' | 'sea' | 'urban' | 'waters-edge';