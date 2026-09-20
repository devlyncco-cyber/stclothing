'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import { Product, Category } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/context/cart-context';
import { useStoreSettings } from '@/lib/context/store-settings-context';

interface RunwayMasonryProps {
  products: Product[];
  categories: Category[];
}

export function RunwayMasonry({ products, categories }: RunwayMasonryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem, openCart } = useCart();
  const { settings } = useStoreSettings();

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category?.slug === selectedCategory);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // Default to first variant or default properties
    const defaultVariant = product.variants?.[0];
    const size = defaultVariant?.size || 'M';
    const color = defaultVariant?.color || 'Noir';

    addItem(product, size, color, 1);

    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
      openCart();
    }, 600);
  };

  return (
    <section className="bg-linen-100 text-slate-ink py-28 px-4 sm:px-8 lg:px-16 w-full border-t border-linen-300 grain-overlay">
      {/* Editorial Header Section */}
      <div className="max-w-[1720px] mx-auto mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-linen-300 pb-12">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-editorial-terracotta inline-block" />
            <span className="text-[11px] uppercase tracking-ultra font-mono text-slate-muted">
              RUNWAY CAPSULE // ASYMMETRICAL SPREAD
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight font-normal leading-[0.95]">
            Curated <span className="italic font-light">Silhouettes</span> & Structural Form.
          </h2>
        </div>

        {/* Category Pill Navigation */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 uppercase tracking-spec border transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-slate-ink text-linen-100 border-slate-ink'
                : 'bg-transparent text-slate-muted border-linen-300 hover:border-slate-ink hover:text-slate-ink'
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 uppercase tracking-spec border transition-all duration-300 ${
                selectedCategory === cat.slug
                  ? 'bg-slate-ink text-linen-100 border-slate-ink'
                  : 'bg-transparent text-slate-muted border-linen-300 hover:border-slate-ink hover:text-slate-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetrical Multi-Speed Spread */}
      <div className="max-w-[1720px] mx-auto grid grid-cols-12 gap-y-20 sm:gap-x-10 lg:gap-x-16 items-start">
        {filteredProducts.map((product, index) => {
          // Asymmetrical layout logic: dynamic spans and vertical offsets
          const patternIndex = index % 5;
          let colSpan = 'col-span-12 sm:col-span-6 lg:col-span-4';
          let aspectClass = 'aspect-[4/5]';
          let offsetClass = '';

          if (patternIndex === 0) {
            colSpan = 'col-span-12 lg:col-span-7';
            aspectClass = 'aspect-[4/5] sm:aspect-[16/11]';
            offsetClass = 'lg:mb-12';
          } else if (patternIndex === 1) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-5';
            aspectClass = 'aspect-[3/4]';
            offsetClass = 'lg:translate-y-24';
          } else if (patternIndex === 2) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-4';
            aspectClass = 'aspect-[4/5]';
            offsetClass = 'lg:-translate-y-8';
          } else if (patternIndex === 3) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-4';
            aspectClass = 'aspect-[3/4]';
            offsetClass = 'lg:translate-y-12';
          } else if (patternIndex === 4) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-4';
            aspectClass = 'aspect-[4/5]';
            offsetClass = 'lg:-translate-y-16';
          }

          const primaryImage =
            product.images?.find((img) => img.is_primary)?.image_url ||
            product.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

          const secondaryImage =
            product.images && product.images.length > 1
              ? product.images.find((img) => !img.is_primary)?.image_url || product.images[1]?.image_url
              : primaryImage;

          const isAdded = addedId === product.id;

          return (
            <article
              key={product.id}
              className={`group relative flex flex-col ${colSpan} ${offsetClass} transition-all duration-700`}
            >
              {/* Product Frame */}
              <div className="relative w-full overflow-hidden bg-linen-200 border border-linen-300">
                <Link
                  href={`/product/${product.slug}`}
                  data-cursor="EXAMINE"
                  className={`relative w-full block overflow-hidden ${aspectClass}`}
                >
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-all duration-[1200ms] ease-luxury-out group-hover:scale-105"
                  />
                  {secondaryImage !== primaryImage && (
                    <Image
                      src={secondaryImage}
                      alt={`${product.name} editorial detail`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-luxury-out"
                    />
                  )}

                  {/* Top Badges & Edition Stamp */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    <span className="font-mono text-[9px] tracking-spec uppercase px-2.5 py-1 bg-linen-100/95 backdrop-blur-md text-slate-ink border border-linen-300">
                      PIECE #{String(index + 1).padStart(2, '0')}
                    </span>
                    {product.new_arrival && (
                      <span className="font-mono text-[9px] tracking-spec uppercase px-2.5 py-1 bg-obsidian-950 text-slate-chalk">
                        FRESH DROP
                      </span>
                    )}
                  </div>
                </Link>

                {/* Quick Add Floating Button */}
                {settings.ordersEnabled && settings.bagEnabled && (
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    data-cursor="ADD"
                    className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 font-mono text-[10px] uppercase tracking-spec transition-all duration-300 shadow-md ${
                      isAdded
                        ? 'bg-editorial-olive text-white'
                        : 'bg-linen-100/95 text-slate-ink hover:bg-slate-ink hover:text-linen-100 border border-linen-300'
                    }`}
                    aria-label={`Quick add ${product.name} to bag`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>BAG</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Garment Editorial Metadata */}
              <div className="pt-6 flex flex-col space-y-2">
                <div className="flex items-baseline justify-between border-b border-linen-300 pb-2">
                  <span className="text-[10px] font-mono tracking-ultra uppercase text-slate-muted">
                    {product.category?.name || 'STUDIO ARCHIVE'}
                  </span>
                  {settings.showPrices ? (
                    <span className="text-xs font-mono font-medium tracking-spec text-slate-ink">
                      {formatPrice(product.price)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-muted">
                      Price on Request
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-lg sm:text-2xl font-serif tracking-tight font-normal text-slate-ink group-hover:text-editorial-terracotta transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <ArrowUpRight className="w-4 h-4 text-slate-muted group-hover:text-slate-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-muted pt-1">
                  <span>100% ORGANIC HEAVYWEIGHT</span>
                  <span>·</span>
                  <span>SUSTAINABLY DYED</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
