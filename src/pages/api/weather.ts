import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateOrigin, createForbiddenResponse } from '../../lib/security';

const TOMORROW = 'https://api.tomorrow.io/v4/weather/realtime';

export const prerender = false;

interface TomorrowWeatherResponse {
  data?: {
    values?: {
      temperature?: number;
    };
  };
}

/*
  GET /api/weather?zip=20500
  → { temperature: 72.4 }
*/
export const GET: APIRoute = async ({ request, url }) => {
  // Validate origin first
  if (!validateOrigin(request)) {
    return createForbiddenResponse();
  }

  const API_KEY = env.TOMORROW_API_KEY;

  if (!API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const zip = url.searchParams.get('zip') ?? '20500';
  const location = `${zip} US`;                     // Tomorrow.io accepts this format

  const res = await fetch(
    `${TOMORROW}?location=${encodeURIComponent(location)}&units=imperial&apikey=${API_KEY}`
  );

  if (!res.ok) return new Response('Failed', { status: 500 });

  const data = await res.json() as TomorrowWeatherResponse;
  const temp = data?.data?.values?.temperature;

  if (typeof temp !== 'number') {
    return new Response('Failed', { status: 500 });
  }

  return new Response(
    JSON.stringify({ temperature: temp }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // cache for 10 min to keep free-tier usage down
        'Cache-Control': 'public, max-age=600'
      }
    }
  );
};
