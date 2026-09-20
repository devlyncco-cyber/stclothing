import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/data/store';
import { ShopContent } from './shop-content';

export const metadata = {
  title: 'Collection & Archive | ST Clothing Ghana',
  description: 'Browse the full ST Clothing line from Tema, Ghana: heavyweight tees, luxury hoodies, tailored trousers, and minimalist outerwear.',
};

export const revalidate = 30;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-bone pt-28 pb-24 font-sans select-none gallery-canvas">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Page Header */}
        <div className="mb-12 border-b border-stone-border pb-8">
          <span className="font-mono text-[10px] uppercase tracking-ultra text-stone font-semibold block mb-2">
            CATALOG ARCHIVE // TEMA, GHANA
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-ink">
            The Collection
          </h1>
          <p className="text-sm font-sans font-light text-stone-dark max-w-xl mt-3 leading-relaxed">
            Minimalist silhouettes engineered with uncompromising attention to fabric drape, tactile finish, and contemporary Ghanaian structure.
          </p>
        </div>

        {/* Dynamic Client Shop Content with Filters, Sorting, Search, Grid */}
        <Suspense fallback={<ShopSkeleton />}>
          <ShopContent initialProducts={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 bg-sand rounded w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-sand" />
            <div className="h-3 bg-sand w-1/2" />
            <div className="h-4 bg-sand w-3/4" />
            <div className="h-3 bg-sand w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
