'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, subtotal } = useCart();

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 border-b border-neutral-200 pb-6 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block mb-1">
              Your Selection
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.2em] text-black">
              Shopping Bag ({totalItems})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors"
            >
              Clear Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg uppercase tracking-[0.2em] font-bold text-black">
                Your Bag Is Empty
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                You haven&apos;t added any ST Clothing garments yet. Explore our curated collections to find your essentials.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Items List (8 cols) */}
            <div className="lg:col-span-8 divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                >
                  {/* Left: Image & Info */}
                  <div className="flex gap-4 items-center flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-24 h-32 bg-neutral-100 flex-shrink-0 overflow-hidden border border-neutral-200 block"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                        sizes="96px"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-neutral-500 tracking-wider">
                        <span>Size: <strong className="text-neutral-800">{item.size}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Color: <strong className="text-neutral-800">{item.color}</strong></span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 pt-1 tracking-wider">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity & Subtotal & Trash */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-neutral-300 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="px-2.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 py-1.5 text-xs font-semibold text-black min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        className="px-2.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-sm font-bold tracking-wider text-black min-w-[80px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-neutral-400 hover:text-black p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-neutral-50 p-6 sm:p-8 border border-neutral-200 space-y-6">
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-black border-b border-neutral-200 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs tracking-wider">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Tax (8%)</span>
                    <span>{formatPrice(estimatedTax)}</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-black text-black tracking-widest">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-[11px] text-neutral-500 bg-white p-2.5 border border-neutral-200">
                    Add <strong>{formatPrice(150 - subtotal)}</strong> more to unlock complimentary free shipping.
                  </p>
                )}

                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-colors shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full block text-center py-3 px-6 bg-white border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-center gap-2 text-[11px] text-neutral-500 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-neutral-700" />
                  <span>Encrypted 256-Bit SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
