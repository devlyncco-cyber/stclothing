'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLookbooks, deleteLookbook, updateLookbook, getProducts } from '@/lib/data/store';
import { Lookbook, Product } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { formatPrice } from '@/lib/utils';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export default function AdminLookbooksPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Delete modal state
  const [deleteModalItem, setDeleteModalItem] = useState<Lookbook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [lbs, prods] = await Promise.all([
      getLookbooks({ publishedOnly: false }),
      getProducts({ publishedOnly: false }),
    ]);
    setLookbooks(lbs);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublished = async (lookbook: Lookbook) => {
    const updated = await updateLookbook(lookbook.id, {
      published: !lookbook.published,
    });
    if (updated) {
      setLookbooks((prev) =>
        prev.map((l) => (l.id === lookbook.id ? { ...l, published: !lookbook.published } : l))
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    const success = await deleteLookbook(deleteModalItem.id);
    setIsDeleting(false);
    if (success) {
      setLookbooks((prev) => prev.filter((l) => l.id !== deleteModalItem.id));
      setDeleteModalItem(null);
    }
  };

  const filteredLookbooks = lookbooks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.featured_product_name && item.featured_product_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.published) ||
      (statusFilter === 'draft' && !item.published);

    return matchesSearch && matchesStatus;
  });

  const publishedCount = lookbooks.filter((l) => l.published).length;
  const withProductCount = lookbooks.filter((l) => l.featured_product_id || l.featured_product_name).length;

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader
        title="Editorial Lookbooks"
        actionHref="/admin/lookbooks/new"
        actionLabel="New Lookbook Spread"
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
                Total Spreads
              </p>
              <p className="text-2xl font-black tracking-tight text-neutral-900 mt-1">{lookbooks.length}</p>
            </div>
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-neutral-700">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
                Live on Storefront
              </p>
              <p className="text-2xl font-black tracking-tight text-neutral-900 mt-1">{publishedCount}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
                Linked Products
              </p>
              <p className="text-2xl font-black tracking-tight text-neutral-900 mt-1">{withProductCount}</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lookbooks by title, volume, subtitle..."
                className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 border border-neutral-200 p-1 bg-neutral-50 text-xs">
              {(['all', 'published', 'draft'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 uppercase font-medium tracking-wider text-[11px] transition-colors ${
                    statusFilter === tab
                      ? 'bg-black text-white font-semibold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'published' ? 'Published' : 'Drafts'}
                </button>
              ))}
            </div>

            {/* Live Lookbook link */}
            <Link
              href="/lookbook"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <span>View Live Lookbook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Lookbooks Grid / Cards */}
        {loading ? (
          <div className="p-16 bg-white border border-neutral-200 text-center">
            <div className="inline-block w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Loading lookbooks...</p>
          </div>
        ) : filteredLookbooks.length === 0 ? (
          <div className="p-16 bg-white border border-neutral-200 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-sm uppercase font-bold tracking-widest text-neutral-800">No Lookbooks Found</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'Create your first editorial lookbook spread to showcase your Tema streetwear collections.'}
            </p>
            <Link
              href="/admin/lookbooks/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4" />
              <span>Create Lookbook Spread</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLookbooks.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200 shadow-sm flex flex-col overflow-hidden group hover:border-neutral-400 transition-all"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="bg-black/90 backdrop-blur-sm text-white text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 font-bold">
                      {item.vol}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 font-bold">
                      Order #{item.sort_order ?? idx + 1}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(item)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-colors ${
                        item.published
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-900'
                      }`}
                      title="Toggle Visibility"
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {item.subtitle && (
                      <p className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
                        {item.subtitle}
                      </p>
                    )}
                    <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Featured Product Tag */}
                  {(item.featured_product_name || item.featured_product_id) && (
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="font-semibold truncate max-w-[170px]">
                          {item.featured_product_name || 'Featured Product'}
                        </span>
                      </div>
                      {item.featured_product_price !== null && item.featured_product_price !== undefined && (
                        <span className="font-mono font-bold text-neutral-900 text-[11px]">
                          {formatPrice(Number(item.featured_product_price))}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/lookbooks/${item.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Spread</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteModalItem(item)}
                      className="p-2 border border-neutral-300 text-neutral-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
                      title="Delete lookbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-300 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                    Delete Lookbook Spread?
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-black">"{deleteModalItem.title}"</span> ({deleteModalItem.vol})? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalItem(null)}
                  className="px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:border-black font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Lookbook'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
