/**
 * ST CLOTHING — BROWSER CACHE SYSTEM
 * Caches database queries (products, categories, lookbooks, settings) and media/images
 * in the browser's native Cache Storage API & localStorage with stale-while-revalidate support.
 */

const DATA_CACHE_NAME = 'st-clothing-data-v1';
const IMAGE_CACHE_NAME = 'st-clothing-images-v1';

// Default time-to-live: 10 minutes for data queries
const DEFAULT_TTL_MS = 10 * 60 * 1000;

interface CachedPayload<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}

/**
 * Check if the browser Cache Storage API is supported and available.
 */
function isCacheApiSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Retrieve cached JSON data from browser cache.
 */
export async function getBrowserCache<T>(key: string): Promise<{ data: T; isStale: boolean } | null> {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try Cache Storage API first
    if (isCacheApiSupported()) {
      const cache = await caches.open(DATA_CACHE_NAME);
      const url = `https://stclothing.local/cache/${encodeURIComponent(key)}`;
      const response = await cache.match(url);

      if (response) {
        const payload: CachedPayload<T> = await response.json();
        const age = Date.now() - payload.cachedAt;
        const isStale = age > (payload.ttl || DEFAULT_TTL_MS);
        return { data: payload.data, isStale };
      }
    }

    // 2. Fallback to localStorage
    const localItem = localStorage.getItem(`st_cache_${key}`);
    if (localItem) {
      const payload: CachedPayload<T> = JSON.parse(localItem);
      const age = Date.now() - payload.cachedAt;
      const isStale = age > (payload.ttl || DEFAULT_TTL_MS);
      return { data: payload.data, isStale };
    }
  } catch (err) {
    console.warn('Browser cache read warning for key:', key, err);
  }

  return null;
}

/**
 * Save JSON data to browser cache with TTL.
 */
export async function setBrowserCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): Promise<void> {
  if (typeof window === 'undefined') return;

  const payload: CachedPayload<T> = {
    data,
    cachedAt: Date.now(),
    ttl: ttlMs,
  };

  try {
    // 1. Save to Cache Storage API
    if (isCacheApiSupported()) {
      const cache = await caches.open(DATA_CACHE_NAME);
      const url = `https://stclothing.local/cache/${encodeURIComponent(key)}`;
      const response = new Response(JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${Math.round(ttlMs / 1000)}`,
        },
      });
      await cache.put(url, response);
    }

    // 2. Also save to localStorage as backup
    try {
      localStorage.setItem(`st_cache_${key}`, JSON.stringify(payload));
    } catch {
      // localStorage quota might be full for large payloads, ignore
    }
  } catch (err) {
    console.warn('Browser cache write warning for key:', key, err);
  }
}

/**
 * Invalidate a specific cache key or all cached data.
 * Also broadcasts across browser tabs to synchronize client state.
 */
export async function invalidateBrowserCache(keyPattern?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    if (isCacheApiSupported()) {
      if (!keyPattern) {
        await caches.delete(DATA_CACHE_NAME);
      } else {
        const cache = await caches.open(DATA_CACHE_NAME);
        const keys = await cache.keys();
        for (const req of keys) {
          if (!keyPattern || req.url.includes(keyPattern)) {
            await cache.delete(req);
          }
        }
      }
    }

    // Clear matching localStorage items
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('st_cache_')) {
        if (!keyPattern || k.includes(keyPattern)) {
          keysToRemove.push(k);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // Broadcast invalidation across tabs
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('st_clothing_cache_channel');
        channel.postMessage({ type: 'CACHE_INVALIDATED', pattern: keyPattern, timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // ignore
    }

    // Dispatch DOM event for same-tab reactive listeners
    window.dispatchEvent(
      new CustomEvent('st-clothing-cache-invalidated', {
        detail: { keyPattern, timestamp: Date.now() },
      })
    );
  } catch (err) {
    console.warn('Browser cache invalidation error:', err);
  }
}

/**
 * Pre-cache an image URL directly into the browser's image Cache Storage.
 */
export async function cacheBrowserImage(imageUrl: string): Promise<void> {
  if (typeof window === 'undefined' || !imageUrl || !isCacheApiSupported()) return;

  try {
    const imageCache = await caches.open(IMAGE_CACHE_NAME);
    const existing = await imageCache.match(imageUrl);
    if (!existing) {
      // Fetch and put into cache storage
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (response && response.ok) {
        await imageCache.put(imageUrl, response);
      }
    }
  } catch {
    // Cross-origin without CORS or offline, fallback to regular browser image preloading
    try {
      const img = new window.Image();
      img.src = imageUrl;
    } catch {
      // ignore
    }
  }
}

/**
 * Pre-cache multiple image URLs into browser cache.
 */
export async function cacheBrowserImages(imageUrls: (string | undefined | null)[]): Promise<void> {
  if (typeof window === 'undefined') return;

  const validUrls = Array.from(new Set(imageUrls.filter(Boolean))) as string[];
  await Promise.allSettled(validUrls.map((url) => cacheBrowserImage(url)));
}
