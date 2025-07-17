// services/unsplash.ts
// Server-side Unsplash API client with KV caching

import { cachedJSON } from '../lib/cached-fetch';
import { cloudflareKV, inMemoryCache } from '../lib/kv-cache';

// Access key will be passed from API routes
const getAccessKey = (env?: any) => {
  return env?.UNSPLASH_ACCESS_KEY || '';
};
const TTL_SECONDS = 120; // 2 minutes
const CACHE_KEY = 'unsplash:random';

type UnsplashPhoto = {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download_location: string;
  };
};

export async function getRandomPhoto(env?: any): Promise<UnsplashPhoto> {
  const cache = env?.UNSPLASH_CACHE
    ? cloudflareKV(env.UNSPLASH_CACHE)
    : inMemoryCache;

  return cachedJSON(cache, CACHE_KEY, TTL_SECONDS, async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?topics=experimental`,
      {
        headers: {
          'Authorization': `Client-ID ${getAccessKey(env)}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return response.json();
  });
}
