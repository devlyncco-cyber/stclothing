import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Shield, Feather, Sparkles } from 'lucide-react';

export function CraftMonologue() {
  const specs = [
    {
      title: '450 GSM WEAVE',
      subtitle: 'Double-Faced Organic Loopback',
      desc: 'Unmatched structural drape that holds its sculptural silhouette through years of wear and repeated laundering.',
      icon: Feather,
    },
    {
      title: 'ZERO SYNTHETICS',
      subtitle: '100% GOTS Certified Cotton',
      desc: 'Sustainably harvested fibers spun without chemical softeners, microplastics, or polyester blending.',
      icon: Compass,
    },
    {
      title: 'DOUBLE FLATLOCK',
      subtitle: 'Reinforced Tension Seams',
      desc: 'Industrial-grade stitching across all stress junctures, preventing fraying and torque distortion.',
      icon: Shield,
    },
    {
      title: 'MINERAL PIGMENTS',
      subtitle: 'Earth-Extracted Natural Dyes',
      desc: 'Low-impact reactive dyes yielding deep smoked obsidian and warm linen undertones.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-28 sm:py-36 bg-obsidian-950 text-slate-chalk relative overflow-hidden border-y border-obsidian-border grain-overlay">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Philosophy Monologue Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-ultra text-slate-muted bg-obsidian-900 px-3.5 py-1.5 border border-obsidian-border">
            <span>BRAND MANIFESTO · 2026 EDITION</span>
          </div>

          <blockquote className="text-3xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] text-slate-chalk tracking-tight">
            &ldquo;Minimalism is not the lack of something. It is simply the{' '}
            <span className="italic font-normal text-editorial-sand">perfect amount of everything</span>.&rdquo;
          </blockquote>

          <p className="text-sm sm:text-base font-sans font-light text-slate-muted max-w-2xl mx-auto leading-relaxed">
            Every garment from ST Clothing is precision cut from heavyweight unblended fibers. We discard logos, slogans, and ornate distractions to let raw fabric weight and drape command absolute authority.
          </p>

          <div className="pt-2">
            <Link
              href="/about"
              data-cursor="MANIFESTO"
              className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-ultra text-slate-chalk border-b border-slate-chalk pb-1 hover:text-editorial-terracotta hover:border-editorial-terracotta transition-colors group"
            >
              <span>READ THE COMPLETE ARCHIVE STUDY</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-obsidian-border/80">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between p-8 bg-obsidian-900/60 border border-obsidian-border hover:border-slate-muted transition-all duration-500 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-faint">SPEC 0{idx + 1}</span>
                  <Icon className="w-4 h-4 text-editorial-sand" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-semibold tracking-spec uppercase text-slate-chalk">
                    {item.title}
                  </h3>
                  <p className="font-serif italic text-xs text-editorial-sand">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-slate-muted font-sans leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
