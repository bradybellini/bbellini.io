import type { APIRoute } from 'astro';
import { validateOrigin, createForbiddenResponse } from '../../lib/security';

const TOMORROW = 'https://api.tomorrow.io/v4/weather/realtime';

/*
  GET /api/weather?zip=20500
  → { temperature: 72.4 }
*/
export const GET: APIRoute = async ({ request, url, locals }) => {
  // Validate origin first
  if (!validateOrigin(request)) {
    return createForbiddenResponse();
  }

  // Access environment variables from Cloudflare Worker runtime
  const workerEnv = (locals as any).runtime?.env;
  const API_KEY = workerEnv?.TOMORROW_API_KEY;

  if (!API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const zip = url.searchParams.get('zip') ?? '20500';
  const location = `${zip} US`;                     // Tomorrow.io accepts this format

  const res = await fetch(
    `${TOMORROW}?location=${encodeURIComponent(location)}&units=imperial&apikey=${API_KEY}`
  );

  if (!res.ok) return new Response('Failed', { status: 500 });

  const data = await res.json();
  const temp = data?.data?.values?.temperature;

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
