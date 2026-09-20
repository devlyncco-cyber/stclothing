'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/lib/data/store';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, ShoppingBag, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    id: string;
    customerName: string;
    totalAmount: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const newOrder = await createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        total_amount: total,
        notes: formData.notes,
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image_url: item.image,
        })),
      });

      setOrderComplete({
        id: newOrder.id,
        customerName: newOrder.customer_name,
        totalAmount: newOrder.total_amount,
      });

      clearCart();
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setErrorMsg('Failed to process order. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. ORDER CONFIRMATION VIEW
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 font-sans">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8 stroke-2" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.15em] text-black">
              Thank You, {orderComplete.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Your order has been recorded and is currently in <strong className="text-black">pending</strong> preparation. A receipt with tracking details has been sent to your email.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 p-6 text-left space-y-3 text-xs tracking-wider">
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Order Reference</span>
              <span className="font-mono font-bold text-black uppercase">{orderComplete.id}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500">Total Paid / Charged</span>
              <span className="font-bold text-black">{formatPrice(orderComplete.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Estimated Delivery</span>
              <span className="font-medium text-neutral-800">3–5 Business Days</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-white pt-28 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Bag
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="text-base uppercase tracking-widest font-bold text-black">
              Your bag is empty
            </h2>
            <p className="text-xs text-neutral-500">
              Please add garments to your bag before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-2 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest"
            >
              Go to Collection
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.15em] text-black">
                  Checkout
                </h1>
                <p className="text-xs text-neutral-500 mt-1 tracking-wider">
                  Please provide your delivery information to complete the order.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 tracking-wider">
                  {errorMsg}
                </div>
              )}

              {/* 1. Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  1. Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jonathan Sterling"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jonathan@example.com"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Phone Number (For Delivery Updates)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  2. Shipping Destination
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Fashion Blvd, Apt 5"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="10001"
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Gate code, porch dropoff preferences..."
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Placeholder Notice */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <span>3. Payment Authorization</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Test Mode Active</span>
                </h2>

                <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
                  <Lock className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Direct Order Processing</p>
                    <p className="mt-0.5 text-neutral-500 text-[11px]">
                      Payment gateway is in showcase demonstration mode. Clicking &quot;Place Order&quot; creates an official order record in Supabase without debiting your card.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-50 p-6 sm:p-8 border border-neutral-200 space-y-6 sticky top-28">
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-black border-b border-neutral-200 pb-4">
                  Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
                </h2>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-200 pr-1 no-scrollbar">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="py-3 flex gap-3 items-center"
                    >
                      <div className="relative w-12 h-16 bg-neutral-200 flex-shrink-0 border border-neutral-300">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                          sizes="48px"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase font-semibold text-black truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 tracking-wider">
                          {item.size} • {item.color}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-neutral-900 tracking-wider">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-neutral-200 pt-4 space-y-2.5 text-xs tracking-wider">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Sales Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-black text-black tracking-widest">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Order...' : `Place Order • ${formatPrice(total)}`}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-700" />
                  <span>Verified Secure Checkout</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
