import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/types/database';

interface CategoryTilesProps {
  categories: Category[];
}

export function CategoryTiles({ categories }: CategoryTilesProps) {
  return (
    <section className="py-24 bg-bone text-ink border-b border-stone-border select-none gallery-canvas">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-12 border-b border-stone-border gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-stone font-semibold">
              CURATED ARCHIVE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs uppercase tracking-ultra font-semibold text-ink hover:text-clay inline-flex items-center gap-2 group"
          >
            <span>VIEW ALL CATEGORIES</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Category Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              data-cursor="EXPLORE"
              className="group relative aspect-[3/4] overflow-hidden bg-sand border border-stone-border flex flex-col justify-end p-5 transition-all duration-500"
            >
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-editorial"
                />
              )}
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-ultra text-sand">
                  INDEX 0{idx + 1}
                </span>
                <div className="flex items-center justify-between text-bone">
                  <h3 className="font-serif text-lg sm:text-xl font-normal tracking-wide">
                    {cat.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
