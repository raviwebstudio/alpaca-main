'use client';

import { useState } from 'react';
import { Eye, Search, X } from 'lucide-react';
import { formatPrice } from '@/lib/storefront';

export default function OrderListClient({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const tabs = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter(o => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!o.id.toLowerCase().includes(q) && !o.customer?.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
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
            placeholder="Search ID or Email..." 
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
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Sub / Total</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-[#1C1917]">#{order.id.substring(0, 8)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-[#1C1917]">{order.customer?.profile?.firstName || 'Unknown'} {order.customer?.profile?.lastName || ''}</div>
                  <div className="text-xs text-stone-500">{order.customer?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#78716C]">{order.items?.length || 0} items</td>
                <td className="px-6 py-4">
                  <div className="text-xs text-[#78716C]">{formatPrice(order.subtotal ?? 0)}</div>
                  <div className="text-sm font-medium text-[#1C1917]">{formatPrice(order.total ?? 0)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#78716C]">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-2 text-stone-400 hover:text-[#C8956C] transition-colors rounded-lg hover:bg-stone-100 inline-flex items-center">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E0D8D0] flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#1C1917]">Order #{selectedOrder.id.substring(0, 8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">Delivery Address</h3>
                  <div className="bg-stone-50 rounded-xl p-4 border border-[#E0D8D0]">
                    <p className="font-medium text-[#1C1917]">{selectedOrder.address?.fullName}</p>
                    <p className="text-sm text-[#78716C] mt-1">{selectedOrder.address?.line1}</p>
                    {selectedOrder.address?.line2 && <p className="text-sm text-[#78716C]">{selectedOrder.address.line2}</p>}
                    <p className="text-sm text-[#78716C]">{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.pincode}</p>
                    <p className="text-sm text-[#78716C] mt-2">Phone: {selectedOrder.address?.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">Update Status</h3>
                  <div className="bg-stone-50 rounded-xl p-4 border border-[#E0D8D0] flex flex-col gap-3">
                    <select 
                      className="border border-[#E0D8D0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8956C] w-full"
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <div className="text-xs text-stone-500 mt-1">Status changes are applied immediately.</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">Order Items</h3>
                <div className="border border-[#E0D8D0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 border-b border-[#E0D8D0]">
                      <tr>
                        <th className="px-4 py-3 font-medium text-stone-500">Item</th>
                        <th className="px-4 py-3 font-medium text-stone-500">Variant</th>
                        <th className="px-4 py-3 font-medium text-stone-500">Qty</th>
                        <th className="px-4 py-3 font-medium text-stone-500 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {selectedOrder.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 font-medium text-[#1C1917]">{item.product?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 text-stone-500">{item.size || '-'} / {item.color || '-'}</td>
                          <td className="px-4 py-3 text-stone-500">{item.quantity}</td>
                          <td className="px-4 py-3 text-[#1C1917] text-right">{formatPrice(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-stone-50 p-4 border-t border-[#E0D8D0] flex justify-end">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-stone-500">Subtotal: {formatPrice(selectedOrder.subtotal ?? 0)}</div>
                      <div className="text-sm text-stone-500">Shipping: {formatPrice(selectedOrder.shippingCharge ?? 0)}</div>
                      <div className="text-sm text-stone-500">Discount: {formatPrice(selectedOrder.discount ?? 0)}</div>
                      <div className="text-base font-bold text-[#1C1917] mt-2">Total: {formatPrice(selectedOrder.total ?? 0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
