'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types/database';
import { getOrderById, trackOrder } from '@/lib/data/store';
import { formatPrice, formatDate } from '@/lib/utils';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { BRAND_CONFIG } from '@/lib/config/brand';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  XCircle,
  Copy,
  MessageCircle,
  Phone,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackLoadingSkeleton />}>
      <TrackContent />
    </Suspense>
  );
}

function TrackLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bone pt-32 pb-24 font-sans gallery-canvas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
        <div className="h-10 bg-sand rounded w-1/3" />
        <div className="h-16 bg-sand rounded w-full" />
      </div>
    </div>
  );
}

const ORDER_STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'pending', label: 'Order Received', description: 'Recorded & queued for review' },
  { key: 'confirmed', label: 'Confirmed', description: 'Verified by atelier team' },
  { key: 'processing', label: 'In Studio Prep', description: 'Quality inspection & packaging' },
  { key: 'shipped', label: 'Dispatched', description: 'Out for courier delivery' },
  { key: 'delivered', label: 'Delivered', description: 'Handed over in person' },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'confirmed':
      return 1;
    case 'processing':
      return 2;
    case 'shipped':
      return 3;
    case 'delivered':
      return 4;
    case 'cancelled':
      return -1;
    default:
      return 0;
  }
}

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 border border-amber-300 text-[10px] uppercase tracking-ultra font-bold">
          <Clock className="w-3 h-3" />
          Pending Atelier Review
        </span>
      );
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/80 text-blue-900 border border-blue-300 text-[10px] uppercase tracking-ultra font-bold">
          <CheckCircle2 className="w-3 h-3" />
          Order Confirmed
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/80 text-indigo-900 border border-indigo-300 text-[10px] uppercase tracking-ultra font-bold">
          <Package className="w-3 h-3" />
          In Studio Preparation
        </span>
      );
    case 'shipped':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100/80 text-purple-900 border border-purple-300 text-[10px] uppercase tracking-ultra font-bold">
          <Truck className="w-3 h-3" />
          Dispatched / Out for Delivery
        </span>
      );
    case 'delivered':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-[10px] uppercase tracking-ultra font-bold">
          <Check className="w-3 h-3 stroke-[3]" />
          Delivered
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100/80 text-red-900 border border-red-300 text-[10px] uppercase tracking-ultra font-bold">
          <XCircle className="w-3 h-3" />
          Order Cancelled
        </span>
      );
    default:
      return null;
  }
}

