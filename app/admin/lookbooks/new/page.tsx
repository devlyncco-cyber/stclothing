'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, createLookbook, uploadProductImage } from '@/lib/data/store';
import { Product } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Sparkles,
  Eye,
  BookOpen,
  Check,
} from 'lucide-react';

export default function AdminLookbookNewPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [vol, setVol] = useState('VOL. 04');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('COMMUNITY 1 ARCHIVE // TEMA');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
  );
  const [sortOrder, setSortOrder] = useState<number>(4);
  const [published, setPublished] = useState(true);

  // Featured Product Selection
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [featuredProductName, setFeaturedProductName] = useState('');
  const [featuredProductSlug, setFeaturedProductSlug] = useState('');
  const [featuredProductPrice, setFeaturedProductPrice] = useState<number | ''>('');

  useEffect(() => {
    getProducts({ publishedOnly: false }).then((prods) => {
      setProducts(prods);
    });
  }, []);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) {
      setFeaturedProductName('');
      setFeaturedProductSlug('');
      setFeaturedProductPrice('');
      return;
    }
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setFeaturedProductName(found.name);
      setFeaturedProductSlug(found.slug);
      setFeaturedProductPrice(found.price);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const uploaded = await uploadProductImage(file, 'lookbooks');
      setImageUrl(uploaded.imageUrl);
    } catch (err: any) {
      console.error('Lookbook image upload error:', err);
      setErrorMsg('Failed to upload image. Please try entering a direct image URL.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Lookbook title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Cover image URL is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief story/description for this editorial spread.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await createLookbook({
        vol: vol.trim() || 'VOL. 01',
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim(),
        image_url: imageUrl.trim(),
        featured_product_id: selectedProductId || null,
        featured_product_name: featuredProductName || null,
        featured_product_slug: featuredProductSlug || null,
        featured_product_price: featuredProductPrice !== '' ? Number(featuredProductPrice) : null,
        sort_order: Number(sortOrder) || 0,
        published,
      });

      router.push('/admin/lookbooks');
    } catch (err: any) {
      console.error('Error creating lookbook:', err);
      setErrorMsg(err.message || 'Failed to create lookbook spread.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader title="New Lookbook Spread" />

      <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/lookbooks"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lookbooks</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Info Card */}
            <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Spread Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                    Volume Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={vol}
                    onChange={(e) => setVol(e.target.value)}
                    placeholder="VOL. 04"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                    Subtitle / Location Archive
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. 35MM TEMA HARBOR ARCHIVE"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Lookbook Spread Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Industrial Dawn // Harbour City Heavyweights"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black focus:bg-white uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Editorial Story & Styling Concept *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Captured in the heart of Tema's industrial landscape, highlighting heavyweight fabrics and structured utilitarian fits..."
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1 font-mono">Lower numbers appear first.</p>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
                    />
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                      Publish Spread to Live Store
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Image Card */}
            <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Cover Visual & Media</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading Image...' : 'Upload Image File'}</span>
                  </button>
                  <span className="text-[11px] text-neutral-400 font-mono">PNG, JPG, WebP supported</span>
                </div>
              </div>
            </div>

            {/* Linked Featured Product Card */}
            <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Featured Product Tag (Optional)</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Link a garment from your catalogue so customers reading the lookbook can view and purchase it instantly.
              </p>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Select Product from Inventory
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                >
                  <option value="">-- No Featured Product Linked --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 bg-neutral-50 p-4 border border-neutral-200">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={featuredProductName}
                      onChange={(e) => setFeaturedProductName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Display Price (USD)
                    </label>
                    <input
                      type="number"
                      value={featuredProductPrice}
                      onChange={(e) => setFeaturedProductPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-white border border-neutral-300 px-2.5 py-1.5 text-xs font-mono text-neutral-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-black text-white text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Creating Lookbook Spread...' : 'Save & Publish Lookbook'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Side (5 cols) */}
          <div className="lg:col-span-5 sticky top-8 space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Live Storefront Preview
              </span>
              <span className="text-[10px] bg-neutral-200 px-2 py-0.5 text-neutral-700">Desktop Card</span>
            </div>

            {/* Mock Editorial Card */}
            <div className="bg-white border border-neutral-300 shadow-md overflow-hidden flex flex-col">
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title || 'Preview'}
                    fill
                    className="object-cover object-center"
                    sizes="400px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                    [No Image Provided]
                  </div>
                )}

                {/* Editorial Top Overlays */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/90 text-white text-[10px] uppercase font-mono tracking-widest px-3 py-1 font-bold">
                    {vol || 'VOL. 01'}
                  </span>
                </div>

                {!published && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-amber-500 text-black text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                      Draft (Hidden)
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                    {subtitle || '35MM ARCHIVE // TEMA'}
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-900 mt-1 leading-tight">
                    {title || 'Editorial Title Preview'}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">
                  {description ||
                    'Editorial description and background notes on the inspiration behind this collection spread...'}
                </p>

                {/* Featured Product Preview */}
                {(featuredProductName || selectedProductId) && (
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                        Featured Piece
                      </span>
                      <span className="text-xs font-bold uppercase text-neutral-900">
                        {featuredProductName || 'Garment Name'}
                      </span>
                    </div>
                    {featuredProductPrice !== '' && (
                      <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1">
                        {formatPrice(Number(featuredProductPrice))}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
