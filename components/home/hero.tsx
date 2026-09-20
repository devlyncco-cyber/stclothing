import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { Product } from '@/types/database';

interface HomeHeroProps {
  heroImage?: string;
  heroCaption?: string;
  heroProduct?: Product;
}

export function HomeHero({ heroImage, heroCaption, heroProduct }: HomeHeroProps) {
  const displayImage =
    heroImage ||
    heroProduct?.images?.find((img) => img.is_primary)?.image_url ||
    heroProduct?.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85';

  const captionText =
    heroCaption ||
    (heroProduct ? `ATELIER ARCHIVE // ${heroProduct.name}` : 'CAMPAIGN SPREAD 01 // TEMA ARCHIVE');

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between bg-bone text-ink pt-28 pb-12 px-4 sm:px-8 lg:px-16 border-b border-stone-border select-none gallery-canvas">
      {/* Top Micro-Label Strip */}
      <div className="flex items-center justify-between border-b border-stone-border/80 pb-4 font-mono text-[10px] sm:text-xs uppercase tracking-ultra text-stone">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-clay inline-block" />
          <span>NEW COLLECTION · TEMA, GHANA</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>ATELIER HOURS: 9AM – 7PM GMT</span>
          <span>·</span>
          <span>WHATSAPP ORDERS ACTIVE</span>
        </div>
      </div>

      {/* Main Hero Spread (Asymmetrical Gallery Layout) */}
      <div className="my-auto py-8 sm:py-12 max-w-[1720px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        {/* Left Headline & Story */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-block">
            <span className="font-mono text-[10px] uppercase tracking-monumental text-clay bg-sand px-3 py-1 border border-stone-border font-semibold">
              ST CLOTHING ATELIER
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tightest leading-[0.92] text-ink">
            {BRAND_CONFIG.tagline.split('.')[0]}.
            <br />
            <span className="italic font-light text-stone-dark">
              {BRAND_CONFIG.tagline.split('.')[1] || 'Worn everywhere.'}
            </span>
          </h1>

          <p className="text-sm sm:text-base font-sans font-light text-stone-dark max-w-lg leading-relaxed pt-2">
            Contemporary minimalist silhouettes engineered in Tema, Ghana. We balance heavyweight organic cottons, tailored drapes, and quiet Ghanaian craftsmanship.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-xs">
            <Link
              href="/shop"
              data-cursor="SHOP"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-bone font-semibold uppercase tracking-ultra hover:bg-clay hover:text-white transition-all duration-300 shadow-sm"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/lookbook"
              data-cursor="LOOKBOOK"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-sand border border-stone-border text-ink font-semibold uppercase tracking-ultra hover:border-ink transition-all duration-300"
            >
              <span>VIEW LOOKBOOK</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Campaign Imagery Frame */}
        <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] w-full bg-sand border border-stone-border overflow-hidden group">
          <Image
            src={displayImage}
            alt="ST Clothing Lookbook Campaign in Tema, Ghana"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_30%] transition-transform duration-1000 ease-editorial group-hover:scale-105"
          />

          {/* Floating Spec Caption */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3 bg-bone/90 backdrop-blur-md border border-stone-border font-mono text-[9px] uppercase tracking-ultra text-stone-dark">
            <span className="truncate max-w-[240px] sm:max-w-none">{captionText}</span>
            <span className="text-ink font-semibold flex-shrink-0">GH₵ CURATED EDITIONS</span>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & Marquee Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-stone-border/80 pt-4 font-mono text-[10px] uppercase tracking-spec text-stone">
        <span>LOC: TEMA, GREATER ACCRA, GHANA</span>
        <span>ORDER DESK: {BRAND_CONFIG.contacts.primaryPhoneDisplay}</span>
      </div>
    </section>
  );
}
