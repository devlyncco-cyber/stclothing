import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/data/store';
import { ProductDetailClient } from './product-detail-client';
import { ProductCard } from '@/components/product-card';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Garment Not Found | ST Clothing Tema, Ghana',
    };
  }

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url;

  return {
    title: `${product.name} — ST Clothing (Tema, Ghana)`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — ST Clothing`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export const revalidate = 30;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const allProducts = await getProducts({ publishedOnly: true });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || true))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-bone pt-28 sm:pt-36 pb-24 font-sans gallery-canvas select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Main Product Details Client Component */}
        <ProductDetailClient product={product} />

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-stone-border">
            <div className="flex items-center justify-between mb-12 pb-4 border-b border-stone-border">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-ultra text-stone font-semibold block mb-1">
                  RECOMMENDATIONS // TEMA ATELIER
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-ink">
                  You May Also Like
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
