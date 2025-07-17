import type { CacheProvider } from './kv-cache';

export async function cachedJSON<T>(
  cache: CacheProvider,
  key: string,
  ttl: number,
  supplier: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await cache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Cache miss - fetch fresh data
  const fresh = await supplier();
  
  // Store in cache (fire & forget - don't wait for completion)
  cache.put(key, fresh, ttl).catch(error => {
    console.error('Cache put failed:', error);
  });
  
  return fresh;
}
