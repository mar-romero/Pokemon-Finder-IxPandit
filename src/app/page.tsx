'use client';

import React, { Suspense } from 'react';
import { PokemonProvider } from '@/context/PokemonContext';
import HomePage from '@/components/HomePage';

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <PokemonProvider>
        <HomePage />
      </PokemonProvider>
    </Suspense>
  );
}
