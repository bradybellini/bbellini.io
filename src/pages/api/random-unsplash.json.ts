// api/random-unsplash.json.ts
// API endpoint for fetching random Unsplash photos

import type { APIRoute } from 'astro';
import { getRandomPhoto } from '../../services/unsplash';
import { validateOrigin, createForbiddenResponse } from '../../lib/security';

export const GET: APIRoute = async ({ request, locals }) => {
  // Validate origin first
  if (!validateOrigin(request)) {
    return createForbiddenResponse();
  }

  // Access the KV binding and env vars directly from Worker runtime
  const workerEnv = (locals as any).runtime?.env;
  
  try {
    const env = {
      UNSPLASH_CACHE: workerEnv?.UNSPLASH_CACHE,
      UNSPLASH_ACCESS_KEY: workerEnv?.UNSPLASH_ACCESS_KEY
    };
    
    console.log('API route env check:', {
      hasRuntimeEnv: !!workerEnv,
      hasUnsplashCache: !!workerEnv?.UNSPLASH_CACHE,
      hasUnsplashKey: !!workerEnv?.UNSPLASH_ACCESS_KEY,
      keyLength: workerEnv?.UNSPLASH_ACCESS_KEY?.length || 0,
      envKeys: workerEnv ? Object.keys(workerEnv) : []
    });
    
    const photo = await getRandomPhoto(env);

    return new Response(
      JSON.stringify({
        src: `${photo.urls.regular}&auto=format&fit=crop&w=800&q=80`,
        alt: photo.alt_description || 'Random photo from Unsplash',
        author: photo.user.name,
        username: photo.user.username,
        profile: photo.user.links.html,
        download: `${photo.links.download_location}?client_id=${workerEnv?.UNSPLASH_ACCESS_KEY}`,
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
