'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types/database';
import { ProductCard } from '@/components/product-card';
import { SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopContent({ initialProducts, categories }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [onlyNew, setOnlyNew] = useState<boolean>(initialFilter === 'new');

  useEffect(() => {
    const cat = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');

    if (cat) setSelectedCategory(cat);
    if (filter === 'new') setOnlyNew(true);
    if (search) setSearchTerm(search);
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    // New arrivals filter
    if (onlyNew) {
      list = list.filter((p) => p.new_arrival);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      // 'newest' default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [initialProducts, selectedCategory, onlyNew, searchTerm, sortBy]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setOnlyNew(false);
    setSearchTerm('');
    setSortBy('newest');
    router.replace('/shop', { scroll: false });
  };

  return (
    <div className="space-y-10">
      {/* Filters & Sorting Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-sand border border-stone-border font-mono text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'px-3.5 py-1.5 uppercase tracking-spec border transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-ink text-bone border-ink font-semibold'
                : 'bg-bone text-stone-dark border-stone-border hover:border-ink hover:text-ink'
            )}
          >
            All ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                'px-3.5 py-1.5 uppercase tracking-spec border transition-all duration-200',
                selectedCategory === cat.slug
                  ? 'bg-ink text-bone border-ink font-semibold'
                  : 'bg-bone text-stone-dark border-stone-border hover:border-ink hover:text-ink'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right Side: Sorting & Quick Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* New Arrivals Toggle */}
          <button
            type="button"
            onClick={() => setOnlyNew(!onlyNew)}
            className={cn(
              'px-3 py-1.5 uppercase tracking-spec border transition-colors',
              onlyNew
                ? 'bg-clay text-white border-clay font-semibold'
                : 'bg-bone text-stone-dark border-stone-border hover:border-ink'
            )}
          >
            New Drops Only
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-bone border border-stone-border px-3 py-1.5 text-stone-dark">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-ink uppercase tracking-spec focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory !== 'all' || onlyNew || searchTerm) && (
        <div className="flex items-center justify-between pb-2 font-mono text-xs border-b border-stone-border">
          <div className="flex items-center gap-2 text-stone">
            <span>Showing {filteredProducts.length} results</span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 bg-sand text-ink uppercase tracking-spec">
                Category: {selectedCategory}
              </span>
            )}
            {onlyNew && (
              <span className="px-2 py-0.5 bg-sand text-ink uppercase tracking-spec">
                New Arrivals
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-0.5 bg-sand text-ink uppercase tracking-spec">
                Search: &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-stone underline hover:text-ink text-[11px] uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Gallery Wall Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-sand border border-stone-border">
          <h3 className="font-serif text-xl uppercase tracking-wider font-semibold text-ink">
            No garments match your filter
          </h3>
          <p className="text-xs font-mono text-stone max-w-sm mx-auto">
            Try adjusting your search criteria or explore our complete Tema catalog.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-ink text-bone font-mono text-xs uppercase tracking-ultra hover:bg-clay hover:text-white transition-colors"
          >
            Show All Pieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
