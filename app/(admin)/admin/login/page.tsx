'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEFAULT_ADMIN_PROFILE, readAdminProfile, saveAdminProfile } from '@/lib/adminProfile';
import { signInLocal } from '@/lib/localAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (signInLocal('admin', email, password)) {
      const existingProfile = readAdminProfile();
      saveAdminProfile({
        ...DEFAULT_ADMIN_PROFILE,
        ...existingProfile,
        email: 'admin@alpaca.com',
      });
      router.push('/admin/dashboard');
      return;
    }

    setError('Invalid admin credentials');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1C1917] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-serif mb-2 font-['Playfair_Display']">ALPACA</h1>
          <p className="text-stone-400 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-[rgba(200,149,108,0.3)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8956C] transition-colors"
              placeholder="admin@alpaca.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-[rgba(200,149,108,0.3)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8956C] transition-colors"
                placeholder="Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8956C] hover:bg-[#B07D56] disabled:opacity-50 text-white rounded-full py-3 font-medium transition-colors mt-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-stone-400">
          <Link href="/seller/login" className="hover:text-white">Seller Login</Link>
          <Link href="/login" className="hover:text-white">User Login</Link>
        </div>
      </div>
    </div>
  );
}
