'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getProducts, getLookbooks } from '@/lib/data/store';
import { cacheBrowserImages } from '@/lib/data/browser-cache';

/**
 * BrowserCacheProvider runs in the background on the client to automatically
 * warm database queries and cache high-res product & editorial lookbook images
 * into the browser Cache Storage API.
 * Also listens for database mutation broadcasts to trigger instant router.refresh().
 */
export function BrowserCacheProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const warmCache = useCallback(async () => {
    try {
      // Fetch categories, products, and lookbooks in parallel directly
      const [categories, products, lookbooks] = await Promise.all([
        getCategories(),
        getProducts({ publishedOnly: true }),
        getLookbooks({ publishedOnly: true }),
      ]);

      const imageUrls: string[] = [];

      // Collect category images
      categories.forEach((cat) => {
        if (cat.image_url) imageUrls.push(cat.image_url);
      });

      // Collect product images (primary & gallery)
      products.forEach((prod) => {
        prod.images?.forEach((img) => {
          if (img.image_url) imageUrls.push(img.image_url);
        });
      });

      // Collect lookbook images
      lookbooks.forEach((look) => {
        if (look.image_url) imageUrls.push(look.image_url);
      });

      // Deduplicate URLs
      const uniqueUrls = Array.from(new Set(imageUrls.filter(Boolean)));

      if (uniqueUrls.length > 0) {
        // Pre-cache all loaded images into browser Cache Storage
        await cacheBrowserImages(uniqueUrls);
      }
    } catch (err) {
      console.debug('Opportunistic browser cache warm complete:', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial background cache warm
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        warmCache();
      }, { timeout: 3000 });
    } else {
      setTimeout(warmCache, 1500);
    }

    // Handle cross-tab cache invalidation broadcast
    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('st_clothing_cache_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CACHE_INVALIDATED') {
            router.refresh();
            warmCache();
          }
        };
      }
    } catch {
      // ignore
    }

    // Handle same-window cache invalidation event
    const handleInvalidation = () => {
      router.refresh();
      warmCache();
    };

    window.addEventListener('st-clothing-cache-invalidated', handleInvalidation);

    return () => {
      window.removeEventListener('st-clothing-cache-invalidated', handleInvalidation);
      if (channel) {
        channel.close();
      }
    };
  }, [router, warmCache]);

  return <>{children}</>;
}
