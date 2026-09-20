'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MessageCircle, Phone, MapPin, Instagram, Mail } from 'lucide-react';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { KenteStrip } from '@/components/ui/kente-strip';
import { AdinkraMark } from '@/components/ui/adinkra-mark';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useStoreSettings();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const primaryWa = settings.primaryWhatsApp || '233544911015';
  const secondaryWa = settings.secondaryWhatsApp || '233209300106';

  return (
    <footer className="bg-ink text-bone pt-20 pb-12 border-t border-ink select-none font-mono">
      {/* Subtle Kente Geometric Top Accent Strip */}
      <KenteStrip height="h-2" className="mb-16" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-stone-dark/40">
          {/* Brand Monograph Col (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight uppercase text-bone">
                {settings.storeName || 'ST CLOTHING'}
              </h2>
              <AdinkraMark className="text-clay" size={24} />
            </div>

            <p className="text-stone text-xs sm:text-sm font-sans font-light leading-relaxed max-w-md">
              {settings.tagline || BRAND_CONFIG.tagline} {settings.description || 'Contemporary minimalist silhouettes engineered in Tema, Ghana.'}
            </p>

            <div className="space-y-1.5 text-xs text-stone-light">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-clay flex-shrink-0" />
                <span>Atelier Location: {settings.fullAddress || BRAND_CONFIG.location.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-clay flex-shrink-0" />
                <a
                  href={settings.instagramUrl || BRAND_CONFIG.contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bone underline underline-offset-4"
                >
                  Instagram: {settings.instagramHandle || BRAND_CONFIG.handle}
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp & Direct Order Desk (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-[10px] uppercase tracking-ultra text-stone font-semibold">
              DIRECT DESK // WHATSAPP &amp; CALLS
            </h3>
            <div className="space-y-3 text-xs tracking-spec">
              {/* Primary Line */}
              <div className="p-3 bg-stone-dark/30 border border-stone-dark/60 space-y-1">
                <span className="block text-[9px] uppercase tracking-ultra text-stone">
                  PRIMARY CONTACT &amp; WHATSAPP
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href={`https://wa.me/${primaryWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-bone font-semibold hover:text-clay transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                    <span>WhatsApp: {settings.primaryPhoneDisplay || '054 491 1015'}</span>
                  </a>
                  <a
                    href={`tel:${settings.primaryPhone || '0544911015'}`}
                    className="text-stone hover:text-bone text-[11px] underline"
                    title="Direct Call"
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Secondary Line */}
              <div className="p-3 bg-stone-dark/30 border border-stone-dark/60 space-y-1">
                <span className="block text-[9px] uppercase tracking-ultra text-stone">
                  SECONDARY CONTACT &amp; WHATSAPP
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href={`https://wa.me/${secondaryWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-bone font-semibold hover:text-clay transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                    <span>WhatsApp: {settings.secondaryPhoneDisplay || '020 930 0106'}</span>
                  </a>
                  <a
                    href={`tel:${settings.secondaryPhone || '0209300106'}`}
                    className="text-stone hover:text-bone text-[11px] underline"
                    title="Direct Call"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-stone leading-relaxed font-sans pt-1">
              {settings.deliveryInfo ||
                'Deliveries scheduled daily across Tema, Spintex, East Legon, Accra, and nationwide Ghana via direct courier.'}
            </p>
          </div>

          {/* Navigation & Dispatch (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-[10px] uppercase tracking-ultra text-stone font-semibold">
              ATELIER DISPATCH
            </h3>
            <ul className="space-y-2.5 text-xs tracking-spec text-stone-light">
              <li>
                <Link href="/shop" className="hover:text-bone transition-colors">
                  ALL COLLECTIONS
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-bone transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-bone transition-colors">
                  TEMA LOOKBOOK
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-bone transition-colors">
                  BRAND STORY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-bone transition-colors">
                  CONTACT &amp; MAP
                </Link>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Thank you for subscribing to ${settings.storeName || 'ST Clothing'} updates.`);
                }}
                className="flex flex-col space-y-2"
              >
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL"
                  className="bg-stone-dark/30 border border-stone-dark/80 text-xs text-bone px-3 py-2.5 w-full focus:outline-none focus:border-clay placeholder:text-stone tracking-spec"
                />
                <button
                  type="submit"
                  className="bg-bone text-ink text-[10px] uppercase tracking-ultra py-2 font-semibold hover:bg-clay hover:text-white transition-colors text-center"
                >
                  JOIN DISPATCH
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-stone">
          <div className="flex items-center space-x-6 tracking-ultra uppercase">
            <a
              href={settings.instagramUrl || BRAND_CONFIG.contacts.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors flex items-center gap-1"
            >
              Instagram <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
            <a
              href={`https://wa.me/${primaryWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors flex items-center gap-1"
            >
              WhatsApp <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
            <span>
              {(settings.city || 'TEMA').toUpperCase()} · {(settings.region || 'GREATER ACCRA').toUpperCase()} · {(settings.country || 'GHANA').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-bone transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-bone transition-colors">
              TERMS OF SERVICE
            </Link>
            <span>© {new Date().getFullYear()} {settings.storeName || 'ST CLOTHING'} (GH). ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
