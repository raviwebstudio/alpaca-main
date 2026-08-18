import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Boxes,
  ArrowUpRight,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  Ticket,
} from 'lucide-react';
import { formatPrice } from '@/lib/storefront';
import { getAnalyticsSummary } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const analytics = getAnalyticsSummary();

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatPrice(analytics.totalRevenue),
      subtext: `${analytics.totalOrders} lifetime orders`,
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      subtext: `${analytics.ordersByStatus['PLACED'] || 0} placed / ${analytics.ordersByStatus['DELIVERED'] || 0} delivered`,
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      label: 'Catalog Products',
      value: analytics.totalProducts,
      subtext: `${analytics.totalInventoryUnits} total stock units`,
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Active Customers',
      value: analytics.totalCustomers,
      subtext: `Avg Order ${formatPrice(analytics.averageOrderValue)}`,
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Storefront Dashboard</h1>
          <p className="text-sm text-[#78716C] mt-1">
            GitHub Content Store: <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-700">content/</span> • Pages CMS ready
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://pagescms.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Pages CMS
            <ExternalLink size={14} />
          </a>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8956C] text-white text-sm font-medium hover:bg-[#b5835c] transition shadow-xs"
          >
            <Plus size={16} />
            New Product
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1917] text-white text-sm font-medium hover:bg-black transition shadow-xs"
          >
            View Live Store
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {analytics.lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-amber-900 font-semibold text-sm">
                {analytics.lowStockCount} inventory items below threshold
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                Some product variants require restocking to prevent stockouts on storefront.
              </p>
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[#E0D8D0] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#78716C]">
                    {kpi.label}
                  </p>
                  <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-2">
                    {kpi.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl border ${kpi.color}`}>
                  <Icon size={22} />
                </div>
              </div>
              <p className="text-xs text-[#78716C] mt-4 pt-3 border-t border-stone-100 font-medium">
                {kpi.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent Orders & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E0D8D0] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1C1917]">Recent Customer Orders</h2>
              <p className="text-xs text-[#78716C] mt-0.5">Committed to content/orders/ and synced with Google Sheets</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#C8956C] hover:underline flex items-center gap-1"
            >
              View All ({analytics.totalOrders}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {analytics.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                      No orders found yet. Orders placed on the storefront will appear here.
                    </td>
                  </tr>
                ) : (
                  analytics.recentOrders.map((order) => {
                    const status = (order.orderStatus || 'PLACED').toUpperCase();
                    return (
                      <tr key={order.orderId} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-[#1C1917] text-xs">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#1C1917] text-xs">{order.customer?.name || 'Customer'}</p>
                          <p className="text-[11px] text-stone-500">{order.customer?.phone || ''}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-stone-600">
                          {order.items?.length || 1} item(s)
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#1C1917] text-xs">
                          {formatPrice(order.total || 0)}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="font-mono uppercase text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                            {order.paymentMethod || 'UPI'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide inline-flex items-center gap-1 ${
                              status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status === 'DELIVERED' ? (
                              <CheckCircle2 size={12} />
                            ) : status === 'SHIPPED' ? (
                              <Truck size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Navigation & Store Health */}
        <div className="space-y-6">
          {/* Quick Management Links */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#1C1917]">Management Shortcuts</h2>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-[#C8956C] hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">Products</p>
                    <p className="text-xs text-stone-500">Edit variants, pricing & SEO</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C8956C]">&rarr;</span>
              </Link>

              <Link
                href="/admin/inventory"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-[#C8956C] hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Boxes size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">Inventory Control</p>
                    <p className="text-xs text-stone-500">Instant SKU & stock updates</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C8956C]">&rarr;</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-[#C8956C] hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">Coupons</p>
                    <p className="text-xs text-stone-500">Discounts & promo rules</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C8956C]">&rarr;</span>
              </Link>

              <Link
                href="/admin/customers"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-[#C8956C] hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">Customers</p>
                    <p className="text-xs text-stone-500">Order history & addresses</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#C8956C]">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Category Distribution Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#1C1917]">Category Breakdown</h2>
            <div className="space-y-3">
              {analytics.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-xs">
                  <span className="capitalize font-medium text-stone-700">{cat.category}</span>
                  <span className="font-semibold text-[#1C1917] bg-stone-100 px-2 py-0.5 rounded">
                    {cat.count} products
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
