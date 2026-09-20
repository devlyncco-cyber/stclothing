'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import { ProductGallery } from '@/components/product-gallery';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice, cn } from '@/lib/utils';
import { generateProductWhatsAppUrl, BRAND_CONFIG } from '@/lib/config/brand';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { Plus, Minus, Check, ShieldCheck, Truck, MessageCircle, ChevronDown, Sparkles, Info } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();
  const { settings } = useStoreSettings();

  // Extract available sizes & colors from variants
  const availableVariants = product.variants || [];

  const uniqueSizes = useMemo(() => {
    if (availableVariants.length > 0) {
      return Array.from(new Set(availableVariants.map((v) => v.size)));
    }
    return ['S', 'M', 'L', 'XL'];
  }, [availableVariants]);

  const uniqueColors = useMemo(() => {
    if (availableVariants.length > 0) {
      return Array.from(new Set(availableVariants.map((v) => v.color)));
    }
    return ['Noir', 'Bone', 'Clay'];
  }, [availableVariants]);

  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] || 'Noir');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'delivery' | 'sizing' | null>('details');

  // Find active variant stock
  const currentVariant = useMemo(() => {
    return availableVariants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
  }, [availableVariants, selectedSize, selectedColor]);

  const currentStock = currentVariant !== undefined ? currentVariant.stock_quantity : 15;
  const isOutOfStock = currentStock <= 0;

  // Build WhatsApp URL with live selected size, color, quantity and price
  const primaryWa = settings.primaryWhatsApp || '233544911015';
  const whatsAppOrderText = `Hello ${settings.storeName || 'ST Clothing'}, I want to order:
- Product: ${product.name}
- Size: ${selectedSize}
- Color: ${selectedColor}
- Qty: ${quantity}
- Price: GH₵ ${product.price * quantity}
- Link: https://stclothinggh.com/product/${product.slug}`;

  const whatsAppOrderUrl = `https://wa.me/${primaryWa}?text=${encodeURIComponent(whatsAppOrderText)}`;

  const whatsAppInquiryText = `Hello ${settings.storeName || 'ST Clothing'}, I am inquiring about: ${product.name} (https://stclothinggh.com/product/${product.slug})`;
  const whatsAppInquiryUrl = `https://wa.me/${primaryWa}?text=${encodeURIComponent(whatsAppInquiryText)}`;

  const handleAddToCart = () => {
    if (isOutOfStock || !settings.ordersEnabled || !settings.bagEnabled) return;
    setIsAdding(true);
    addItem(product, selectedSize, selectedColor, quantity);
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Left Column: Image Gallery (7 cols) */}
      <div className="lg:col-span-7">
        <ProductGallery images={product.images || []} productName={product.name} />
      </div>

      {/* Right Column: Product Details & Purchase Actions (5 cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-6 select-none">
        {/* Category & Origin Spec */}
        <div className="flex items-center justify-between border-b border-stone-border pb-3 font-mono text-[10px] uppercase tracking-ultra">
          <Link
            href={`/shop?category=${product.category?.slug || 'all'}`}
            className="text-stone hover:text-ink transition-colors font-semibold"
          >
            {product.category?.name || 'COLLECTION'} // TEMA
          </Link>
          <div className="flex gap-2">
            {product.new_arrival && (
              <span className="bg-sand text-ink px-2.5 py-0.5 border border-stone-border font-semibold">
                NEW DROP
              </span>
            )}
            {product.featured && (
              <span className="bg-ink text-bone px-2.5 py-0.5">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-ink leading-tight">
          {product.name}
        </h1>

        {/* Price in GH₵ */}
        <div className="flex items-center gap-3 font-mono">
          <span className="text-2xl sm:text-3xl font-semibold tracking-spec text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-lg text-stone line-through tracking-spec">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-sm font-sans font-light text-stone-dark leading-relaxed">
          {product.description}
        </p>

        <div className="border-t border-stone-border my-1" />

        {/* Color Selector */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between uppercase tracking-spec">
            <span className="font-semibold text-ink">Colorway:</span>
            <span className="text-stone">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'px-4 py-2 border text-xs uppercase tracking-spec transition-all duration-200',
                  selectedColor === color
                    ? 'border-ink bg-ink text-bone font-semibold'
                    : 'border-stone-border bg-sand hover:border-stone text-stone-dark'
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between uppercase tracking-spec">
            <span className="font-semibold text-ink">Select Size:</span>
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'sizing' ? null : 'sizing')}
              className="text-stone underline hover:text-ink text-[11px]"
            >
              Sizing Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'py-2.5 border text-xs uppercase tracking-spec font-semibold transition-all duration-200 text-center',
                  selectedSize === size
                    ? 'border-ink bg-ink text-bone'
                    : 'border-stone-border bg-sand hover:border-stone text-stone-dark'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="space-y-3 pt-2 font-mono">
          {!settings.ordersEnabled ? (
            /* SHOWCASE / CATALOG MODE NOTICE */
            <div className="space-y-3">
              <div className="p-4 bg-sand border border-stone-border space-y-2">
                <div className="flex items-center gap-2 text-ink font-semibold text-xs uppercase tracking-spec">
                  <Sparkles className="w-4 h-4 text-clay" />
                  <span>Showcase &amp; Archive Mode Active</span>
                </div>
                <p className="font-sans text-xs text-stone-dark leading-relaxed">
                  {settings.orderingDisabledNotice ||
                    'Online orders are temporarily paused for drop preparation. Showcase browsing active.'}
                </p>
              </div>

              {/* Inquire on WhatsApp */}
              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="INQUIRE"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-ink hover:bg-clay text-bone text-xs uppercase tracking-ultra font-semibold transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Inquire About This Piece on WhatsApp</span>
              </a>
            </div>
          ) : (
            /* ORDERING ENABLED MODE */
            <>
              {/* PRIMARY BUTTON: Order on WhatsApp */}
              <a
                href={whatsAppOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="WHATSAPP"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-ultra font-semibold shadow-md transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order on WhatsApp (GH₵ {product.price * quantity})</span>
              </a>

              {/* SECONDARY BUTTON: Add to Bag (if Bag is Enabled) */}
              {settings.bagEnabled && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-border bg-sand">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3 text-stone-dark hover:text-ink transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-2 text-xs font-semibold text-ink min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3 text-stone-dark hover:text-ink transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-sand border border-stone-border text-ink text-xs uppercase tracking-ultra font-semibold hover:border-ink transition-colors disabled:opacity-40"
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added to Bag</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>Out of Stock</span>
                    ) : (
                      <span>Add to Shopping Bag</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ghana Delivery & Payment Spec Box */}
        <div className="p-4 bg-sand border border-stone-border space-y-2 font-mono text-[11px] text-stone-dark">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Truck className="w-3.5 h-3.5 text-clay" />
            <span>{settings.city || 'Tema'} &amp; {settings.region || 'Greater Accra'} Delivery</span>
          </div>
          <p className="font-sans font-light leading-relaxed">
            {settings.deliveryInfo ||
              'Same-day or next-day courier delivery available in Tema, Accra, Spintex, and East Legon. Nationwide shipping in 2–3 business days.'}
          </p>
        </div>

        {/* Details Accordion */}
        <div className="border-t border-stone-border divide-y divide-stone-border font-mono text-xs">
          {/* Accordion 1: Fabric & Craftsmanship */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
              className="w-full flex items-center justify-between text-left uppercase tracking-spec font-semibold text-ink"
            >
              <span>Fabric &amp; Craftsmanship</span>
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-300', openAccordion === 'details' && 'rotate-180')}
              />
            </button>
            {openAccordion === 'details' && (
              <div className="pt-3 pb-1 text-stone-dark font-sans font-light text-xs leading-relaxed space-y-2 animate-fade-in">
                <p>
                  Cut and constructed with double-needle flatlock seams for structural permanence. Our cotton weaves are combed and pre-shrunk to retain their geometric boxy drape through repeated wear.
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  <li>100% High-Density Organic Fiber</li>
                  <li>Machine wash cold / Hang dry in shade</li>
                  <li>Drafted and tailored in {settings.city || 'Tema'}, {settings.country || 'Ghana'}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Accordion 2: Delivery & Mobile Money */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
              className="w-full flex items-center justify-between text-left uppercase tracking-spec font-semibold text-ink"
            >
              <span>Payment &amp; Delivery in {settings.country || 'Ghana'}</span>
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-300', openAccordion === 'delivery' && 'rotate-180')}
              />
            </button>
            {openAccordion === 'delivery' && (
              <div className="pt-3 pb-1 text-stone-dark font-sans font-light text-xs leading-relaxed space-y-2 animate-fade-in">
                <p>
                  {settings.paymentMethods ||
                    'We accept MTN Mobile Money, Telecel Cash, and Pay on Delivery within Greater Accra. You can finalize payment directly with the courier or via WhatsApp.'}
                </p>
              </div>
            )}
          </div>

          {/* Accordion 3: Sizing Guide */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'sizing' ? null : 'sizing')}
              className="w-full flex items-center justify-between text-left uppercase tracking-spec font-semibold text-ink"
            >
              <span>Sizing &amp; Posture Guide</span>
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-300', openAccordion === 'sizing' && 'rotate-180')}
              />
            </button>
            {openAccordion === 'sizing' && (
              <div className="pt-3 pb-1 text-stone-dark font-mono text-[11px] space-y-2 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 border border-stone-border p-2 bg-sand">
                  <div><strong>SIZE</strong></div>
                  <div><strong>CHEST (IN)</strong></div>
                  <div><strong>LENGTH (IN)</strong></div>
                  <div>S</div><div>38-40</div><div>28</div>
                  <div>M</div><div>42-44</div><div>29</div>
                  <div>L</div><div>46-48</div><div>30</div>
                  <div>XL</div><div>50-52</div><div>31</div>
                </div>
                <p className="font-sans text-xs">
                  Garments feature a tailored relaxed drop. For a true oversized look, order your standard size.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
