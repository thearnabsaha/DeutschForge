'use client';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * High-performance client-side fetcher with in-memory caching and stale-while-revalidate.
 * @param url The API URL to fetch
 * @param ttlMs Time-to-live in milliseconds (default: 30 seconds)
 */
export async function cachedFetch<T>(
  url: string,
  ttlMs = 30000,
  options?: RequestInit
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(url);

  // If cache is fresh, return immediately without network call
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data as T;
  }

  // Fetch fresh data
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // If error but we have stale cache, fallback to stale cache gracefully
      if (cached) return cached.data as T;
      throw new Error(`Fetch failed for ${url} with status ${res.status}`);
    }
    const data = (await res.json()) as T;
    memoryCache.set(url, { data, timestamp: now });
    return data;
  } catch (err) {
    if (cached) return cached.data as T;
    throw err;
  }
}

/**
 * Invalidate a specific cache entry or all entries when data is modified
 */
export function invalidateCache(urlPattern?: string) {
  if (!urlPattern) {
    memoryCache.clear();
    return;
  }
  Array.from(memoryCache.keys()).forEach((key) => {
    if (key.includes(urlPattern)) {
      memoryCache.delete(key);
    }
  });
}
