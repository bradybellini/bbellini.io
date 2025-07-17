export interface CacheProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  put<T = unknown>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

export function cloudflareKV(ns: any): CacheProvider {
  console.log('Creating cloudflareKV provider with namespace:', !!ns);
  
  return {
    async get(key) {
      try {
        console.log(`KV get attempt for key: ${key}, namespace available: ${!!ns}`);
        if (!ns) {
          console.log('No KV namespace available, returning null');
          return null;
        }
        
        const result = await ns.get(key, { type: 'json' });
        console.log(`KV get result for ${key}:`, result ? 'HIT' : 'MISS');
        return result;
      } catch (error) {
        console.error('KV get error:', error);
        return null;
      }
    },
    async put(key, value, ttl) {
      try {
        console.log(`KV put attempt for key: ${key}, TTL: ${ttl}, namespace available: ${!!ns}`);
        if (!ns) {
          console.log('No KV namespace available, skipping put');
          return;
        }
        
        await ns.put(key, JSON.stringify(value), { expirationTtl: ttl });
        console.log(`KV put successful for key: ${key}`);
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
