import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { KenteStrip } from '@/components/ui/kente-strip';
import { AdinkraMark } from '@/components/ui/adinkra-mark';

export const metadata = {
  title: 'About The Atelier | ST Clothing (Tema, Ghana)',
  description: 'Learn about the philosophy, Ghanaian craftsmanship, and architectural minimalism behind ST Clothing in Tema, Ghana.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bone pt-28 pb-24 font-sans select-none gallery-canvas text-ink">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header Monograph */}
        <div className="max-w-4xl mb-16 border-b border-stone-border pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-ultra text-stone font-semibold">
              ATELIER MANIFESTO // TEMA, GHANA
            </span>
            <AdinkraMark size={18} className="text-clay" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tightest leading-[0.95] text-ink">
            Made for Tema.
            <br />
            <span className="italic font-light text-stone-dark">Worn everywhere.</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-light text-stone-dark mt-6 leading-relaxed max-w-2xl">
            ST Clothing was founded on the conviction that African luxury does not need to be loud, ornamental, or fast-trend. Our signature is the quiet authority of raw fabric weight, architectural drape, and enduring construction.
          </p>
        </div>

        {/* Hero Image / Atelier Spread */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-sand border border-stone-border overflow-hidden mb-24">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=85"
            alt="ST Clothing Atelier and Workshop in Tema"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3 bg-bone/90 border border-stone-border font-mono text-[9px] uppercase tracking-ultra text-stone">
            <span>ST STUDIO &amp; CUTTING TABLE // GREATER ACCRA</span>
            <span className="text-ink font-semibold">100% ETHICAL TEMA CRAFT</span>
          </div>
        </div>

        {/* 3 Core Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-24 border-t border-b border-stone-border py-16">
          <div className="space-y-4">
            <span className="font-mono text-xs text-clay font-semibold">01 / WEIGHT &amp; FIBER</span>
            <h3 className="font-serif text-2xl font-normal text-ink">
              Heavyweight Substance
            </h3>
            <p className="text-sm text-stone-dark leading-relaxed font-sans font-light">
              We specify 280 to 450 GSM combed cottons and virgin wool weaves. Our fabrics possess true physical gravity, allowing shirts and outerwear to drape with sculptural clarity rather than cling.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-mono text-xs text-clay font-semibold">02 / TEMA GEOMETRY</span>
            <h3 className="font-serif text-2xl font-normal text-ink">
              Architectural Silhouettes
            </h3>
            <p className="text-sm text-stone-dark leading-relaxed font-sans font-light">
              Inspired by the clean gridlines and maritime industrial structures of Tema Harbor. We eliminate unnecessary visual noise to allow silhouette, proportion, and texture to lead.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-mono text-xs text-clay font-semibold">03 / GHANAIAN INTEGRITY</span>
            <h3 className="font-serif text-2xl font-normal text-ink">
              Heirloom Longevity
            </h3>
            <p className="text-sm text-stone-dark leading-relaxed font-sans font-light">
              Constructed with reinforced double-flatlock seams to endure years of rotation. Every piece is built to be worn, laundered, and cherished across seasons.
            </p>
          </div>
        </div>

        {/* Direct Studio CTA */}
        <div className="p-12 sm:p-16 bg-sand border border-stone-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-ultra text-clay font-semibold">
              ATELIER ACCESS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
              Connect Directly with Our Tailoring Team
            </h2>
            <p className="text-sm text-stone-dark font-sans font-light leading-relaxed">
              Have questions about garment sizing, fabric weights, or custom orders in Ghana? Chat with us on WhatsApp or explore our current drops.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 font-mono text-xs w-full lg:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-bone uppercase tracking-ultra font-semibold hover:bg-clay transition-colors"
            >
              <span>Contact Studio</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-sand border border-stone-border text-ink uppercase tracking-ultra font-semibold hover:border-ink transition-colors"
            >
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
