export const mockPokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [
    { 
      slot: 1,
      type: { 
        name: 'electric', 
        url: 'https://pokeapi.co/api/v2/type/13/' 
      } 
    }
  ],
  abilities: [
    { 
      ability: { 
        name: 'static', 
        url: 'https://pokeapi.co/api/v2/ability/9/' 
      },
      is_hidden: false,
      slot: 1
    }
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } }
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
      }
    }
  },
  species: {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
  }
};
