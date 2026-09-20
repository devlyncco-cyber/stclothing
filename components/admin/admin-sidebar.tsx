'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Tags,
  ExternalLink,
  LogOut,
  Shield,
  Layers,
  Users,
  UserPlus,
  Sliders,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isDemoMode } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { label: 'Lookbooks', href: '/admin/lookbooks', icon: BookOpen },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: Tags },
    { label: 'Store Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Admins & Team', href: '/admin/admins', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-white flex flex-col justify-between border-r border-neutral-800 transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top brand */}
        <div>
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-[0.25em] uppercase text-white font-sans">
                  ST CLOTHING
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mt-0.5 font-mono">
                Admin Console
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
          </div>

          {/* Mode banner if demo */}
          {isDemoMode && (
            <div className="mx-4 mt-4 px-3 py-2 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 tracking-wider">
              <span className="font-semibold text-neutral-200 uppercase block">Local Preview Mode</span>
              Supabase connected on env setup.
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors rounded-none',
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-black' : 'text-neutral-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom user & storefront link */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Live Store
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <span className="text-[11px] font-semibold text-white truncate block">
                {user?.full_name || 'Admin User'}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono truncate block">
                {user?.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-400 p-1 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
