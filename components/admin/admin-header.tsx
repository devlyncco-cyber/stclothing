'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, Plus } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { useAdminUI } from '@/lib/context/admin-ui-context';

interface AdminHeaderProps {
  title: string;
  onOpenMobileSidebar?: () => void;
  actionHref?: string;
  actionLabel?: string;
}

export function AdminHeader({
  title,
  onOpenMobileSidebar,
  actionHref,
  actionLabel,
}: AdminHeaderProps) {
  const { user } = useAuth();
  const { openMobileSidebar } = useAdminUI();

  const handleOpen = onOpenMobileSidebar || openMobileSidebar;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-8 py-4 flex items-center justify-between font-sans">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleOpen}
          className="lg:hidden p-1.5 text-neutral-700 hover:text-black"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold uppercase tracking-[0.15em] text-neutral-900 font-sans">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{actionLabel}</span>
          </Link>
        )}

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
}
