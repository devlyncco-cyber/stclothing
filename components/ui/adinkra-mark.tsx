import React from 'react';

interface AdinkraMarkProps {
  className?: string;
  size?: number;
}

/**
 * A minimalist, modern Adinkra-inspired decorative mark (Duafe / Beauty & Care motif),
 * used sparingly as a quiet accent on the gallery canvas.
 */
export function AdinkraMark({ className = 'text-stone-dark', size = 20 }: AdinkraMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}
