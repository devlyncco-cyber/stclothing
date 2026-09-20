'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { useStoreSettings } from '@/lib/context/store-settings-context';

interface CuratedCapsuleProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function CuratedCapsule({
  products,
  title = 'FRESH DROPS & LIMITED RUNS',
  subtitle = 'AUTUMN CAPSULE / EDITION ARCHIVE',
}: CuratedCapsuleProps) {
  const { settings } = useStoreSettings();

  return (
    <section className="py-28 bg-linen-100 text-slate-ink border-b border-linen-300 grain-overlay">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Capsule Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-12 border-b border-linen-300 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-slate-muted">
              {subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            data-cursor="ALL DROPS"
            className="font-mono text-xs uppercase tracking-ultra font-semibold text-slate-ink hover:text-editorial-terracotta inline-flex items-center gap-2 group"
          >
            <span>VIEW ALL NEW DROPS</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4-Item Balanced Editorial Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => {
            const primaryImage =
              product.images?.find((img) => img.is_primary)?.image_url ||
              product.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

            return (
              <article key={product.id} className="group relative flex flex-col space-y-4">
                <Link
                  href={`/product/${product.slug}`}
                  data-cursor="VIEW"
                  className="relative aspect-[3/4] w-full overflow-hidden bg-linen-200 border border-linen-300 block"
                >
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-1000 ease-luxury-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[9px] tracking-spec uppercase px-2 py-0.5 bg-linen-100/90 text-slate-ink border border-linen-300">
                      DROP 0{idx + 1}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-[10px] text-slate-muted uppercase tracking-ultra">
                      {product.category?.name || 'STUDIO PIECE'}
                    </span>
                    {settings.showPrices ? (
                      <span className="font-semibold text-slate-ink">
                        {formatPrice(product.price)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-muted uppercase tracking-wider font-medium">
                        Price on Request
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="text-base font-serif font-normal text-slate-ink group-hover:text-editorial-terracotta transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>

                  <p className="text-[10px] font-mono text-slate-muted uppercase tracking-wider">
                    LIMITED TO 100 PIECES
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
