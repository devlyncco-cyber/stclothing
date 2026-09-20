'use client';

import { useEffect } from 'react';
import { getCategories, getProducts, getLookbooks } from '@/lib/data/store';
import { cacheBrowserImages } from '@/lib/data/browser-cache';

/**
 * BrowserCacheProvider runs in the background on the client to automatically
 * warm database queries and cache high-res product & editorial lookbook images
 * into the browser Cache Storage API.
 */
export function BrowserCacheProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client browser
    if (typeof window === 'undefined') return;

    const warmCache = async () => {
      try {
        // Fetch categories, products, and lookbooks in parallel
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
        // Cache warming is opportunistic; fail silently
        console.debug('Opportunistic browser cache warm complete:', err);
      }
    };

    // Use requestIdleCallback if available, else setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        warmCache();
      }, { timeout: 3000 });
    } else {
      setTimeout(warmCache, 1500);
    }
  }, []);

  return <>{children}</>;
}
