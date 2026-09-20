import React from 'react';

interface KenteStripProps {
  className?: string;
  height?: string;
}

/**
 * A thin, tasteful Kente-inspired geometric woven strip
 * rendered in the collection accent and sand palette.
 */
export function KenteStrip({ className = '', height = 'h-1.5' }: KenteStripProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${height} kente-woven-strip ${className}`}
    />
  );
}
