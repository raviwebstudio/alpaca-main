'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/storefront';

export default function SellerListClient({ sellers }: { sellers: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') === 'pending' ? 'PENDING' : 'ALL';
  
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  const tabs = ['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'];

  const filteredSellers = sellers.filter(s => {
    if (filter !== 'ALL' && s.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.storeName.toLowerCase().includes(q) && !s.user?.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this seller as ${status}?`)) {
      await fetch(`/api/admin/sellers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-[#E0D8D0] flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === t ? 'bg-[#1C1917] text-white' : 'bg-white border border-[#E0D8D0] text-[#78716C] hover:bg-stone-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search store or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E0D8D0] rounded-xl text-sm focus:outline-none focus:border-[#C8956C]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-6 py-4 font-medium">Store</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Products</th>
              <th className="px-6 py-4 font-medium">GMV / Rate</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredSellers.map(seller => (
              <tr key={seller.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                      {seller.storeLogo ? <img src={seller.storeLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-stone-400 font-medium">{seller.storeName.charAt(0)}</span>}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1C1917]">{seller.storeName}</div>
                      <div className="text-xs text-stone-500">/{seller.storeSlug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-[#1C1917]">{seller.user?.profile?.firstName}</div>
                  <div className="text-stone-500 text-xs">{seller.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    seller.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    seller.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {seller.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#78716C]">{seller._count.products}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-[#1C1917]">{formatPrice(seller.totalEarnings)}</div>
                  <div className="text-xs text-stone-500">{seller.commissionRate}% comm.</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#78716C]">
                  {new Date(seller.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {seller.status !== 'APPROVED' && (
                      <button onClick={() => handleStatusUpdate(seller.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {seller.status !== 'SUSPENDED' && (
                      <button onClick={() => handleStatusUpdate(seller.id, 'SUSPENDED')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend">
                        <AlertCircle size={18} />
                      </button>
                    )}
                    {seller.status === 'PENDING' && (
                      <button onClick={() => handleStatusUpdate(seller.id, 'REJECTED')} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors" title="Reject">
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
