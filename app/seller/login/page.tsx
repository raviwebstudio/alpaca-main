'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInLocal } from '@/lib/localAuth';

export default function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (signInLocal('seller', email, password)) {
      router.push('/seller/dashboard');
      return;
    }

    setError('Invalid seller credentials.');
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-['Playfair_Display'] text-3xl font-serif text-[#1C1917]">ALPACA</h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#78716C]">Seller Login</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-colors focus:border-[#C8956C]" placeholder="seller@alpaca.com" disabled={loading} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition-colors focus:border-[#C8956C]" placeholder="Password" disabled={loading} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1C1917] py-3 font-medium text-white transition-colors hover:bg-black disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-[#78716C]">
          <Link href="/admin/login" className="hover:text-[#1C1917]">Admin Login</Link>
          <Link href="/login" className="hover:text-[#1C1917]">User Login</Link>
        </div>
      </div>
    </main>
  );
}