function TrackContent() {
  const searchParams = useSearchParams();
  const { settings } = useStoreSettings();
  const urlId = searchParams.get('id') || searchParams.get('order') || searchParams.get('ref') || '';

  const [searchInput, setSearchInput] = useState(urlId);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [multipleResults, setMultipleResults] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const performSearch = async (term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setIsLoading(true);
    setHasSearched(true);
    setActiveOrder(null);
    setMultipleResults([]);

    try {
      // 1. Try fetching exact order
      const single = await getOrderById(clean);
      if (single) {
        setActiveOrder(single);
      } else {
        // 2. Try searching by phone/email/prefix
        const results = await trackOrder(clean);
        if (results.length === 1) {
          setActiveOrder(results[0]);
        } else if (results.length > 1) {
          setMultipleResults(results);
        }
      }
    } catch (e) {
      console.error('Error during order search:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      setSearchInput(urlId);
      performSearch(urlId);
    }
  }, [urlId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryWa = settings.primaryWhatsApp || '233544911015';

  return (
    <div className="min-h-screen bg-bone pt-28 sm:pt-36 pb-24 font-sans gallery-canvas select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sand border border-stone-border font-mono text-[10px] uppercase tracking-ultra text-stone">
            <span>ATELIER DISPATCH TRACKER</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-ink">
            Track Your Order
          </h1>
          <p className="text-sm font-sans font-light text-stone-dark max-w-xl mx-auto leading-relaxed">
            Enter your Order Reference ID, Phone Number, or Email to view real-time production, packaging, and courier delivery status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1 font-mono">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. 9b1deb4d...) or Phone Number"
                className="w-full pl-11 pr-4 py-4 bg-sand border border-stone-border text-xs text-ink placeholder:text-stone focus:outline-none focus:border-ink"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-8 py-4 bg-ink text-bone font-mono text-xs uppercase tracking-ultra font-semibold hover:bg-clay hover:text-white transition-colors disabled:bg-stone-dark/50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>{isLoading ? 'SEARCHING...' : 'TRACK'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[10px] font-mono text-stone mt-2 text-center">
            Tip: Your Order Reference was shown on your order confirmation page and is linked on WhatsApp.
          </p>
        </div>

        {/* Multiple Orders Result List */}
        {multipleResults.length > 0 && !activeOrder && (
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-mono text-xs uppercase tracking-ultra font-bold text-ink">
              Found {multipleResults.length} Matching Orders:
            </h2>
            <div className="divide-y divide-stone-border bg-sand border border-stone-border">
              {multipleResults.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className="p-4 sm:p-6 hover:bg-bone/80 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-[11px] text-stone-dark">
                      {order.customer_name} · {order.items?.length || 0} Items · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-ink font-serif text-sm">
                      {formatPrice(order.total_amount)}
                    </span>
                    <button
                      type="button"
                      className="px-4 py-2 bg-ink text-bone text-[10px] uppercase tracking-ultra font-semibold hover:bg-clay transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Found Screen */}
        {hasSearched && !isLoading && !activeOrder && multipleResults.length === 0 && (
          <div className="max-w-md mx-auto p-12 bg-sand border border-stone-border text-center space-y-4 font-mono">
            <AlertCircle className="w-10 h-10 text-stone mx-auto" />
            <h3 className="text-base font-serif font-bold text-ink">No Order Record Found</h3>
            <p className="text-xs font-sans text-stone-dark leading-relaxed">
              We could not find an order matching &ldquo;{searchInput}&rdquo;. Please verify the Order ID or phone number.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${primaryWa}?text=${encodeURIComponent(
                  `Hello ST Clothing, I am trying to track my order with keyword: "${searchInput}". Could you please assist me?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white text-xs uppercase tracking-ultra font-semibold hover:bg-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Ask Atelier on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Active Order Details View */}
        {activeOrder && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 1. Header Card */}
            <div className="p-6 sm:p-8 bg-sand border border-stone-border space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-border/70">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-ultra text-stone">
                    ORDER REFERENCE
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-sm sm:text-base font-bold text-ink break-all select-all">
                      {activeOrder.id}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopyId(activeOrder.id)}
                      className="p-1 text-stone hover:text-ink transition-colors flex-shrink-0"
                      title="Copy Reference"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>{getStatusBadge(activeOrder.status)}</div>
              </div>

              {/* 2. Visual Step Progress Bar */}
              {activeOrder.status !== 'cancelled' ? (
                <div className="pt-4">
                  <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
                    {ORDER_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(activeOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-clay text-white ring-4 ring-clay/20 shadow-md'
                                : isCompleted
                                ? 'bg-ink text-bone'
                                : 'bg-bone border border-stone-border text-stone'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                          </div>
                          <span
                            className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-ultra ${
                              isCurrent ? 'font-bold text-clay' : isCompleted ? 'font-semibold text-ink' : 'text-stone'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 text-xs font-mono text-red-800">
                  This order was cancelled. Please reach out to our team if you need further clarification.
                </div>
              )}
            </div>

            {/* 3. Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
              {/* Customer & Delivery Information */}
              <div className="p-6 bg-sand border border-stone-border space-y-4">
                <h3 className="text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-clay" />
                  <span>Delivery Destination</span>
                </h3>

                <div className="space-y-2 text-xs text-stone-dark">
                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-stone block">RECIPIENT</span>
                    <p className="font-semibold text-ink">{activeOrder.customer_name}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-stone block">PHONE / WHATSAPP</span>
                    <p className="font-semibold text-ink">{activeOrder.customer_phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-stone block">EMAIL</span>
                    <p className="text-ink">{activeOrder.customer_email}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-stone block">DESTINATION ADDRESS</span>
                    <p className="text-ink font-sans leading-relaxed">{activeOrder.delivery_address}</p>
                  </div>

                  {activeOrder.notes && (
                    <div>
                      <span className="text-[10px] uppercase tracking-ultra text-stone block">DELIVERY NOTES</span>
                      <p className="text-stone-dark italic font-sans">{activeOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Metadata & Summary */}
              <div className="p-6 bg-sand border border-stone-border space-y-4">
                <h3 className="text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-clay" />
                  <span>Order Overview</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone uppercase text-[10px]">DATE PLACED</span>
                    <span className="font-medium text-ink">{formatDate(activeOrder.created_at)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone uppercase text-[10px]">DISPATCH ORIGIN</span>
                    <span className="text-ink">Tema Atelier, Ghana</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone uppercase text-[10px]">COURIER DISPATCH</span>
                    <span className="text-clay font-bold">DIRECT COURIER</span>
                  </div>

                  <div className="border-t border-stone-border pt-3 flex justify-between text-sm font-bold text-ink">
                    <span>TOTAL CHARGE</span>
                    <span className="text-base font-serif text-clay">{formatPrice(activeOrder.total_amount)}</span>
                  </div>
                </div>

                {/* Direct Support Actions */}
                <div className="pt-4 space-y-2">
                  <a
                    href={`https://wa.me/${primaryWa}?text=${encodeURIComponent(
                      `Hello ST Clothing Atelier, I am tracking Order ID: ${activeOrder.id} (${activeOrder.customer_name}). Could you please update me on delivery dispatch?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-700 text-white text-[10px] uppercase tracking-ultra font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Inquire with Atelier on WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${settings.primaryPhone || '0544911015'}`}
                    className="w-full py-2.5 bg-bone border border-stone-border text-ink text-[10px] uppercase tracking-ultra font-semibold hover:bg-sand transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone" />
                    <span>Call Direct Hotline</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Ordered Garment Items */}
            <div className="p-6 sm:p-8 bg-sand border border-stone-border space-y-4 font-mono">
              <h3 className="text-xs uppercase tracking-ultra font-bold text-ink border-b border-stone-border pb-3">
                ORDERED GARMENTS ({activeOrder.items?.length || 0})
              </h3>

              <div className="divide-y divide-stone-border/60">
                {(activeOrder.items || []).map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <div className="relative w-14 h-20 bg-bone flex-shrink-0 border border-stone-border overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover object-center"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone text-[9px]">
                          ST
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-semibold text-ink truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[10px] text-stone tracking-spec mt-0.5">
                        {item.size ? `Size: ${item.size}` : ''} {item.color ? `· Color: ${item.color}` : ''} · Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xs text-ink">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[9px] text-stone">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 font-mono text-xs pt-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-ink text-bone uppercase tracking-ultra font-semibold hover:bg-clay transition-colors text-center"
              >
                Browse The Collection
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActiveOrder(null);
                  setSearchInput('');
                  setHasSearched(false);
                }}
                className="px-8 py-3.5 bg-bone border border-stone-border text-ink uppercase tracking-ultra font-semibold hover:bg-sand transition-colors text-center"
              >
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
