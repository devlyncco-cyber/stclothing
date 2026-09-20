'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isDemoMode } = useAuth();

  const [email, setEmail] = useState(isDemoMode ? 'admin@stclothing.com' : '');
  const [password, setPassword] = useState(isDemoMode ? 'admin123' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 sm:px-6 py-12 font-sans">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-[0.3em] uppercase text-white font-sans">
              ST CLOTHING
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
            <Shield className="w-4 h-4 text-white" />
            <span>Executive Admin Portal</span>
          </div>
        </div>

        {/* Demo Mode helper card */}
        {isDemoMode && (
          <div className="bg-neutral-900 border border-neutral-800 p-4 text-xs text-neutral-300 space-y-1">
            <p className="font-semibold text-white uppercase tracking-wider">Demo / Preview Mode Active</p>
            <p className="text-neutral-400 text-[11px]">
              Pre-filled with demo credentials: <strong>admin@stclothing.com</strong> / <strong>admin123</strong>. Connect your Supabase project in <code className="text-neutral-300">.env.local</code> to enable live Supabase Auth.
            </p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stclothing.com"
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-600 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
                <Lock className="w-4 h-4 text-neutral-600 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-white text-black text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Return Link */}
        <div className="text-center text-xs tracking-widest uppercase text-neutral-400">
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
