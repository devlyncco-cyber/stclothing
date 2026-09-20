export const BRAND_CONFIG = {
  name: 'ST Clothing',
  handle: '@st_clothing_gh',
  tagline: 'Made for Tema. Worn everywhere.',
  location: {
    city: 'Tema',
    country: 'Ghana',
    region: 'Greater Accra',
    fullAddress: 'Tema, Greater Accra Region, Ghana',
    mapQuery: 'Tema,+Ghana',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Tema,+Ghana&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
  contacts: {
    primaryPhone: '0544911015',
    primaryPhoneDisplay: '054 491 1015',
    primaryPhoneIntl: '+233 54 491 1015',
    primaryWhatsAppUrl: 'https://wa.me/233544911015',
    primaryTelLink: 'tel:+233544911015',

    secondaryPhone: '0209300106',
    secondaryPhoneDisplay: '020 930 0106',
    secondaryPhoneIntl: '+233 20 930 0106',
    secondaryWhatsAppUrl: 'https://wa.me/233209300106',
    secondaryTelLink: 'tel:+233209300106',

    instagramHandle: '@st_clothing_gh',
    instagramUrl: 'https://instagram.com/st_clothing_gh',
    email: 'contact@stclothinggh.com', // Placeholder
  },
  currency: {
    code: 'GHS',
    symbol: 'GH₵',
    format: (amount: number) => `GH₵ ${amount.toLocaleString('en-GH')}`,
  },
  hours: {
    weekdays: 'Monday – Saturday: 9:00 AM – 7:00 PM GMT',
    sunday: 'Sunday: Closed / WhatsApp Inquiries Only',
  },
  delivery: {
    locations: 'Tema, Spintex, East Legon, Accra Central, and Nationwide Ghana',
    paymentMethods: 'Mobile Money (MTN MoMo, Telecel Cash), Bank Transfer, Pay on Delivery (Greater Accra)',
    deliveryTime: 'Same-day or next-day delivery in Tema & Greater Accra; 2–3 business days nationwide.',
  },
  accentColor: {
    name: 'Clay',
    hex: '#B5532F',
    // Easily swappable per collection: e.g. '#5B6356' (Olive), '#414C5E' (Cobalt), '#A65B47' (Terracotta)
  },
};

/**
 * Generate a prefilled WhatsApp order URL for an individual product
 */
export function generateProductWhatsAppUrl(params: {
  productName: string;
  size: string;
  color?: string;
  quantity: number;
  price: number;
  productSlug: string;
  phone?: string;
}): string {
  const phone = params.phone || '233544911015';
  const currentOrigin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || '');
  const productUrl = currentOrigin ? `${currentOrigin}/product/${params.productSlug}` : `/product/${params.productSlug}`;
  
  const text = `Hello ST Clothing, I'd like to order:
Product: ${params.productName}
Size: ${params.size}${params.color ? `\nColor: ${params.color}` : ''}
Qty: ${params.quantity}
Price: GH₵ ${params.price * params.quantity}
Link: ${productUrl}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a prefilled WhatsApp checkout URL for an entire shopping bag
 */
export function generateCartWhatsAppUrl(items: Array<{
  name: string;
  size: string;
  color?: string;
  quantity: number;
  price: number;
}>, total: number, phone = '233544911015'): string {
  const itemsList = items
    .map((item, idx) => `${idx + 1}. ${item.name} (Size: ${item.size}${item.color ? `, ${item.color}` : ''}) x${item.quantity} — GH₵ ${item.price * item.quantity}`)
    .join('\n');

  const text = `Hello ST Clothing, I would like to place an order:

${itemsList}

Total: GH₵ ${total}
Delivery Location: [Please specify your location in Tema/Accra/Ghana]
Payment Method: [Mobile Money / Pay on Delivery]`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
