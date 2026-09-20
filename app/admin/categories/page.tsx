'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCategories, createCategory } from '@/lib/data/store';
import { Category } from '@/types/database';
import { AdminHeader } from '@/components/admin/admin-header';
import { slugify } from '@/lib/utils';
import { Plus, Tags, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const newCat = await createCategory({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        sort_order: categories.length + 1,
      });

      setSuccessMsg(`Category "${newCat.name}" created successfully.`);
      setName('');
      setSlug('');
      setSlugEdited(false);
      setDescription('');
      setImageUrl('');
      loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader title="Category Management" />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form to Add Category (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black border-b border-neutral-200 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Knitwear & Sweaters"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  placeholder="knitwear-and-sweaters"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this collection segment..."
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Category...' : 'Add Category'}
              </button>
            </form>
          </div>

          {/* Existing Categories List (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-black flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  <span>Existing Categories ({categories.length})</span>
                </h2>
              </div>
            </div>

            <div className="divide-y divide-neutral-200">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-neutral-50/60 transition-colors">
                  {cat.image_url ? (
                    <div className="relative w-16 h-16 bg-neutral-100 border border-neutral-200 flex-shrink-0 overflow-hidden">
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 flex-shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-black truncate">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                      Order #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
