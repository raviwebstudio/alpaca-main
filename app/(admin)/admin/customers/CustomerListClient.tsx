'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/storefront';

export default function CustomerListClient({ customers }: { customers: any[] }) {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${c.profile?.firstName || ''} ${c.profile?.lastName || ''}`.toLowerCase();
    return c.email?.toLowerCase().includes(q) || name.includes(q) || c.phone?.includes(q);
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div>
      <div className="p-4 border-b border-[#E0D8D0]">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name, email, or phone..." 
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
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Total Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {customer.profile?.avatar ? (
                      <img src={customer.profile.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E0D8D0] text-[#1C1917] flex items-center justify-center font-medium">
                        {getInitials(customer.profile?.firstName, customer.profile?.lastName)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-[#1C1917]">{customer.profile?.firstName || 'Unknown'} {customer.profile?.lastName || ''}</div>
                      <div className="text-xs text-stone-500">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#78716C]">{customer.phone || '-'}</td>
                <td className="px-6 py-4 text-sm font-medium text-[#1C1917]">{customer.orderCount}</td>
                <td className="px-6 py-4 text-sm font-medium text-[#1C1917]">{formatPrice(customer.totalSpent)}</td>
                <td className="px-6 py-4 text-sm text-[#78716C]">
                  {new Date(customer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders?search=${customer.email}`} className="p-2 text-stone-400 hover:text-[#C8956C] transition-colors rounded-lg hover:bg-stone-100 inline-flex items-center" title="View Orders">
                    <ShoppingBag size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
