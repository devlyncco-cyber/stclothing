import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getLookbooks } from '@/lib/data/store';
import { HomeHero } from '@/components/home/hero';
import { MarqueeStrip } from '@/components/home/marquee-strip';
import { HorizontalCollectionRail } from '@/components/home/horizontal-collection-rail';
import { LookbookStory } from '@/components/home/lookbook-story';
import { CategoryTiles } from '@/components/home/category-tiles';
import { InstagramFeed } from '@/components/home/instagram-feed';
import { WhatsAppCtaBanner } from '@/components/home/whatsapp-cta-banner';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { ArrowUpRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { AdinkraMark } from '@/components/ui/adinkra-mark';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [allProducts, categories, lookbooks] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getCategories(),
    getLookbooks({ publishedOnly: true }),
  ]);

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 8);
  const displayFeatured = featuredProducts.length >= 4 ? featuredProducts : allProducts.slice(0, 6);
  const lookbookCallouts = allProducts.slice(0, 3);
  const primaryLookbook = lookbooks.length > 0 ? lookbooks[0] : null;

  return (
    <div className="flex flex-col w-full font-sans bg-bone text-ink overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <HomeHero
        heroProduct={displayFeatured[0]}
        heroImage={primaryLookbook?.image_url || displayFeatured[0]?.images?.[0]?.image_url}
        heroCaption={primaryLookbook ? `${primaryLookbook.vol} // ${primaryLookbook.title}` : undefined}
      />

      {/* 2. MARQUEE STRIP */}
      <MarqueeStrip />

      {/* 3. FEATURED COLLECTION HORIZONTAL SCROLL RAIL */}
      {displayFeatured.length > 0 && (
        <HorizontalCollectionRail
          products={displayFeatured}
          title="Featured Collection"
          subtitle="CURATED ESSENTIALS // TEMA ATELIER"
        />
      )}

      {/* 4. LOOKBOOK STORY SECTION (Campaign + 3 Product Callouts) */}
      <LookbookStory lookbook={primaryLookbook} calloutProducts={lookbookCallouts} />

      {/* 5. SHOP BY CATEGORY TILES */}
      {categories.length > 0 && <CategoryTiles categories={categories} />}

      {/* 6. BRAND STORY TEASER */}
      <section className="py-24 bg-bone border-b border-stone-border select-none gallery-canvas">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-ultra text-stone bg-sand px-3 py-1 border border-stone-border">
              <AdinkraMark size={14} className="text-clay" />
              <span>THE TEMA MANIFESTO</span>
            </div>

            <blockquote className="text-3xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] text-ink tracking-tight">
              &ldquo;Made for Tema.{' '}
              <span className="italic font-normal text-clay">Worn everywhere</span>.&rdquo;
            </blockquote>

            <p className="text-sm sm:text-base font-sans font-light text-stone-dark max-w-2xl mx-auto leading-relaxed">
              Every garment from ST Clothing is precision drafted from sustainably sourced heavyweight cottons and structured drapes. We eliminate extraneous logos to let fabric weight and enduring craftsmanship speak for themselves.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors group"
              >
                <span>Read the Complete Atelier Story</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM FEED SECTION */}
      <InstagramFeed products={allProducts.slice(0, 4)} lookbooks={lookbooks} />

      {/* 8. WHATSAPP ORDER / CONTACT CTA BANNER */}
      <WhatsAppCtaBanner />

      {/* 9. GHANAIAN LOGISTICS & TRUST STANDARDS */}
      <section className="py-20 bg-bone border-b border-stone-border select-none font-mono">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col space-y-2 p-6 bg-sand border border-stone-border">
              <div className="flex items-center justify-between text-ink">
                <span className="text-[10px] text-stone uppercase tracking-ultra">01 / LOGISTICS</span>
                <Truck className="w-4 h-4 text-clay" />
              </div>
              <h3 className="text-xs uppercase tracking-spec font-bold text-ink pt-2">
                TEMA &amp; GREATER ACCRA DISPATCH
              </h3>
              <p className="text-xs text-stone-dark font-sans font-light leading-relaxed">
                Same-day or next-day courier delivery across Tema, Spintex, East Legon, and Accra Central.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-6 bg-sand border border-stone-border">
              <div className="flex items-center justify-between text-ink">
                <span className="text-[10px] text-stone uppercase tracking-ultra">02 / PAYMENT</span>
                <RefreshCw className="w-4 h-4 text-clay" />
              </div>
              <h3 className="text-xs uppercase tracking-spec font-bold text-ink pt-2">
                MOMO &amp; PAY ON DELIVERY
              </h3>
              <p className="text-xs text-stone-dark font-sans font-light leading-relaxed">
                Seamless Mobile Money (MTN MoMo, Telecel Cash) and Pay on Delivery options available.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-6 bg-sand border border-stone-border">
              <div className="flex items-center justify-between text-ink">
                <span className="text-[10px] text-stone uppercase tracking-ultra">03 / FABRIC</span>
                <ShieldCheck className="w-4 h-4 text-clay" />
              </div>
              <h3 className="text-xs uppercase tracking-spec font-bold text-ink pt-2">
                HEAVYWEIGHT CRAFT
              </h3>
              <p className="text-xs text-stone-dark font-sans font-light leading-relaxed">
                Engineered with reinforced tension flatlocks to ensure your garments never lose structure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
