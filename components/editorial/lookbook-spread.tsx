'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { EditorialShaderCanvas } from '@/components/motion/editorial-shader-canvas';

export function LookbookSpread() {
  return (
    <section className="py-28 bg-linen-100 text-slate-ink border-b border-linen-300 grain-overlay">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Lookbook Spread Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 mb-12 border-b border-linen-300 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-ultra uppercase text-slate-muted">
              EDITORIAL LOOKBOOK // SPREAD 04
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              Anatomy of the <span className="italic font-light">Sculpted Coat</span>
            </h2>
          </div>
          <Link
            href="/shop"
            data-cursor="RUNWAY"
            className="font-mono text-xs uppercase tracking-ultra font-semibold text-slate-ink hover:text-editorial-terracotta inline-flex items-center gap-2 group"
          >
            <span>DISCOVER RUNWAY LOOKBOOK</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Magazine-Grade Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: WebGL Liquid Canvas / Interactive Image Container */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] bg-linen-200 border border-linen-300 overflow-hidden group">
            <EditorialShaderCanvas
              imageSrc="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
              imageAltSrc="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-[9px] uppercase tracking-spec px-2.5 py-1 bg-linen-100/90 backdrop-blur-sm border border-linen-300">
              INTERACTIVE LIQUID DRAPE · HOVER TO ENGAGE
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none font-mono text-[9px] uppercase tracking-ultra text-slate-muted bg-linen-100/80 p-2 backdrop-blur-sm">
              <span>FIG. 04 — DROPPED SHOULDER OVERCOAT</span>
              <span>100% UNBLEACHED WOOL BLEND</span>
            </div>
          </div>

          {/* Right: Editorial Dialogue & Styling Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:pl-4">
            <div className="space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-ultra text-editorial-terracotta">
                ARCHITECTURAL SILHOUETTE
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-light leading-tight">
                Designed with zero structural compromise. Built to outlive seasonal trends.
              </h3>
              <p className="text-sm font-sans font-light text-slate-muted leading-relaxed">
                By recalibrating traditional shoulder seams into an unbroken, continuous raglan drape, the garment settles naturally onto the wearer&rsquo;s posture without boxiness or synthetic padding.
              </p>
            </div>

            {/* Spec breakdown table */}
            <div className="space-y-3 font-mono text-xs border-y border-linen-300 py-6">
              <div className="flex justify-between">
                <span className="text-slate-muted uppercase tracking-spec">CUT & PROFILE</span>
                <span className="font-semibold text-slate-ink">Relaxed Oversized Cocoon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-muted uppercase tracking-spec">ORIGIN OF WEAVE</span>
                <span className="font-semibold text-slate-ink">Biella, Northern Italy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-muted uppercase tracking-spec">HARDWARE FINISH</span>
                <span className="font-semibold text-slate-ink">Matte Gunmetal Horn Buttons</span>
              </div>
            </div>

            <div>
              <Link
                href="/shop"
                data-cursor="SHOP"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-ink text-linen-100 font-mono text-xs uppercase tracking-ultra font-semibold hover:bg-slate-muted transition-colors shadow-lg"
              >
                ACQUIRE EDITORIAL PIECES
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
