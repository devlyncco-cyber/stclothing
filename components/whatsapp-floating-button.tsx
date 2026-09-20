'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X, ArrowUpRight } from 'lucide-react';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useStoreSettings();

  const primaryWa = settings.primaryWhatsApp || '233544911015';
  const secondaryWa = settings.secondaryWhatsApp || '233209300106';

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-bone p-5 shadow-2xl border border-stone-border text-ink animate-fade-up">
          <div className="flex items-start justify-between pb-3 border-b border-stone-border">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-ultra text-stone">
                {(settings.city || 'TEMA').toUpperCase()}, {(settings.country || 'GHANA').toUpperCase()} · LIVE ATELIER
              </span>
              <h3 className="font-serif text-base font-semibold text-ink">
                {settings.ordersEnabled ? 'Order Directly on WhatsApp' : 'Chat with Atelier Concierge'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone hover:text-ink transition-colors"
              aria-label="Close WhatsApp menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-dark mt-2 leading-relaxed font-light">
            Chat directly with our studio in {settings.city || 'Tema'} for custom sizing, order placement, or delivery inquiries across {settings.region || 'Greater Accra'}.
          </p>

          <div className="mt-4 space-y-2.5">
            {/* Primary line */}
            <a
              href={`https://wa.me/${primaryWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-sand hover:bg-stone-border/70 text-ink transition-colors border border-stone-border group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-mono tracking-spec uppercase text-stone-dark">
                    PRIMARY WHATSAPP
                  </span>
                  <span className="font-mono text-xs font-semibold">
                    {settings.primaryPhoneDisplay || '054 491 1015'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Secondary line */}
            <a
              href={`https://wa.me/${secondaryWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-sand hover:bg-stone-border/70 text-ink transition-colors border border-stone-border group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-mono tracking-spec uppercase text-stone-dark">
                    SECONDARY WHATSAPP
                  </span>
                  <span className="font-mono text-xs font-semibold">
                    {settings.secondaryPhoneDisplay || '020 930 0106'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Tap to Call */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-dark">
              <span>Direct Call:</span>
              <a
                href={`tel:${settings.primaryPhone || '0544911015'}`}
                className="underline hover:text-ink transition-colors flex items-center gap-1 font-semibold"
              >
                <Phone className="w-3 h-3" />
                <span>{settings.primaryPhone || '0544911015'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="WHATSAPP"
        className="w-13 h-13 p-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 border border-emerald-600/40"
        aria-label="Contact ST Clothing on WhatsApp"
        title="WhatsApp Atelier Concierge"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </button>
    </div>
  );
}
