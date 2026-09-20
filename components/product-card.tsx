'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { generateProductWhatsAppUrl } from '@/lib/config/brand';
import { MessageCircle, Plus, Check } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCart();
  const { settings } = useStoreSettings();

  // Compute stock across variants
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) ??
    (product.total_stock !== undefined ? product.total_stock : 15);

  const isSoldOut = totalStock <= 0;

  // Images
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images.find((img) => !img.is_primary)?.image_url || product.images[1]?.image_url
      : primaryImage;

  const defaultVariant = product.variants?.[0];
  const defaultSize = defaultVariant?.size || 'M';
  const defaultColor = defaultVariant?.color || 'Noir';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !settings.ordersEnabled || !settings.bagEnabled) return;

    addItem(product, defaultSize, defaultColor, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 500);
  };

  return (
    <div
      className="group relative flex flex-col font-sans select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container: No borders or heavy shadows — pure gallery wall canvas */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand block">
        <Link
          href={`/product/${product.slug}`}
          data-cursor="EXAMINE"
          className="relative w-full h-full block"
        >
          {/* Subtle Edition Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
            {isSoldOut ? (
              <span className="bg-ink text-bone font-mono text-[9px] uppercase font-bold tracking-spec px-2 py-0.5">
                ARCHIVED
              </span>
            ) : product.new_arrival ? (
              <span className="bg-bone/95 text-ink border border-stone-border font-mono text-[9px] uppercase font-semibold tracking-spec px-2 py-0.5">
                NEW IN
              </span>
            ) : null}

            {product.compare_at_price && product.compare_at_price > product.price && !isSoldOut && (
              <span className="bg-clay text-white font-mono text-[9px] uppercase font-semibold tracking-spec px-2 py-0.5">
                SALE
              </span>
            )}
          </div>

          {/* Primary and secondary image crossfade transition */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-editorial group-hover:scale-105 ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {secondaryImage !== primaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate detail`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover object-center transition-all duration-700 ease-editorial group-hover:scale-105 absolute inset-0 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>
        </Link>

        {/* Action Bar sliding up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-bone/95 backdrop-blur-sm border-t border-stone-border opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center">
          {settings.ordersEnabled && settings.bagEnabled ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isSoldOut}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-ink text-bone font-mono text-[10px] uppercase tracking-spec font-semibold hover:bg-clay hover:text-white transition-colors disabled:opacity-40"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>QUICK ADD TO BAG</span>
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-sand text-ink border border-stone-border font-mono text-[10px] uppercase tracking-spec font-semibold hover:bg-ink hover:text-bone transition-colors"
            >
              <span>VIEW DETAILS</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Info Container: Clean typography with GH₵ price and serif title */}
      <div className="pt-3.5 pb-1 flex flex-col space-y-1">
        {/* Micro-label */}
        <span className="font-mono text-[9px] uppercase tracking-ultra text-stone">
          {product.category?.name || 'STUDIO PIECE'} // TEMA
        </span>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm sm:text-base font-serif tracking-tight font-normal text-ink group-hover:text-clay transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price in GH₵ */}
        <div className="flex items-center gap-2 font-mono text-xs pt-0.5">
          <span className="font-semibold text-ink tracking-spec">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-stone line-through tracking-spec">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
