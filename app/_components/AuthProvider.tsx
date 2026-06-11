'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../_lib/api';
import type { User, Subscription } from '../_lib/types';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [userData, subData] = await Promise.all([authApi.me(), authApi.subscription()]);
      setUser({ ...userData, is_verified: Boolean(userData.is_verified), onboarding_complete: Boolean(userData.onboarding_complete) });
      setSubscription({ status: subData.status as 'active' | 'inactive', tier: subData.tier as 'free' | 'pro' | 'plus', current_period_end: subData.current_period_end, price_id: subData.price_id });
    } catch {
      setUser(null);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    setSubscription(null);
    router.push('/login');
  };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ user, subscription, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}