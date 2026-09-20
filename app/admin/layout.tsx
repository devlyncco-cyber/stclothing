'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminUIProvider, useAdminUI } from '@/lib/context/admin-ui-context';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const { mobileSidebarOpen, closeMobileSidebar } = useAdminUI();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthExemptPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin && !isAuthExemptPage) {
        router.push('/admin/login');
      } else if (isAdmin && pathname === '/admin/login') {
        router.push('/admin');
      }
    }
  }, [isAdmin, isLoading, isAuthExemptPage, pathname, router]);

  if (isAuthExemptPage) {
    return <div className="min-h-screen bg-neutral-950 text-white font-sans">{children}</div>;
  }

  // If user is already verified as admin, render immediately without waiting for background sync
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-100 text-neutral-900 flex font-sans">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            Authenticating Admin...
          </span>
        </div>
      </div>
    );
  }

  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminUIProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminUIProvider>
  );
}
