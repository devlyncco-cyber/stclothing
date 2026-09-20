'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getCategories, updateProduct } from '@/lib/data/store';
import { Category, Product } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { ImageUploader, UploadedImageItem } from '@/components/admin/image-uploader';
import { slugify } from '@/lib/utils';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VariantInput {
  id?: string;
  size: string;
  color: string;
  stock_quantity: number;
  sku?: string;
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [comparePrice, setComparePrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prod, cats] = await Promise.all([
        getProductById(productId),
        getCategories(),
      ]);

      setCategories(cats);

      if (prod) {
        setProduct(prod);
        setName(prod.name);
        setSlug(prod.slug);
        setDescription(prod.description);
        setPrice(prod.price);
        setComparePrice(prod.compare_at_price || '');
        setCategoryId(prod.category_id || (cats[0]?.id || ''));
        setPublished(prod.published);
        setFeatured(prod.featured);
        setNewArrival(prod.new_arrival);

        if (prod.images && prod.images.length > 0) {
          setImages(
            prod.images.map((img) => ({
              id: img.id,
              image_url: img.image_url,
              storage_path: img.storage_path || undefined,
              alt_text: img.alt_text || '',
              is_primary: img.is_primary,
              sort_order: img.sort_order,
            }))
          );
        }

        if (prod.variants && prod.variants.length > 0) {
          setVariants(
            prod.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              stock_quantity: v.stock_quantity,
              sku: v.sku || '',
            }))
          );
        } else {
          setVariants([
            { size: 'M', color: 'Noir Black', stock_quantity: 10, sku: 'SKU-001' },
          ]);
        }
      } else {
        setErrorMsg('Product could not be found.');
      }
      setLoading(false);
    }

    if (productId) {
      load();
    }
  }, [productId]);

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: 'L',
        color: 'Noir Black',
        stock_quantity: 10,
        sku: `GAR-VAR-${prev.length + 1}`,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSavedSuccess(false);

    try {
      const updated = await updateProduct(productId, {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        price: Number(price),
        compare_at_price: comparePrice ? Number(comparePrice) : null,
        category_id: categoryId || null,
        published,
        featured,
        new_arrival: newArrival,
        images,
        variants,
      });

      if (updated) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      setErrorMsg(err.message || 'Failed to update product in database.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Loading Product Details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader title={`Edit: ${product?.name || 'Garment'}`} />

      <main className="p-4 sm:p-8 space-y-8 max-w-5xl w-full">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Inventory
          </Link>

          {product && (
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="text-xs uppercase tracking-widest text-neutral-600 hover:text-black underline underline-offset-4"
            >
              View on Storefront ↗
            </Link>
          )}
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Product updated successfully and synced with Supabase!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Info */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  Compare At Price ($ USD Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) =>
                    setComparePrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-2 font-medium">
                  Garment Description & Fabric Specifications
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 2. Photography */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3">
              2. Photography & Gallery (Supabase Storage)
            </h2>
            <ImageUploader images={images} onChange={setImages} productId={productId} />
          </div>

          {/* 3. Variants & Stock */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black">
                3. Size & Color Inventory Matrix
              </h2>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-900 hover:text-neutral-500 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center bg-neutral-50 p-3 border border-neutral-200"
                >
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">Size</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={v.stock_quantity}
                      onChange={(e) =>
                        handleVariantChange(idx, 'stock_quantity', Number(e.target.value))
                      }
                      className="w-full bg-white border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                    />
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">SKU</label>
                      <input
                        type="text"
                        value={v.sku || ''}
                        onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                        className="w-full bg-white border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 font-mono"
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Publication Settings */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3">
              4. Publication Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-900 block">
                    Published
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Visible to customers in storefront.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-900 block">
                    Featured
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Highlighted on the homepage carousel.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-900 block">
                    New Arrival
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Displays &quot;NEW&quot; badge in store.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 text-xs uppercase tracking-widest hover:border-black"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Product Updates'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
