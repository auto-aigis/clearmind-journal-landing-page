'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '../_components/AuthProvider';
import { AppShell } from '../_components/AppShell';

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.onboarding_complete && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [mounted, loading, user, router, pathname]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  if (!user.onboarding_complete && pathname !== '/onboarding') return null;

  return <AppShell>{children}</AppShell>;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </AuthProvider>
  );
}