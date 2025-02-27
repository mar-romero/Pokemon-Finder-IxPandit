import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pokemon, Evolution, Ability } from '@/types/pokemon';
import { fetchPokemonEvolutions, fetchPokemonAbilities } from '@/services/pokeApi';

interface PokemonCardProps {
  pokemon: Pokemon;
  onInvalidPokemon?: (id: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onInvalidPokemon }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [evolutions, setEvolutions] = useState<Evolution | null>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadPokemonDetails = async () => {
      if (isFlipped && !evolutions && !abilities.length && !hasError) {
        setIsLoading(true);
        try {
          const evolutionData = await fetchPokemonEvolutions(pokemon.id);
          setEvolutions(evolutionData);
  
          const abilityData = await fetchPokemonAbilities(pokemon.id);
          setAbilities(abilityData);
        } catch (error) {
          console.error('Error fetching pokemon details:', error);
          setHasError(true);
          if (!pokemon.image || onInvalidPokemon) {
            onInvalidPokemon?.(pokemon.id);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    loadPokemonDetails();
  }, [isFlipped, pokemon.id, evolutions, abilities.length, hasError, pokemon.image, onInvalidPokemon]);

  if (!pokemon.image) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div
        className={`cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="relative bg-[#f4f4f4] rounded-lg shadow-lg p-4 backface-hidden">
          <div className="relative w-full aspect-square">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              className="object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
          <h3 className="text-lg font-semibold capitalize text-center mt-2">
            {pokemon.name}
          </h3>
          <div className="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[#f4f4f4]  rounded-lg shadow-lg p-4 rotate-y-180 backface-hidden overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : hasError ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-500">This Pokemon has no available information</span>
            </div>
          ) : (
            <>
              <h4 className="font-semibold mb-2">Evolutions:</h4>
              <div className="evolution-chain">
                {evolutions && evolutions.chain && evolutions.chain.species && evolutions.chain.species.name ? (
                  <div className="text-sm">
                    <p>Base: {evolutions.chain.species.name}</p>
                    {evolutions.chain.evolves_to && evolutions.chain.evolves_to.map((evo, index) => (
                      <p key={index} className="ml-4">
                        → {evo.species.name}
                        {evo.evolves_to && evo.evolves_to.map((finalEvo, idx) => (
                          <span key={idx} className="ml-4">
                            → {finalEvo.species.name}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No evolution data available</p>
                )}
              </div>
              
              <h4 className="font-semibold mt-4 mb-2">Abilities:</h4>
              <div className="abilities-list">
                {abilities.length > 0 ? (
                  <ul className="text-sm">
                    {abilities.map((ability, index) => (
                      <li key={index} className="mb-1">
                        <span className="capitalize font-medium">{ability.name}</span>
                        <p className="text-gray-600 text-xs mt-1">{ability.short_effect}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No abilities data available</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;

