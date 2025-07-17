// api/random-unsplash.json.ts
// API endpoint for fetching random Unsplash photos

import type { APIRoute } from 'astro';
import { getRandomPhoto } from '../../services/unsplash';
import { validateOrigin, createForbiddenResponse } from '../../lib/security';

const ACCESS_KEY = import.meta.env.UNSPLASH_ACCESS_KEY || '';

export const GET: APIRoute = async ({ request, locals }) => {
  // Validate origin first
  if (!validateOrigin(request)) {
    return createForbiddenResponse();
  }

  try {
    // Access the KV binding directly from locals.runtime.env
    const kvEnv = (locals as any).runtime?.env;
    const env = {
      UNSPLASH_CACHE: kvEnv?.UNSPLASH_CACHE,
      UNSPLASH_ACCESS_KEY: ACCESS_KEY
    };
    
    console.log('API route env check:', {
      hasRuntimeEnv: !!(locals as any).runtime?.env,
      hasUnsplashCache: !!kvEnv?.UNSPLASH_CACHE,
      envKeys: kvEnv ? Object.keys(kvEnv) : []
    });
    
    const photo = await getRandomPhoto(env);

    return new Response(
      JSON.stringify({
        src: `${photo.urls.regular}&auto=format&fit=crop&w=800&q=80`,
        alt: photo.alt_description || 'Random photo from Unsplash',
        author: photo.user.name,
        username: photo.user.username,
        profile: photo.user.links.html,
        download: `${photo.links.download_location}?client_id=${ACCESS_KEY}`,
        photoUrl: photo.links.html,
      }),
      { 
        headers: { 
          'Content-Type': 'application/json', 
          'Cache-Control': 'no-store' 
        } 
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Unsplash photo' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
