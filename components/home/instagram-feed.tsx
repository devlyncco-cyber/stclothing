import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function InstagramFeed() {
  const posts = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      caption: 'Lookbook Drop 04 in Tema. 450 GSM Double-Faced Terry.',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      caption: 'ST Heavyweight Oversized Tee in Natural Bone & Noir.',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      caption: 'Sculptural hoodie drape crafted for daily wear.',
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      caption: 'Tapered pleated trousers with clean architectural hem.',
    },
  ];

  return (
    <section className="py-24 bg-bone text-ink border-b border-stone-border select-none gallery-canvas">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-12 border-b border-stone-border gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-stone font-semibold">
              INSTAGRAM DISPATCH · {BRAND_CONFIG.handle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              Behind the Atelier
            </h2>
          </div>
          <a
            href={BRAND_CONFIG.contacts.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="INSTAGRAM"
            className="font-mono text-xs uppercase tracking-ultra font-semibold text-ink hover:text-clay inline-flex items-center gap-2 group"
          >
            <Instagram className="w-4 h-4 text-clay" />
            <span>FOLLOW {BRAND_CONFIG.handle}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 4-Item Visual Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={BRAND_CONFIG.contacts.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="INSTA"
              className="group relative aspect-[4/5] bg-sand border border-stone-border overflow-hidden block"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-bone">
                <Instagram className="w-5 h-5 self-end" />
                <p className="font-mono text-[10px] uppercase tracking-wider leading-relaxed line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
