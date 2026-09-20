'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { formatPrice } from '@/lib/utils';
import { generateCartWhatsAppUrl, BRAND_CONFIG } from '@/lib/config/brand';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems, subtotal } = useCart();
  const { settings } = useStoreSettings();

  if (!isOpen) return null;

  const primaryWa = settings.primaryWhatsApp || '233544911015';
  const whatsAppCheckoutUrl = generateCartWhatsAppUrl(
    items.map((item) => ({
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal,
    primaryWa
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-bone shadow-2xl flex flex-col justify-between animate-slide-left border-l border-stone-border text-ink">
          {/* Header */}
          <div className="p-6 border-b border-stone-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-ink" />
              <h2 className="font-serif text-lg font-semibold uppercase tracking-tight text-ink">
                Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-stone hover:text-ink transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base uppercase tracking-wider font-semibold text-ink">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone font-light max-w-xs">
                    Explore our modern minimalist silhouettes engineered in Tema, Ghana.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-ink text-bone font-mono text-xs uppercase tracking-ultra hover:bg-clay hover:text-white transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-border">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="py-4 first:pt-0 last:pb-0 flex gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 bg-sand flex-shrink-0 overflow-hidden border border-stone-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-serif font-normal text-ink hover:text-clay transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-stone hover:text-ink p-0.5 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-stone tracking-wider">
                          <span>SIZE: {item.size}</span>
                          <span>•</span>
                          <span>{item.color}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 font-mono">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-stone-border bg-sand">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                            }
                            className="px-2 py-1 text-stone-dark hover:text-ink hover:bg-stone-border/40 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-ink min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="px-2 py-1 text-stone-dark hover:text-ink hover:bg-stone-border/40 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price in GH₵ */}
                        <span className="text-xs font-semibold text-ink tracking-wider">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Subtotal / WhatsApp Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-border bg-sand/60 space-y-4 font-mono">
              <div className="space-y-1 text-xs tracking-wider">
                <div className="flex justify-between text-stone-dark">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone text-[10px]">
                  <span>Delivery in {settings.city || 'Tema'} / {settings.region || 'Accra'}</span>
                  <span>Calculated via WhatsApp</span>
                </div>
              </div>

              {!settings.ordersEnabled ? (
                <div className="pt-2 space-y-2.5">
                  <div className="p-3 bg-bone border border-stone-border text-xs text-stone-dark font-sans">
                    <p className="font-semibold text-ink font-mono uppercase text-[10px] mb-1">
                      Orders Paused
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {settings.orderingDisabledNotice ||
                        'Online orders are temporarily paused. You can keep items in your bag for reference or inquire directly.'}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${primaryWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-ink hover:bg-clay text-bone text-xs uppercase tracking-ultra font-semibold transition-colors shadow-md group"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Direct Inquiries via WhatsApp</span>
                  </a>
                </div>
              ) : (
                <div className="pt-2 space-y-2.5">
                  {/* PRIMARY: Checkout via WhatsApp */}
                  <a
                    href={whatsAppCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-ultra font-semibold transition-colors shadow-md group"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Checkout via WhatsApp</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  {/* Secondary standard checkout option */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full block text-center py-2.5 px-4 bg-bone border border-stone-border text-ink text-xs uppercase tracking-ultra hover:border-ink transition-colors font-medium"
                  >
                    Standard Web Checkout
                  </Link>
                </div>
              )}

              <p className="text-[10px] text-center text-stone pt-1">
                {settings.paymentMethods ||
                  'Payment: Mobile Money (MTN MoMo, Telecel) or Pay on Delivery'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
