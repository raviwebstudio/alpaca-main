'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  UserCircle,
  ExternalLink,
} from 'lucide-react';
import { readAdminProfile } from '@/lib/adminProfile';
import { clearLocalSession, hasLocalRole } from '@/lib/localAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('Alpaca');
  const [email, setEmail] = useState('admin@alpaca.com');
  const [phone, setPhone] = useState('+91 9999999999');

  useEffect(() => {
    const syncProfile = () => {
      const profile = readAdminProfile();
      const name = `${profile.firstName} ${profile.lastName}`.trim() || profile.username || 'Alpaca';
      setProfileName(name);
      setEmail(profile.email);
      setPhone(profile.phone);
    };

    syncProfile();
    window.addEventListener('storage', syncProfile);
    window.addEventListener('alpaca-admin-profile-updated', syncProfile);

    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('alpaca-admin-profile-updated', syncProfile);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthReady(true);
      return;
    }

    if (!hasLocalRole('admin')) {
      router.replace('/admin/login');
      return;
    }

    setAuthReady(true);
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    clearLocalSession();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-[#1C1917] flex flex-col z-30">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-white text-[22px] font-['Playfair_Display'] tracking-wider">ALPAZA</h1>
            <p className="text-[#C8956C] text-[10px] uppercase tracking-widest mt-0.5">Content Admin</p>
          </div>
          <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded font-mono">v2.0</span>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#C8956C] text-white font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="my-2 border-t border-white/10 pt-2 px-1">
            <a
              href="https://pagescms.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Pages CMS (GitHub)
              </span>
              <ExternalLink size={12} />
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors w-full text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <header className="h-[64px] ml-60 bg-white border-b border-[#E0D8D0] flex items-center justify-between px-8 sticky top-0 z-20 shadow-xs">
        <h2 className="text-[#1C1917] font-medium text-lg capitalize">
          {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
        </h2>

        <div className="relative flex items-center gap-3">
          <span className="text-sm text-[#78716C]">{email}</span>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="w-8 h-8 rounded-full bg-[#C8956C] text-white flex items-center justify-center text-sm font-medium"
            aria-expanded={profileOpen}
            aria-label="Open admin profile"
          >
            {profileName?.[0]?.toUpperCase() || 'A'}
            {profileName?.split(' ')[1]?.[0]?.toUpperCase() || ''}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-64 rounded-lg border border-[#E0D8D0] bg-white p-4 shadow-xl z-50 text-left">
              <div style={{ borderBottom: '1px solid #E0D8D0', marginBottom: '8px', paddingBottom: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#1C1917' }}>
                  Admin: {profileName}
                </p>
                <p style={{ fontSize: '12px', color: '#78716C' }}>Email: {email}</p>
                <p style={{ fontSize: '12px', color: '#78716C' }}>Phone: {phone}</p>
              </div>

              <Link href="/admin/profile"
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'block', padding: '8px 12px',
                  borderRadius: '8px', fontSize: '13px',
                  color: '#1C1917', textDecoration: 'none',
                  marginBottom: '4px',
                  background: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F2EDE8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ✏️ Edit Profile
              </Link>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="mt-2 w-full rounded-md bg-[#1C1917] px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-60 p-8 min-h-[calc(100vh-64px)]">
        {authReady ? children : null}
      </main>
    </div>
  );
}
