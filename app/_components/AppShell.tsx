'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, FileText, BarChart2, CreditCard, Settings, LogOut,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from './AuthProvider';

interface NavItem { href: string; label: string; icon: ReactNode }

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { href: '/journal', label: 'Journal', icon: <FileText className="w-5 h-5" /> },
  { href: '/history', label: 'History', icon: <BarChart2 className="w-5 h-5" /> },
  { href: '/pricing', label: 'Upgrade', icon: <CreditCard className="w-5 h-5" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const handleLogout = async () => { await logout(); };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'fixed inset-0 z-50' : 'hidden md:flex'} flex-col w-64 bg-white border-r border-gray-200 min-h-screen`}>
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900">ClearMind</Link>
        {mobile && <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === item.href ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  if (!user && !loading) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex"><Sidebar /></div>
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <Sidebar mobile />
        </>
      )}
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 flex items-center h-14 px-4 bg-white border-b border-gray-200 md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 mr-2 text-gray-600"><Menu className="w-5 h-5" /></button>
          <span className="text-lg font-semibold text-gray-900">ClearMind</span>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}