'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { generateProductWhatsAppUrl } from '@/lib/config/brand';

interface HorizontalCollectionRailProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function HorizontalCollectionRail({
  products,
  title = 'Featured Collection',
  subtitle = 'CURATED EDITIONS / TEMA STUDIO',
}: HorizontalCollectionRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 bg-bone text-ink border-b border-stone-border select-none gallery-canvas">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Rail Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-8 border-b border-stone-border gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-stone font-semibold">
              {subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              data-cursor="VIEW ALL"
              className="font-mono text-xs uppercase tracking-ultra font-semibold text-ink hover:text-clay inline-flex items-center gap-2 group mr-4"
            >
              <span>VIEW FULL CATALOG</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-stone-border flex items-center justify-center text-ink hover:bg-sand transition-colors"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-stone-border flex items-center justify-center text-ink hover:bg-sand transition-colors"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Rail Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-6 pt-2 scroll-smooth"
        >
          {products.map((product, idx) => {
            const primaryImage =
              product.images?.find((img) => img.is_primary)?.image_url ||
              product.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

            const whatsAppUrl = generateProductWhatsAppUrl({
              productName: product.name,
              size: product.variants?.[0]?.size || 'M',
              quantity: 1,
              price: product.price,
              productSlug: product.slug,
            });

            return (
              <article
                key={product.id}
                className="flex-shrink-0 w-[280px] sm:w-[340px] group flex flex-col space-y-4"
              >
                {/* Image Frame with no border/shadow */}
                <Link
                  href={`/product/${product.slug}`}
                  data-cursor="EXAMINE"
                  className="relative aspect-[3/4] w-full overflow-hidden bg-sand block"
                >
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-cover object-center transition-transform duration-1000 ease-editorial group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[9px] tracking-spec uppercase px-2 py-0.5 bg-bone/90 text-ink border border-stone-border">
                      0{idx + 1} // TEMA
                    </span>
                  </div>
                </Link>

                {/* Info Container */}
                <div className="flex flex-col space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-[10px] text-stone uppercase tracking-ultra font-medium">
                      {product.category?.name || 'STUDIO PIECE'}
                    </span>
                    <span className="font-semibold text-ink">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="text-base sm:text-lg font-serif font-normal text-ink group-hover:text-clay transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
