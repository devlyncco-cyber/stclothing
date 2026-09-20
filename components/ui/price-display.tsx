'use client';

import React from 'react';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { formatPrice } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  onRequestText?: string;
  hideIfDisabled?: boolean;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  className = '',
  onRequestText = 'Price on Request',
  hideIfDisabled = false,
}: PriceDisplayProps) {
  const { settings } = useStoreSettings();

  if (!settings.showPrices) {
    if (hideIfDisabled) return null;
    return (
      <span className={`text-stone-dark text-[11px] font-mono uppercase tracking-wider font-medium ${className}`}>
        {onRequestText}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 font-mono ${className}`}>
      <span className="font-semibold text-ink tracking-spec">
        {formatPrice(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-stone line-through tracking-spec">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
