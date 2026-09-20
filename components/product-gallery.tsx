'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/database';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images && images.length > 0 ? images : [{ id: '1', product_id: '1', image_url: fallbackImage, sort_order: 1, is_primary: true }];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnail Strip (Vertical on Desktop, Horizontal on Mobile) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar py-1">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-neutral-100 overflow-hidden border transition-all duration-200',
                selectedIndex === idx
                  ? 'border-black ring-1 ring-black opacity-100'
                  : 'border-neutral-200 opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `${productName} preview ${idx + 1}`}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image Container */}
      <div className="relative flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden group">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-500"
        />

        {/* Previous / Next Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm text-black hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm text-black hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge for Mobile */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 tracking-widest sm:hidden">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>
    </div>
  );
}
