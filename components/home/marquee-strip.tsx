import React from 'react';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function MarqueeStrip() {
  const items = [
    'NEW ARRIVALS 2026',
    'MADE FOR TEMA. WORN EVERYWHERE',
    `ORDER ON WHATSAPP: ${BRAND_CONFIG.contacts.primaryPhoneDisplay}`,
    'DELIVERIES ACROSS GREATER ACCRA & NATIONWIDE',
    `INSTAGRAM: ${BRAND_CONFIG.handle}`,
    'MOBILE MONEY & PAY ON DELIVERY AVAILABLE',
  ];

  return (
    <div className="w-full bg-ink text-bone py-3.5 overflow-hidden border-y border-ink font-mono text-[11px] uppercase tracking-ultra select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((text, idx) => (
          <span key={idx} className="flex items-center mx-6 gap-6">
            <span>{text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-clay inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
