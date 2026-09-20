'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AdminAccount } from '@/lib/context/auth-context';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Users,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminTeamPage() {
  const { user, createAdminUser, getAdminAccounts, isDemoMode } = useAuth();

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoadingList(true);
    try {
      const data = await getAdminAccounts();
      setAdmins(data);
    } catch (e) {
      console.error('Error loading admins:', e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await createAdminUser(email, password, fullName);
      if (res.success) {
        setSuccess(`Administrator account for "${fullName}" (${email}) created successfully.`);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        await fetchAdmins();
      } else {
        setError(res.error || 'Failed to create administrator account.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full font-sans text-neutral-900">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono font-semibold block mb-1">
            EXECUTIVE TEAM &amp; PERMISSIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.15em] text-neutral-900 font-sans">
            Admin Team Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Authorized administrator console. Only existing admins can provision access for new studio managers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Admin: {user?.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create New Admin Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-neutral-900" />
              <span>Create New Admin</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-1 font-sans">
              Enter details to create an administrator login for your team member.
            </p>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-300 text-xs text-red-900 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                Admin Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ama Mensah"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                />
                <User className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                Admin Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ama@stclothing.com"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Initial Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 px-4 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting ? (
                <span>Creating Administrator...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Grant Admin Access</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Admins Roster (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-900" />
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-neutral-900">
                Active Administrators ({admins.length})
              </h2>
            </div>
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              Role: Executive Access
            </span>
          </div>

          {loadingList ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-400">
              Loading administrator roster...
            </div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No administrator accounts found.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {admins.map((admin) => (
                <div key={admin.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-sm">
                        {admin.full_name || 'Admin Member'}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono uppercase font-bold border border-neutral-200">
                        ADMIN
                      </span>
                      {admin.email === user?.email && (
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          (You)
                        </span>
                      )}
                    </div>
                    <span className="block font-mono text-xs text-neutral-500">
                      {admin.email}
                    </span>
                  </div>

                  <div className="text-right font-mono text-[11px] text-neutral-400">
                    <span>Created: {formatDate(admin.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Note */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600 font-sans">
            <ShieldAlert className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Security Protocol:</strong> Newly created admins can immediately log in at <code className="bg-neutral-200 px-1 py-0.5 text-neutral-900">/admin/login</code> with the email and password you provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
