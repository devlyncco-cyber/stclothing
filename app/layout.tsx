import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { AuthProvider } from '@/lib/context/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { SmoothScrollProvider } from '@/components/motion/smooth-scroll-provider';
import { MagneticCursor } from '@/components/motion/magnetic-cursor';
import { WhatsAppFloatingButton } from '@/components/whatsapp-floating-button';
import { BRAND_CONFIG } from '@/lib/config/brand';

import { StoreSettingsProvider } from '@/lib/context/store-settings-context';

export const metadata: Metadata = {
  title: {
    default: 'ST Clothing — Made for Tema. Worn Everywhere. (Ghana)',
    template: '%s | ST Clothing (Tema, Ghana)',
  },
  description:
    'ST Clothing (@st_clothing_gh) is a modern minimalist fashion brand based in Tema, Ghana. Featuring heavyweight organic staples, tailored silhouettes, and direct WhatsApp ordering.',
  keywords: [
    'ST Clothing',
    'ST Clothing Ghana',
    'Tema fashion brand',
    'Ghanaian fashion',
    'minimalist clothing Ghana',
    'luxury essentials Tema',
    'heavyweight tees Ghana',
    '@st_clothing_gh',
  ],
  authors: [{ name: 'ST Clothing Atelier, Tema' }],
  metadataBase: new URL('https://stclothinggh.com'),
  openGraph: {
    title: 'ST Clothing — Made for Tema. Worn Everywhere.',
    description: 'Contemporary minimalist clothing brand from Tema, Ghana (@st_clothing_gh).',
    siteName: 'ST Clothing',
    type: 'website',
    locale: 'en_GH',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'ST Clothing Atelier Tema Lookbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ST Clothing (Tema, Ghana)',
    description: 'Made for Tema. Worn everywhere. Minimalist luxury apparel.',
  },
};

export const viewport: Viewport = {
  themeColor: '#F4F1EA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness Schema for Google SEO & local search in Tema, Ghana
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'ST Clothing',
    alternateName: 'ST Clothing Ghana',
    description: 'Modern editorial clothing brand based in Tema, Ghana.',
    url: 'https://stclothinggh.com',
    telephone: [BRAND_CONFIG.contacts.primaryPhoneIntl, BRAND_CONFIG.contacts.secondaryPhoneIntl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: BRAND_CONFIG.location.city,
      addressRegion: BRAND_CONFIG.location.region,
      addressCountry: 'GH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '5.6698',
      longitude: '-0.0166',
    },
    sameAs: [BRAND_CONFIG.contacts.instagramUrl],
    priceRange: 'GH₵GH₵',
    currenciesAccepted: 'GHS',
    paymentAccepted: 'Mobile Money, Cash on Delivery, Card',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-bone text-ink min-h-screen flex flex-col font-sans selection:bg-ink selection:text-bone antialiased overflow-x-hidden">
        <AuthProvider>
          <StoreSettingsProvider>
            <CartProvider>
              <SmoothScrollProvider>
                <MagneticCursor />
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
                <CartDrawer />
                <WhatsAppFloatingButton />
              </SmoothScrollProvider>
            </CartProvider>
          </StoreSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
