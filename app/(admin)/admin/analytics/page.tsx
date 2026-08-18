import { getAnalyticsSummary } from "@/lib/content";
import { formatPrice } from "@/lib/storefront";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Package,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  BarChart3,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const analytics = getAnalyticsSummary();

  const fulfillmentRate =
    analytics.totalOrders > 0
      ? Math.round(
          (((analytics.ordersByStatus["DELIVERED"] || 0) +
            (analytics.ordersByStatus["SHIPPED"] || 0)) /
            analytics.totalOrders) *
            100
        )
      : 100;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Storefront Analytics</h1>
          <p className="text-sm text-[#78716C] mt-1">
            Real-time business performance derived from committed <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/orders/</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Gross Sales</p>
              <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-2">
                {formatPrice(analytics.totalRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <IndianRupee size={22} />
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100 font-medium">
            Across {analytics.totalOrders} total completed orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Average Order (AOV)</p>
              <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-2">
                {formatPrice(analytics.averageOrderValue)}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <TrendingUp size={22} />
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100 font-medium">
            Average basket size per customer checkout
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Fulfillment Rate</p>
              <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-2">
                {fulfillmentRate}%
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Truck size={22} />
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100 font-medium">
            Orders processed and in delivery pipeline
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Inventory Units</p>
              <h3 className="text-3xl font-serif font-bold text-[#1C1917] mt-2">
                {analytics.totalInventoryUnits}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
              <Package size={22} />
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100 font-medium">
            Across {analytics.totalProducts} catalog products
          </p>
        </div>
      </div>

      {/* Detailed Analysis Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917]">Order Status Pipeline</h2>
            <span className="text-xs font-semibold text-stone-500">{analytics.totalOrders} total</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
              const percent = analytics.totalOrders > 0 ? Math.round((count / analytics.totalOrders) * 100) : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                      {status === "DELIVERED" ? (
                        <CheckCircle2 size={13} className="text-emerald-600" />
                      ) : status === "SHIPPED" ? (
                        <Truck size={13} className="text-blue-600" />
                      ) : status === "CANCELLED" ? (
                        <XCircle size={13} className="text-red-600" />
                      ) : (
                        <Clock size={13} className="text-amber-600" />
                      )}
                      {status}
                    </span>
                    <span className="font-mono text-stone-500">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === "DELIVERED"
                          ? "bg-emerald-500"
                          : status === "SHIPPED"
                          ? "bg-blue-500"
                          : status === "CANCELLED"
                          ? "bg-red-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917]">Category Performance</h2>
            <span className="text-xs font-semibold text-stone-500">{analytics.categoryBreakdown.length} categories</span>
          </div>

          <div className="space-y-4">
            {analytics.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:bg-stone-50 transition">
                <div>
                  <p className="font-semibold text-xs text-[#1C1917] capitalize">{cat.category}</p>
                  <p className="text-[11px] text-stone-500">{cat.count} published products</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-[#1C1917]">{formatPrice(cat.revenue)}</p>
                  <p className="text-[10px] text-stone-500">Tracked sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
