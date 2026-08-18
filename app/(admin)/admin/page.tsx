import Link from 'next/link';
import { Package, ShoppingBag, Users, IndianRupee, AlertTriangle, Boxes, ArrowUpRight, ExternalLink, Plus, CheckCircle2, Clock, Truck, Ticket, TrendingUp, Activity } from 'lucide-react';
import { formatPrice } from '@/lib/storefront';
import { getAnalyticsSummary } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const analytics = getAnalyticsSummary();
  const ordersByDay = analytics.ordersByDay || [];
  const maxOrders = Math.max(...ordersByDay.map((item: any) => Number(item.orders || 0)), 1);
  const topProducts = (analytics.topProducts || []).slice(0, 5);
  const lowStockProducts = (analytics.lowStockProducts || []).slice(0, 5);

  const kpis = [
    { label: 'Total Revenue', value: formatPrice(analytics.totalRevenue), subtext: `${analytics.totalOrders} lifetime orders`, icon: IndianRupee },
    { label: 'Total Orders', value: analytics.totalOrders, subtext: `${analytics.ordersByStatus?.['PLACED'] || 0} placed / ${analytics.ordersByStatus?.['DELIVERED'] || 0} delivered`, icon: ShoppingBag },
    { label: 'Catalog Products', value: analytics.totalProducts, subtext: `${analytics.totalInventoryUnits} total stock units`, icon: Package },
    { label: 'Active Customers', value: analytics.totalCustomers, subtext: `Avg Order ${formatPrice(analytics.averageOrderValue)}`, icon: Users },
  ];

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-[#E0D8D0] bg-white p-6 shadow-xs">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A07859]">ALPAZA / Store overview</p>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1C1917]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#78716C]">Your GitHub-backed commerce control center.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="https://pagescms.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Pages CMS <ExternalLink size={14} />
          </a>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-[#C8956C] px-4 py-2 text-sm font-medium text-white hover:bg-[#B5835C]"><Plus size={16} /> New Product</Link>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-[#1C1917] px-4 py-2 text-sm font-medium text-white hover:bg-black">Live Store <ArrowUpRight size={14} /></Link>
        </div>
      </section>

      {analytics.lowStockCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-amber-100 p-2 text-amber-700"><AlertTriangle size={19} /></div><div><p className="text-sm font-semibold text-amber-900">{analytics.lowStockCount} inventory items need attention</p><p className="mt-0.5 text-xs text-amber-700">Review low-stock variants before they sell out.</p></div></div>
          <Link href="/admin/inventory" className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-900">Manage Inventory</Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => { const Icon = kpi.icon; return <div key={kpi.label} className="rounded-2xl border border-[#E0D8D0] bg-white p-5 shadow-xs"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">{kpi.label}</p><h3 className="mt-2 text-2xl font-serif font-bold text-[#1C1917]">{kpi.value}</h3></div><div className="rounded-xl border border-[#E8D8C7] bg-[#FFF8F1] p-2.5 text-[#A07859]"><Icon size={19} /></div></div><p className="mt-4 border-t border-stone-100 pt-3 text-xs font-medium text-[#78716C]">{kpi.subtext}</p></div>; })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-2xl border border-[#E0D8D0] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">Performance</p><h2 className="mt-1 text-lg font-serif font-bold text-[#1C1917]">Orders over time</h2></div><span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-medium text-stone-600"><Activity size={12} /> GitHub content</span></div>
          <div className="mt-7 flex h-44 items-end gap-2 sm:gap-4">
            {ordersByDay.map((item: any, index: number) => <div key={`${item.date}-${index}`} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="group relative flex flex-1 items-end"><div className="w-full rounded-t-lg bg-[#C8956C] transition hover:bg-[#A97854]" style={{ height: `${Math.max((Number(item.orders || 0) / maxOrders) * 100, Number(item.orders || 0) ? 8 : 2)}%` }} /><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#1C1917] px-2 py-1 text-[10px] text-white group-hover:block">{item.orders} orders</span></div><span className="text-center text-[9px] text-stone-400">{item.label || item.date}</span></div>)}
            {ordersByDay.length === 0 && <div className="flex w-full items-center justify-center text-sm text-stone-500">No order trend data yet.</div>}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E0D8D0] bg-[#1C1917] p-6 text-white shadow-xs"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C8956C]">Store health</p><h2 className="mt-1 text-xl font-serif">At a glance</h2><div className="mt-6 space-y-3"><div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-sm text-white/70"><Package size={15} /> Products</span><span className="font-semibold">{analytics.totalProducts}</span></div><div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-sm text-white/70"><Boxes size={15} /> Stock units</span><span className="font-semibold">{analytics.totalInventoryUnits}</span></div><div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-sm text-white/70"><AlertTriangle size={15} /> Low stock</span><span className="font-semibold text-[#E8B990]">{analytics.lowStockCount}</span></div><div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-sm text-white/70"><TrendingUp size={15} /> AOV</span><span className="font-semibold">{formatPrice(analytics.averageOrderValue)}</span></div></div></section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E0D8D0] bg-white shadow-xs overflow-hidden"><div className="flex items-center justify-between border-b border-[#E0D8D0] p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">Merchandising</p><h2 className="mt-1 text-lg font-serif font-bold text-[#1C1917]">Top-selling products</h2></div><Link href="/admin/products" className="text-xs font-semibold text-[#A07859] hover:underline">View products →</Link></div><div className="divide-y divide-stone-100">{topProducts.map((product: any, index: number) => <div key={product.id || product.slug || index} className="flex items-center justify-between px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600">{index + 1}</span><div className="min-w-0"><p className="truncate text-sm font-medium text-[#1C1917]">{product.name || product.title}</p><p className="text-[11px] text-stone-500">{product.sold ?? product.unitsSold ?? 0} units sold</p></div></div><span className="text-sm font-semibold text-[#1C1917]">{formatPrice(product.revenue || 0)}</span></div>)}{topProducts.length === 0 && <p className="p-8 text-center text-sm text-stone-500">Sales data will appear after orders are recorded.</p>}</div></section>

        <section className="rounded-2xl border border-[#E0D8D0] bg-white shadow-xs overflow-hidden"><div className="flex items-center justify-between border-b border-[#E0D8D0] p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">Inventory</p><h2 className="mt-1 text-lg font-serif font-bold text-[#1C1917]">Low-stock products</h2></div><Link href="/admin/inventory" className="text-xs font-semibold text-[#A07859] hover:underline">Manage →</Link></div><div className="divide-y divide-stone-100">{lowStockProducts.map((product: any, index: number) => <div key={product.id || product.slug || index} className="flex items-center justify-between px-5 py-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-lg bg-amber-50 p-2 text-amber-700"><Boxes size={15} /></div><div className="min-w-0"><p className="truncate text-sm font-medium text-[#1C1917]">{product.name || product.title}</p><p className="text-[11px] text-stone-500">{product.sku || 'SKU not set'}</p></div></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${Number(product.stock ?? product.quantity ?? 0) <= 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{product.stock ?? product.quantity ?? 0} left</span></div>)}{lowStockProducts.length === 0 && <p className="p-8 text-center text-sm text-stone-500">No low-stock products.</p>}</div></section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E0D8D0] bg-white shadow-xs"><div className="flex items-center justify-between border-b border-[#E0D8D0] p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78716C]">Orders</p><h2 className="mt-1 text-lg font-serif font-bold text-[#1C1917]">Recent customer orders</h2></div><Link href="/admin/orders" className="text-xs font-semibold text-[#A07859] hover:underline">View all ({analytics.totalOrders}) →</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-stone-200 bg-stone-50 text-[10px] font-semibold uppercase tracking-wider text-[#78716C]"><th className="px-5 py-3">Order ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-stone-100">{analytics.recentOrders?.map((order: any) => { const status = String(order.orderStatus || 'PLACED').toUpperCase(); return <tr key={order.orderId} className="hover:bg-stone-50/60"><td className="px-5 py-4 font-mono text-xs font-medium">{order.orderId}</td><td className="px-5 py-4"><p className="text-xs font-medium">{order.customer?.name || 'Customer'}</p><p className="text-[11px] text-stone-500">{order.customer?.phone || ''}</p></td><td className="px-5 py-4 text-xs text-stone-600">{order.items?.length || 1}</td><td className="px-5 py-4 text-xs font-semibold">{formatPrice(order.total || 0)}</td><td className="px-5 py-4"><span className="rounded bg-stone-100 px-2 py-1 font-mono text-[10px] uppercase">{order.paymentMethod || 'UPI'}</span></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{status === 'DELIVERED' ? <CheckCircle2 size={11} /> : status === 'SHIPPED' ? <Truck size={11} /> : <Clock size={11} />}{status}</span></td></tr>; })}{(!analytics.recentOrders || analytics.recentOrders.length === 0) && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-500">No orders found yet.</td></tr>}</tbody></table></div></section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Link href="/admin/products" className="rounded-xl border border-[#E0D8D0] bg-white p-4 text-center text-sm font-semibold hover:bg-stone-50"><Package className="mx-auto mb-2 text-[#A07859]" size={19} />Products</Link><Link href="/admin/inventory" className="rounded-xl border border-[#E0D8D0] bg-white p-4 text-center text-sm font-semibold hover:bg-stone-50"><Boxes className="mx-auto mb-2 text-[#A07859]" size={19} />Inventory</Link><Link href="/admin/orders" className="rounded-xl border border-[#E0D8D0] bg-white p-4 text-center text-sm font-semibold hover:bg-stone-50"><ShoppingBag className="mx-auto mb-2 text-[#A07859]" size={19} />Orders</Link><Link href="/admin/coupons" className="rounded-xl border border-[#E0D8D0] bg-white p-4 text-center text-sm font-semibold hover:bg-stone-50"><Ticket className="mx-auto mb-2 text-[#A07859]" size={19} />Coupons</Link></section>
    </div>
  );
}
