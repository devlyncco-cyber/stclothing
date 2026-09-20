'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function AdminSetupRedirect() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) {
        router.replace('/admin/admins');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [isAdmin, isLoading, router]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 sm:px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-amber-400">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-base font-bold uppercase tracking-wider text-white">
            Temporal Sign-Up Disabled
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Public temporal admin signup has been decommissioned. New administrator accounts must now be created directly by an existing logged-in administrator via the <strong>Admin Team Console</strong>.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/login"
            className="w-full py-3 px-4 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Proceed to Admin Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
