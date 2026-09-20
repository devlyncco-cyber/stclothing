import React from 'react';
import { MessageCircle, Phone, ArrowUpRight, Truck, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function WhatsAppCtaBanner() {
  return (
    <section className="py-24 bg-sand text-ink border-b border-stone-border select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-ultra text-clay bg-bone px-3 py-1 border border-stone-border">
              <span>DIRECT ORDER DESK // TEMA ATELIER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-[1.05]">
              Order in Seconds via <span className="italic font-light text-clay">WhatsApp</span>.
            </h2>

            <p className="text-sm sm:text-base font-sans font-light text-stone-dark max-w-xl leading-relaxed">
              We provide personal concierge service for all orders in Ghana. Select your size, confirm fabric availability, and arrange direct dispatch to your doorstep in Tema, Accra, or nationwide.
            </p>

            <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-stone-dark">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ink" />
                <span>Deliveries across Tema &amp; Greater Accra</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink" />
                <span>MoMo &amp; Pay on Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Action Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Primary line CTA */}
            <a
              href={BRAND_CONFIG.contacts.primaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="CHAT"
              className="p-6 bg-bone border border-stone-border hover:border-ink transition-all duration-300 flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-ultra text-stone">
                    PRIMARY WHATSAPP LINE
                  </span>
                  <span className="font-serif text-xl font-semibold text-ink">
                    {BRAND_CONFIG.contacts.primaryPhoneDisplay}
                  </span>
                  <span className="block text-[11px] text-stone-dark font-sans pt-0.5">
                    Tap to chat directly with atelier
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone group-hover:text-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            {/* Secondary line CTA */}
            <a
              href={BRAND_CONFIG.contacts.secondaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="CHAT"
              className="p-6 bg-bone border border-stone-border hover:border-ink transition-all duration-300 flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-ultra text-stone">
                    SECONDARY WHATSAPP LINE
                  </span>
                  <span className="font-serif text-xl font-semibold text-ink">
                    {BRAND_CONFIG.contacts.secondaryPhoneDisplay}
                  </span>
                  <span className="block text-[11px] text-stone-dark font-sans pt-0.5">
                    Alternative WhatsApp order line
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone group-hover:text-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
