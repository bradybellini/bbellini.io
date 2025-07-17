import type { CacheProvider } from './kv-cache';

export async function cachedJSON<T>(
  cache: CacheProvider,
  key: string,
  ttl: number,
  supplier: () => Promise<T>
): Promise<T> {
  console.log(`cachedJSON called for key: ${key}`);
  
  // Try to get from cache first
  const cached = await cache.get<T>(key);
  if (cached) {
    console.log(`Cache HIT for key: ${key}`);
    return cached;
  }

  console.log(`Cache MISS for key: ${key}, fetching fresh data`);
  
  // Cache miss - fetch fresh data
  const fresh = await supplier();
  
  // Store in cache (fire & forget - don't wait for completion)
  cache.put(key, fresh, ttl).catch(error => {
    console.error('Cache put failed:', error);
  });
  
  return fresh;
}
