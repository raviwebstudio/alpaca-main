'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Store, Tag, LogOut, UserCircle } from 'lucide-react';
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
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Sellers', href: '/admin/sellers', icon: Store },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'My Profile', href: '/admin/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-56 bg-[#1C1917] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white text-[22px] font-['Playfair_Display']">ALPACA</h1>
          <p className="text-[#C8956C] text-[10px] uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive
                    ? 'border-l-[3px] border-[#C8956C] text-[#C8956C] bg-[rgba(200,149,108,0.08)]'
                    : 'border-l-[3px] border-transparent text-white/50 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <header className="h-[60px] ml-56 bg-white border-b border-[#E0D8D0] flex items-center justify-between px-6">
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
      <main className="ml-56 p-6 min-h-[calc(100vh-60px)]">
        {authReady ? children : null}
      </main>
    </div>
  );
}
