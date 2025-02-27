import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '20';
    const offset = url.searchParams.get('offset') || '0';
    
    return HttpResponse.json({
      count: 1154,
      next: `https://pokeapi.co/api/v2/pokemon?offset=${Number(offset) + Number(limit)}&limit=${limit}`,
      previous: Number(offset) > 0 ? `https://pokeapi.co/api/v2/pokemon?offset=${Math.max(0, Number(offset) - Number(limit))}&limit=${limit}` : null,
      results: Array.from({ length: Number(limit) }, (_, i) => ({
        name: `pokemon-${Number(offset) + i + 1}`,
        url: `https://pokeapi.co/api/v2/pokemon/${Number(offset) + i + 1}/`,
      })),
    })
  }),
]