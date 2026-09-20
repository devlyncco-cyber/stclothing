'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { createOrder } from '@/lib/data/store';
import { formatPrice } from '@/lib/utils';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Truck,
  MessageCircle,
  Copy,
  Check,
  Search,
} from 'lucide-react';

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Central',
  'Eastern',
  'Western',
  'Western North',
  'Volta',
  'Oti',
  'Northern',
  'North East',
  'Savannah',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useStoreSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: 'Greater Accra',
    city: '',
    address: '',
    digitalAddress: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    id: string;
    customerName: string;
    totalAmount: number;
    phone?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping logic (Standard direct courier in Ghana)
  const shipping = 0; // Included / direct delivery
  const total = subtotal + shipping;

  const handleCopyId = () => {
    if (orderComplete?.id) {
      navigator.clipboard.writeText(orderComplete.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setErrorMsg('Please complete all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullDeliveryAddress = `${formData.address}${formData.digitalAddress ? ` (Digital Address: ${formData.digitalAddress})` : ''}, ${formData.city}, ${formData.region}, Ghana`;

      const newOrder = await createOrder({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        delivery_address: fullDeliveryAddress,
        city: formData.city.trim(),
        postal_code: formData.digitalAddress.trim() || formData.region,
        country: 'Ghana',
        total_amount: total,
        notes: formData.notes.trim() || undefined,
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
        phone: newOrder.customer_phone || undefined,
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
    const primaryWa = settings.primaryWhatsApp || '233544911015';
    const waText = encodeURIComponent(
      `Hello ST Clothing Atelier, I just placed an order on the website.\n\nOrder Ref: ${orderComplete.id}\nCustomer: ${orderComplete.customerName}\nTotal: GH₵${orderComplete.totalAmount.toFixed(2)}\n\nPlease confirm dispatch details.`
    );
    const waUrl = `https://wa.me/${primaryWa}?text=${waText}`;

    return (
      <div className="min-h-screen bg-bone pt-32 pb-24 font-sans gallery-canvas select-none">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="w-16 h-16 bg-ink text-bone rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 stroke-2 text-clay" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sand border border-stone-border font-mono text-[10px] uppercase tracking-ultra text-stone">
              <span>GHANA DISPATCH QUEUE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-ink">
              Order Confirmed
            </h1>
            <p className="text-sm font-sans font-light text-stone-dark max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-ink font-semibold">{orderComplete.customerName}</strong>. Your order has been registered and is queued in our Tema atelier.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-sand border border-stone-border p-6 text-left space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-border/60 gap-2">
              <span className="text-stone uppercase text-[10px] tracking-ultra">ORDER REFERENCE ID</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-xs select-all break-all">{orderComplete.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 text-stone hover:text-ink transition-colors flex-shrink-0"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between pb-3 border-b border-stone-border/60">
              <span className="text-stone uppercase text-[10px] tracking-ultra">TOTAL AMOUNT</span>
              <span className="font-bold text-ink">{formatPrice(orderComplete.totalAmount)}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-stone-border/60">
              <span className="text-stone uppercase text-[10px] tracking-ultra">ESTIMATED DISPATCH</span>
              <span className="font-medium text-stone-dark">Same-Day / Next-Day (Tema &amp; Accra)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone uppercase text-[10px] tracking-ultra">INITIAL STATUS</span>
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 uppercase text-[10px]">
                Pending Atelier Prep
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4 font-mono text-xs">
            <Link
              href={`/track?id=${orderComplete.id}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-bone uppercase tracking-ultra font-semibold hover:bg-clay hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Track Order Live</span>
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 text-white uppercase tracking-ultra font-semibold hover:bg-emerald-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirm on WhatsApp</span>
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center text-xs font-mono uppercase tracking-ultra text-stone hover:text-ink underline underline-offset-4 transition-colors"
            >
              Continue Exploring Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-bone pt-28 pb-24 font-sans gallery-canvas select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center font-mono text-xs uppercase tracking-ultra text-stone hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Bag
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-sand border border-stone-border p-8">
            <div className="w-16 h-16 rounded-full bg-bone flex items-center justify-center text-stone mx-auto">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="text-xl font-serif font-normal text-ink">
              Your bag is empty
            </h2>
            <p className="text-xs font-sans font-light text-stone-dark">
              Please add pieces to your bag before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-3 bg-ink text-bone font-mono text-xs uppercase tracking-ultra font-semibold hover:bg-clay transition-colors"
            >
              Explore The Collection
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-sand border border-stone-border font-mono text-[9px] uppercase tracking-ultra text-stone mb-2">
                  <Truck className="w-3 h-3 text-clay" />
                  <span>DOMESTIC GHANA DELIVERY</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-ink">
                  Checkout
                </h1>
                <p className="text-xs font-sans font-light text-stone-dark mt-1">
                  Deliveries dispatched directly from our Tema atelier across Greater Accra and nationwide Ghana.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
                  {errorMsg}
                </div>
              )}

              {/* 1. Contact Info */}
              <div className="space-y-4 p-6 bg-sand border border-stone-border">
                <h2 className="font-mono text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-2">
                  1. Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="kwame@example.com"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Phone Number / WhatsApp (For Courier &amp; MoMo Updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 054 491 1015 / 020 930 0106"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address in Ghana */}
              <div className="space-y-4 p-6 bg-sand border border-stone-border">
                <div className="flex items-center justify-between border-b border-stone-border pb-2">
                  <h2 className="font-mono text-xs uppercase tracking-ultra font-bold text-ink">
                    2. Ghanaian Delivery Destination
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-ultra text-clay font-bold">
                    GHANA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Region in Ghana *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink cursor-pointer"
                    >
                      {GHANA_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg} Region
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      City / Town / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Tema Community 1, Spintex, East Legon, Kumasi"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Street Address / House No. / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House 14, Near Community 1 Police Post / Shell Junction"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      GhanaPost Digital Address / GPS (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.digitalAddress}
                      onChange={(e) => setFormData({ ...formData, digitalAddress: e.target.value })}
                      placeholder="e.g. GT-020-1122 or GA-183-9022"
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-medium">
                      Delivery Instructions / Special Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Call when close to junction, gate code, leave at reception..."
                      className="w-full bg-bone border border-stone-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="space-y-3 p-6 bg-sand border border-stone-border">
                <h2 className="font-mono text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-2 flex items-center justify-between">
                  <span>3. Payment &amp; Dispatch Option</span>
                  <span className="text-[9px] text-clay font-bold">MOMO / PAY ON DELIVERY</span>
                </h2>

                <div className="p-4 bg-bone border border-stone-border flex items-start gap-3 text-xs text-stone-dark font-mono">
                  <Lock className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-ink text-xs">Direct Atelier Dispatch</p>
                    <p className="text-[11px] leading-relaxed font-sans text-stone-dark">
                      Placing your order records it immediately in the database and reserves your pieces. Payment is settled via Mobile Money (MTN MoMo / Telecel Cash) or Pay on Delivery within Greater Accra.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-sand p-6 sm:p-8 border border-stone-border space-y-6 sticky top-28 font-mono">
                <h2 className="text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-4">
                  ORDER SUMMARY ({items.reduce((s, i) => s + i.quantity, 0)} ITEMS)
                </h2>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-border/60 pr-1 no-scrollbar">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="py-3 flex gap-3 items-center"
                    >
                      <div className="relative w-12 h-16 bg-bone flex-shrink-0 border border-stone-border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                          sizes="48px"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-ink text-bone text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase font-semibold text-ink truncate font-serif">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone tracking-spec">
                          {item.size} • {item.color}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-ink tracking-spec">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-stone-border pt-4 space-y-2.5 text-xs tracking-spec">
                  <div className="flex justify-between text-stone-dark">
                    <span>SUBTOTAL</span>
                    <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-dark">
                    <span>COURIER DISPATCH</span>
                    <span className="text-clay font-semibold">DIRECT COURIER</span>
                  </div>
                  <div className="border-t border-stone-border pt-3 flex justify-between text-sm font-bold text-ink">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-base font-serif text-clay">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-ink text-bone uppercase tracking-ultra text-xs font-semibold hover:bg-clay hover:text-white transition-colors disabled:bg-stone-dark/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'RECORDING ORDER...' : 'PLACE OFFICIAL ORDER'}</span>
                </button>

                <p className="text-[10px] text-stone text-center font-sans">
                  Orders are processed and packed in our Tema workshop. Questions?{' '}
                  <a
                    href={BRAND_CONFIG.contacts.primaryWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink font-mono"
                  >
                    WhatsApp Atelier
                  </a>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
