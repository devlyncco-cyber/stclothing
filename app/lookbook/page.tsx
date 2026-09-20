import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { getProducts } from '@/lib/data/store';
import { BRAND_CONFIG, generateProductWhatsAppUrl } from '@/lib/config/brand';
import { formatPrice } from '@/lib/utils';
import { KenteStrip } from '@/components/ui/kente-strip';

export const metadata = {
  title: 'Tema Lookbook | ST Clothing Ghana',
  description: 'Editorial lookbook showcasing contemporary Ghanaian silhouettes and minimalist essentials engineered in Tema.',
};

export default async function LookbookPage() {
  const products = await getProducts({ publishedOnly: true });

  const lookbookItems = [
    {
      vol: 'VOL. 01',
      title: 'Monolithic Heavyweight Essentials',
      desc: 'Shot against the industrial geometry of Tema Harbor. 450 GSM double-faced loopback terry structured with dropped shoulders and raw clean hemlines.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
      featuredSlug: products[0]?.slug || 'st-essential-oversized-tee',
      productName: products[0]?.name || 'Heavyweight Oversized Tee',
      price: products[0]?.price || 250,
    },
    {
      vol: 'VOL. 02',
      title: 'Architectural Tailored Trousers',
      desc: 'Constructed from Japanese selvedge twill and high-density cotton. A relaxed tapered silhouette engineered to balance tropical airflow and sharp editorial lines.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
      featuredSlug: products[2]?.slug || 'st-relaxed-tailored-trousers',
      productName: products[2]?.name || 'Relaxed Tailored Trousers',
      price: products[2]?.price || 480,
    },
    {
      vol: 'VOL. 03',
      title: 'Sculpted Minimalist Outerwear',
      desc: 'Unbleached natural virgin wool blend and matte ripstop. Clean horn hardware and unlined drape that moves effortlessly with the body.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85',
      featuredSlug: products[1]?.slug || 'st-sculptural-hoodie',
      productName: products[1]?.name || 'Sculptural Minimalist Hoodie',
      price: products[1]?.price || 550,
    },
  ];

  return (
    <div className="min-h-screen bg-bone pt-28 pb-24 font-sans select-none gallery-canvas text-ink">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mb-16 border-b border-stone-border pb-8">
          <span className="font-mono text-[10px] uppercase tracking-ultra text-stone font-semibold block mb-2">
            EDITORIAL PUBLICATION // TEMA, GHANA
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight">
            The Tema Lookbook
          </h1>
          <p className="text-sm sm:text-base font-sans font-light text-stone-dark mt-4 leading-relaxed">
            A photographic study exploring quiet luxury, structural drape, and Ghanaian material honesty.
          </p>
        </div>

        {/* Lookbook Spreads */}
        <div className="space-y-24 sm:space-y-32">
          {lookbookItems.map((item, idx) => {
            const isEven = idx % 2 === 1;
            const whatsAppUrl = generateProductWhatsAppUrl({
              productName: item.productName,
              size: 'M',
              quantity: 1,
              price: item.price,
              productSlug: item.featuredSlug,
            });

            return (
              <article
                key={item.vol}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center border-b border-stone-border pb-20"
              >
                {/* Image (7 cols) */}
                <div
                  className={`lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] bg-sand border border-stone-border overflow-hidden group ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center transition-transform duration-1000 ease-editorial group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10 font-mono text-[9px] uppercase tracking-spec px-2.5 py-1 bg-bone/90 border border-stone-border">
                    {item.vol} · TEMA ARCHIVE
                  </div>
                </div>

                {/* Narrative & Featured Piece (5 cols) */}
                <div className={`lg:col-span-5 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <span className="font-mono text-xs uppercase tracking-ultra text-clay font-semibold">
                    {item.vol} // EDITORIAL ESSAY
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-ink">
                    {item.title}
                  </h2>

                  <p className="text-sm font-sans font-light text-stone-dark leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="p-4 bg-sand border border-stone-border space-y-2 font-mono">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-[10px] uppercase tracking-ultra text-stone">FEATURED PIECE</span>
                      <span className="font-semibold text-ink">{formatPrice(item.price)}</span>
                    </div>
                    <p className="font-serif text-base text-ink">{item.productName}</p>
                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href={`/product/${item.featuredSlug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-bone text-[10px] uppercase tracking-spec font-semibold hover:bg-clay hover:text-white transition-colors"
                      >
                        <span>VIEW PIECE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 p-12 bg-sand border border-stone-border text-center space-y-6">
          <h2 className="text-3xl font-serif font-normal text-ink">
            Experience the Collection in Person or on WhatsApp
          </h2>
          <p className="text-sm font-sans font-light text-stone-dark max-w-lg mx-auto leading-relaxed">
            Connect directly with our atelier team in Tema to confirm sizing or request custom appointments.
          </p>
          <div className="pt-2 flex justify-center gap-4 font-mono text-xs">
            <a
              href={BRAND_CONFIG.contacts.primaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-bone uppercase tracking-ultra font-semibold hover:bg-clay hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Chat with Atelier</span>
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bone border border-stone-border text-ink uppercase tracking-ultra font-semibold hover:border-ink transition-colors"
            >
              <span>Shop All Pieces</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
