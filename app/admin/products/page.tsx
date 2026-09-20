'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, deleteProduct, updateProduct, getCategories } from '@/lib/data/store';
import { Product, Category } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal state
  const [deleteModalProduct, setDeleteModalProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      getProducts({ publishedOnly: false }),
      getCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublished = async (product: Product) => {
    const updated = await updateProduct(product.id, {
      published: !product.published,
    });
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, published: !product.published } : p))
      );
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updated = await updateProduct(product.id, {
      featured: !product.featured,
    });
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: !product.featured } : p))
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalProduct) return;
    setIsDeleting(true);
    const success = await deleteProduct(deleteModalProduct.id);
    setIsDeleting(false);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteModalProduct.id));
      setDeleteModalProduct(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader
        title="Product Inventory"
        actionHref="/admin/products/new"
        actionLabel="Add Product"
      />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search garments by name or slug..."
              className="w-full bg-neutral-50 border border-neutral-300 pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-white border border-neutral-300 text-xs uppercase tracking-wider px-3 py-2.5 focus:outline-none focus:border-black"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-neutral-300 text-xs uppercase tracking-wider px-3 py-2.5 focus:outline-none focus:border-black"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Added</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      No garments match the current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const primaryImg =
                      product.images?.find((img) => img.is_primary)?.image_url ||
                      product.images?.[0]?.image_url ||
                      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80';

                    const totalStock =
                      product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) ?? 0;

                    return (
                      <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 bg-neutral-100 flex-shrink-0 border border-neutral-200">
                              <Image
                                src={primaryImg}
                                alt={product.name}
                                fill
                                className="object-cover object-center"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="font-bold text-neutral-900 hover:text-black uppercase tracking-wider line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <span className="text-[10px] text-neutral-400 font-mono block">
                                /{product.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 uppercase tracking-wider text-[11px] text-neutral-600">
                          {product.category?.name || 'Uncategorized'}
                        </td>

                        <td className="py-3 px-4 font-semibold text-neutral-900">
                          {formatPrice(product.price)}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block font-mono font-semibold px-2 py-0.5 text-[10px] ${
                              totalStock <= 0
                                ? 'bg-red-100 text-red-700'
                                : totalStock <= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {totalStock} units
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleTogglePublished(product)}
                            className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                              product.published
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                            }`}
                            title="Click to toggle status"
                          >
                            {product.published ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-neutral-400" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product)}
                            className={`p-1 transition-colors ${
                              product.featured ? 'text-amber-500' : 'text-neutral-300 hover:text-neutral-500'
                            }`}
                            title="Toggle Featured on Homepage"
                          >
                            <Sparkles className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-neutral-500">{formatDate(product.created_at)}</td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              target="_blank"
                              className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 text-neutral-600 hover:text-black transition-colors"
                              title="Edit Garment"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteModalProduct(product)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                              title="Delete Garment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Delete */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-6 shadow-2xl border border-neutral-200 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-900">
                  Delete Product Confirmation
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-black">{deleteModalProduct.name}</strong>? This action will remove its variants and associated storage images.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="px-4 py-2 bg-white border border-neutral-300 text-xs uppercase tracking-widest text-neutral-700 hover:border-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
