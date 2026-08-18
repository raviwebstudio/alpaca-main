'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearLocalSession, hasLocalRole } from '@/lib/localAuth';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/seller/login') {
      setReady(true);
      return;
    }

    if (!hasLocalRole('seller')) {
      router.replace('/seller/login');
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (pathname === '/seller/login') return <>{children}</>;

  const logout = () => {
    clearLocalSession();
    router.push('/seller/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="flex h-16 items-center justify-between border-b border-[#E0D8D0] bg-white px-6">
        <Link href="/seller/dashboard" className="font-['Playfair_Display'] text-xl text-[#1C1917]">ALPACA Seller</Link>
        <nav className="flex items-center gap-5 text-sm text-[#78716C]">
          <Link href="/seller/dashboard" className="hover:text-[#1C1917]">Dashboard</Link>
          <Link href="/seller/products" className="hover:text-[#1C1917]">Products</Link>
          <Link href="/seller/orders" className="hover:text-[#1C1917]">Orders</Link>
          <button onClick={logout} className="rounded-full bg-[#1C1917] px-4 py-2 text-white">Logout</button>
        </nav>
      </header>
      <main className="p-6">{ready ? children : null}</main>
    </div>
  );
}
