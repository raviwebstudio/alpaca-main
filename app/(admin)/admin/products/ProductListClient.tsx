'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/storefront';

export default function ProductListClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredProducts = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const handleFeaturedToggle = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      router.refresh();
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-[#E0D8D0] flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E0D8D0] rounded-xl text-sm focus:outline-none focus:border-[#C8956C]"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E0D8D0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#C8956C] bg-white"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="PAUSED">Paused</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredProducts.map(product => {
              const images = JSON.parse(product.images || '[]');
              const firstImage = images[0] || 'https://via.placeholder. value/48';
              
              return (
                <tr key={product.id} className="hover:bg-stone-50/50">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={firstImage} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-[#1C1917]">{product.name}</div>
                        <div className="text-xs text-[#78716C]">/{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#78716C]">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-sm text-[#78716C]">{product.seller?.storeName || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1C1917]">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-[#78716C]">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      product.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                      product.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleFeaturedToggle(product.id, product.isFeatured)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        product.isFeatured ? 'bg-[#C8956C]' : 'bg-stone-200'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        product.isFeatured ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-2 text-stone-400 hover:text-[#C8956C] transition-colors rounded-lg hover:bg-stone-100">
                        <Pencil size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors rounded-lg hover:bg-stone-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
