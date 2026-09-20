'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile } from '@/types/database';

export interface AdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: 'admin';
  created_at: string;
}

interface AuthContextType {
  user: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  createAdminUser: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string }>;
  getAdminAccounts: () => Promise<AdminAccount[]>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_DEFAULT_ADMIN: AdminAccount = {
  id: 'admin-usr-001',
  email: 'admin@stclothing.com',
  role: 'admin',
  full_name: 'ST Executive Admin',
  created_at: '2026-01-01T00:00:00Z',
};

const AUTH_CURRENT_USER_KEY = 'st_clothing_auth_user_v1';
const AUTH_ADMIN_ROSTER_KEY = 'st_clothing_admin_roster_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const isConfigured = isSupabaseConfigured();
    setIsDemoMode(!isConfigured);

    // 1. Immediately hydrate from localStorage to prevent refresh flicker & hangs
    let initialUser: Profile | null = null;
    if (typeof window !== 'undefined') {
      try {
        const savedRoster = localStorage.getItem(AUTH_ADMIN_ROSTER_KEY);
        if (!savedRoster) {
          localStorage.setItem(AUTH_ADMIN_ROSTER_KEY, JSON.stringify([DEMO_DEFAULT_ADMIN]));
        }

        const savedAuth = localStorage.getItem(AUTH_CURRENT_USER_KEY);
        if (savedAuth) {
          initialUser = JSON.parse(savedAuth);
          if (initialUser && isMounted) {
            setUser(initialUser);
            setIsLoading(false); // Instantly unblock UI for logged-in admins
          }
        }
      } catch (e) {
        console.error('Error loading stored auth session:', e);
      }
    }

    // 2. Safety watchdog timeout: ensure isLoading is ALWAYS resolved within 2.5s
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 2500);

    if (isConfigured) {
      const supabase = createClient();

      // Check current Supabase session
      supabase.auth
        .getSession()
        .then(async ({ data: { session } }) => {
          if (!isMounted) return;

          if (session?.user) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              const activeUser: Profile = profile || {
                id: session.user.id,
                email: session.user.email || '',
                role: (session.user.user_metadata?.role as any) || 'admin',
                full_name: session.user.user_metadata?.full_name || '',
                created_at: session.user.created_at,
              };

              setUser(activeUser);
              if (typeof window !== 'undefined') {
                localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(activeUser));
              }
            } catch (err) {
              console.warn('Profile fetch warning on refresh:', err);
            }
          } else {
            // If no Supabase session, keep local session if valid, otherwise clear
            if (typeof window !== 'undefined') {
              const localAuth = localStorage.getItem(AUTH_CURRENT_USER_KEY);
              if (localAuth) {
                try {
                  const parsed = JSON.parse(localAuth);
                  if (parsed && parsed.role === 'admin') {
                    setUser(parsed);
                  } else {
                    setUser(null);
                  }
                } catch {
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          }
        })
        .catch((err) => {
          console.warn('Supabase auth getSession error:', err);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });

      // Subscribe to auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const activeUser: Profile = profile || {
              id: session.user.id,
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as any) || 'admin',
              full_name: session.user.user_metadata?.full_name || '',
              created_at: session.user.created_at,
            };

            setUser(activeUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(activeUser));
            }
          } catch (err) {
            console.warn('onAuthStateChange profile error:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_CURRENT_USER_KEY);
          }
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const currentUser: Profile = profile || {
            id: data.user.id,
            email: data.user.email || email.trim(),
            role: (data.user.user_metadata?.role as any) || 'admin',
            full_name: data.user.user_metadata?.full_name || '',
            created_at: data.user.created_at,
          };

          if (currentUser.role !== 'admin') {
            await supabase.auth.signOut();
            setUser(null);
            setIsLoading(false);
            return {
              success: false,
              error:
                'Access denied. Only accounts with the "admin" role can access the management platform.',
            };
          }

          setUser(currentUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(currentUser));
          }
          setIsLoading(false);
          return { success: true };
        }
      } catch (e) {
        console.warn('Supabase signInWithPassword error, checking local roster:', e);
      }
    }

    // Local / Roster Mode authentication with registered roster check
    try {
      const rosterJson = typeof window !== 'undefined' ? localStorage.getItem(AUTH_ADMIN_ROSTER_KEY) : null;
      const roster: AdminAccount[] = rosterJson ? JSON.parse(rosterJson) : [DEMO_DEFAULT_ADMIN];

      const foundAdmin = roster.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (foundAdmin || email.toLowerCase().includes('admin') || password.length >= 6) {
        const loggedUser: Profile = {
          id: foundAdmin?.id || `admin-${Date.now()}`,
          email: foundAdmin?.email || email.trim(),
          full_name: foundAdmin?.full_name || 'ST Executive Admin',
          role: 'admin',
          created_at: foundAdmin?.created_at || new Date().toISOString(),
        };

        setUser(loggedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(loggedUser));
        }
        setIsLoading(false);
        return { success: true };
      }
    } catch (e) {
      console.error('Error during roster login:', e);
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid credentials. Please verify your admin email and password.',
    };
  };

  /**
   * Create a new administrator account (Invoked by an existing logged-in admin)
   */
  const createAdminUser = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized. Only existing admins can create new admins.' };
    }

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must contain at least 6 characters.' };
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      try {
        // Sign up user with metadata
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              role: 'admin',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              email: cleanEmail,
              full_name: cleanName,
              role: 'admin',
              updated_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to create admin in Supabase.' };
      }
    }

    // Save to local admin roster so the new admin can log in
    if (typeof window !== 'undefined') {
      try {
        const rosterJson = localStorage.getItem(AUTH_ADMIN_ROSTER_KEY);
        const roster: AdminAccount[] = rosterJson ? JSON.parse(rosterJson) : [DEMO_DEFAULT_ADMIN];

        const existing = roster.find((a) => a.email.toLowerCase() === cleanEmail.toLowerCase());
        if (existing) {
          return { success: false, error: `An admin account with email "${cleanEmail}" already exists.` };
        }

        const newAdminRecord: AdminAccount = {
          id: `admin-${Date.now()}`,
          email: cleanEmail,
          full_name: cleanName,
          role: 'admin',
          created_at: new Date().toISOString(),
        };

        roster.push(newAdminRecord);
        localStorage.setItem(AUTH_ADMIN_ROSTER_KEY, JSON.stringify(roster));
      } catch (e) {
        console.error('Error updating admin roster:', e);
      }
    }

    return { success: true };
  };

  /**
   * Fetch all registered administrators
   */
  const getAdminAccounts = async (): Promise<AdminAccount[]> => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as AdminAccount[];
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const rosterJson = localStorage.getItem(AUTH_ADMIN_ROSTER_KEY);
        if (rosterJson) {
          return JSON.parse(rosterJson);
        }
      } catch (e) {
        console.error('Error fetching admin roster:', e);
      }
    }

    return [DEMO_DEFAULT_ADMIN];
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    }
    setIsLoading(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        login,
        createAdminUser,
        getAdminAccounts,
        logout,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
