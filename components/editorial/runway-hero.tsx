'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Play, Volume2, VolumeX } from 'lucide-react';

export function RunwayHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between bg-obsidian-950 text-slate-chalk overflow-hidden pt-24 pb-10 px-4 sm:px-8 lg:px-16 grain-overlay select-none">
      {/* Background Runway Imagery with Parallax Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=88"
          alt="ST Clothing Runway Lookbook"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-55 scale-105 transition-transform duration-[2000ms] ease-luxury-out hover:scale-100"
        />
        {/* Editorial Gradients & Obsidian Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/80 via-transparent to-obsidian-950/80" />
      </div>

      {/* Top Header Editorial Spec Bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-obsidian-border/80 pb-6 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-editorial-terracotta animate-pulse-subtle" />
          <span className="font-mono text-[10px] tracking-ultra uppercase text-slate-faint">
            AUTUMN / WINTER 2026 // CAPSULE ARCHIVE
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] text-slate-muted">
          <span>LAT 40.7128° N · LON 74.0060° W</span>
          <span className="text-obsidian-border">/</span>
          <span>450 GSM HEAVYWEIGHT SILHOUETTES</span>
          <span className="text-obsidian-border">/</span>
          <span>LIMITED EDITION OF 150</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 text-[10px] font-mono tracking-spec uppercase text-slate-muted hover:text-slate-chalk transition-colors"
            data-cursor="SOUND"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'AUDIO OFF' : 'RUNWAY SCORE'}</span>
          </button>
        </div>
      </div>

      {/* Center Monumental Typography Spread */}
      <div className="relative z-10 max-w-[1720px] w-full mx-auto my-auto py-12 sm:py-16">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-block">
            <span className="font-mono text-xs uppercase tracking-monumental text-editorial-sand bg-obsidian-900/80 px-3.5 py-1.5 border border-obsidian-border backdrop-blur-md">
              COLLECTION 04 · THE FORM MONOLITH
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10.5rem] font-black uppercase tracking-tightest leading-monumental text-slate-chalk drop-shadow-2xl">
            ST CLOTHING
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-4 sm:pt-8">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-lg sm:text-2xl md:text-3xl font-serif italic text-slate-chalk/90 font-light leading-snug">
                &ldquo;Designed for those who define their own style. Pure form, uncompromised drape, and tactile substance.&rdquo;
              </p>
              <p className="text-xs font-mono tracking-spec text-slate-muted uppercase">
                HEIRLOOM CONSTRUCTION · SUSTAINABLY HARVESTED FIBERS · MONOCHROMATIC LUXURY
              </p>
            </div>

            <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-start lg:justify-end gap-4">
              <Link
                href="/shop"
                data-cursor="ENTER"
                className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-linen-100 text-slate-ink font-mono text-xs uppercase tracking-ultra font-semibold hover:bg-slate-chalk transition-all duration-500 shadow-2xl"
              >
                <span>EXPLORE CAPSULE</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/shop?filter=new"
                data-cursor="NEW DROPS"
                className="inline-flex items-center justify-center px-8 py-5 bg-obsidian-900/90 border border-obsidian-border text-slate-chalk font-mono text-xs uppercase tracking-ultra font-medium hover:bg-obsidian-800 hover:border-slate-muted transition-all duration-300 backdrop-blur-md"
              >
                <span>NEW ARRIVALS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Runway Indicator & Ticker */}
      <div className="relative z-10 w-full flex items-center justify-between border-t border-obsidian-border/80 pt-6">
        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-spec text-slate-faint">
          <span>INDEX 01 / 06</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">GLOBAL COMPLIMENTARY COURIER OVER $150</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-ultra text-slate-muted">
          <span>SCROLL TO ADVANCE RUNWAY</span>
          <div className="w-4 h-4 rounded-full border border-slate-muted flex items-center justify-center animate-bounce">
            <ArrowDown className="w-2.5 h-2.5 text-slate-chalk" />
          </div>
        </div>
      </div>
    </section>
  );
}
