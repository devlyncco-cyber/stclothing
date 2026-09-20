import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { generateProductWhatsAppUrl } from '@/lib/config/brand';

interface LookbookStoryProps {
  calloutProducts: Product[];
}

export function LookbookStory({ calloutProducts }: LookbookStoryProps) {
  const displayProducts = calloutProducts.slice(0, 3);

  return (
    <section className="py-28 bg-bone text-ink border-b border-stone-border select-none gallery-canvas">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Story Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-16 border-b border-stone-border gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-stone font-semibold">
              LOOKBOOK SPREAD // TEMA EDITORIAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              Form, Drape &amp; <span className="italic font-light">Structure</span>
            </h2>
          </div>
          <Link
            href="/shop"
            data-cursor="LOOKBOOK"
            className="font-mono text-xs uppercase tracking-ultra font-semibold text-ink hover:text-clay inline-flex items-center gap-2 group"
          >
            <span>EXPLORE ALL PIECES</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 12-Column Gallery Spread: Large Campaign Anchor + 3 Product Callouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Large Campaign Image (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/5] w-full bg-sand border border-stone-border overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
                alt="ST Clothing Editorial Campaign in Tema"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-1000 ease-editorial group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-[9px] uppercase tracking-spec px-2.5 py-1 bg-bone/90 border border-stone-border text-ink">
                CAMPAIGN ESSAY · VOL. 04
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs text-stone-dark">
              <p className="text-sm font-serif italic text-ink">
                &ldquo;Every piece is drafted to balance the heat of Coastal Ghana with the structural weight of modern luxury essentials.&rdquo;
              </p>
              <div className="flex justify-between border-t border-stone-border pt-3 text-[10px] uppercase tracking-wider text-stone">
                <span>FABRIC: 280–450 GSM HEAVYWEIGHT</span>
                <span>ORIGIN: TEMA, GHANA</span>
              </div>
            </div>
          </div>

          {/* Right Product Callout List (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            <div className="border-b border-stone-border pb-4">
              <span className="font-mono text-xs uppercase tracking-ultra text-clay font-semibold">
                FEATURED IN THIS SPREAD
              </span>
            </div>

            <div className="space-y-6">
              {displayProducts.map((product, idx) => {
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
                  <div
                    key={product.id}
                    className="flex items-center gap-6 p-4 bg-sand border border-stone-border hover:border-ink transition-colors group"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative w-24 h-32 flex-shrink-0 bg-bone overflow-hidden block"
                    >
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-ultra text-stone">
                          PIECE 0{idx + 1} // {product.category?.name || 'GARMENT'}
                        </span>
                        <Link
                          href={`/product/${product.slug}`}
                          className="block text-base font-serif font-normal text-ink group-hover:text-clay transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="font-mono text-xs font-semibold text-ink pt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Link
                          href={`/product/${product.slug}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-ink text-bone font-mono text-[9px] uppercase tracking-spec font-semibold hover:bg-clay hover:text-white transition-colors"
                        >
                          <span>VIEW GARMENT</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
