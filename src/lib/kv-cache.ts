export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  put<T = unknown>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

export function cloudflareKV(ns: any): CacheProvider {
  return {
    async get(key) {
      try {
        return await ns.get(key, { type: 'json' });
      } catch (error) {
        console.error('KV get error:', error);
        return null;
      }
    },
    async put(key, value, ttl) {
      try {
        await ns.put(key, JSON.stringify(value), { expirationTtl: ttl });
      } catch (error) {
        console.error('KV put error:', error);
      }
    },
  };
}

// Fallback for local development when KV isn't available
const memoryCache = new Map<string, { exp: number; val: any }>();
export const inMemoryCache: CacheProvider = {
  async get(key) {
    const hit = memoryCache.get(key);
    if (hit && hit.exp > Date.now()) {
      return hit.val;
    }
    if (hit) {
      memoryCache.delete(key); // Clean up expired entries
    }
    return null;
  },
  async put(key, value, ttl) {
    memoryCache.set(key, {
      val: value,
      exp: Date.now() + ttl * 1000,
    });
  },
};
