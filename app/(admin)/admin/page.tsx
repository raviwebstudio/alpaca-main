import { db } from '@/lib/db';
import Link from 'next/link';
import { Package, ShoppingBag, Users, Store, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/storefront';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalProducts = await db.product.count();
  const totalOrders = await db.order.count();
  const totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } });
  const totalSellers = await db.user.count({ where: { role: 'SELLER' } });
  const pendingSellers = await db.sellerProfile.count({ where: { status: 'PENDING' } });
  const totalRevenue = await db.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: 'PAID' }
  });

  const recentOrders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { customer: { include: { profile: true } }, items: true }
  });

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag },
    { label: 'Customers', value: totalCustomers, icon: Users },
    { label: 'Sellers', value: totalSellers, icon: Store },
    { label: 'Revenue', value: formatPrice(totalRevenue._sum.total || 0), icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      {pendingSellers > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <p className="text-amber-800 font-medium">{pendingSellers} sellers awaiting approval</p>
          </div>
          <Link href="/admin/sellers?filter=pending" className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0D8D0]">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[#78716C] text-xs uppercase tracking-wide font-medium">{stat.label}</p>
                <div className="text-[#C8956C]">
                  <Icon size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-['Playfair_Display'] text-[#1C1917]">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/admin/products/new" className="bg-[#C8956C] hover:bg-[#B07D56] text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors shadow-soft">
          + Add Product
        </Link>
        <Link href="/admin/orders" className="bg-white border border-[#E0D8D0] text-[#1C1917] hover:bg-stone-50 rounded-full px-6 py-2.5 text-sm font-medium transition-colors shadow-soft">
          View Orders
        </Link>
        <Link href="/admin/sellers" className="bg-white border border-[#E0D8D0] text-[#1C1917] hover:bg-stone-50 rounded-full px-6 py-2.5 text-sm font-medium transition-colors shadow-soft">
          Manage Sellers
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0D8D0] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E0D8D0]">
          <h3 className="text-lg font-medium text-[#1C1917]">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-stone-500">No orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-[#1C1917]">#{order.id.substring(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#1C1917]">
                        {order.customer?.profile?.firstName} {order.customer?.profile?.lastName}
                      </div>
                      <div className="text-xs text-stone-500">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#78716C]">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1C1917]">{formatPrice(order.total)}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
