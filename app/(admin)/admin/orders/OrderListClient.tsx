"use client";

import { useState } from "react";
import {
  Eye,
  Search,
  X,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileSpreadsheet,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/storefront";
import type { ContentOrder } from "@/lib/content";

interface OrderListClientProps {
  orders: ContentOrder[];
}

export function OrderListClient({ orders: initialOrders }: OrderListClientProps) {
  const [orders, setOrders] = useState<ContentOrder[]>(initialOrders);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ContentOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  const tabs = ["ALL", "PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const filteredOrders = orders.filter((o) => {
    const currentStatus = (o.orderStatus || "PLACED").toUpperCase();
    if (filter !== "ALL" && currentStatus !== filter) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.customer?.name?.toLowerCase().includes(q);
      const matchEmail = o.customer?.email?.toLowerCase().includes(q);
      const matchPhone = o.customer?.phone?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/content/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? data.order : o))
        );
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch (err: any) {
      alert(err.message || "Error updating order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Order Management</h1>
          <p className="text-sm text-[#78716C] mt-1">
            {orders.length} total orders committed to <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/orders/*.json</span>
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0D8D0] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === t
                  ? "bg-[#1C1917] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search Order ID, name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#C8956C]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Google Sheet</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-stone-500">
                    No orders matched your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = (order.orderStatus || "PLACED").toUpperCase();
                  const placedDate = new Date(order.placedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={order.orderId} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-xs text-[#1C1917]">
                        {order.orderId}
                      </td>

                      <td className="px-6 py-4 text-xs text-stone-600">
                        {placedDate}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-xs text-[#1C1917]">
                          {order.customer?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-stone-500">{order.customer?.phone || ""}</p>
                      </td>

                      <td className="px-6 py-4 text-xs text-stone-600">
                        {order.items?.length || 1} item(s)
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#1C1917] text-xs">
                        {formatPrice(order.total || 0)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            order.sheetSynced
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          <FileSpreadsheet size={11} />
                          {order.sheetSynced ? "Synced" : "Local"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={status}
                          disabled={updatingId === order.orderId}
                          onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-hidden ${
                            status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : status === "SHIPPED"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : status === "CANCELLED"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8956C] hover:underline"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E0D8D0] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1C1917]">
                  Order {selectedOrder.orderId}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(selectedOrder.placedAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Customer</p>
                <p className="font-semibold text-sm text-[#1C1917]">{selectedOrder.customer?.name || "Customer"}</p>
                <p className="text-xs text-stone-600 flex items-center gap-1.5">
                  <Phone size={12} /> {selectedOrder.customer?.phone || selectedOrder.address?.phone || "N/A"}
                </p>
                {selectedOrder.customer?.email && (
                  <p className="text-xs text-stone-600 flex items-center gap-1.5">
                    <Mail size={12} /> {selectedOrder.customer?.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Shipping Address</p>
                <p className="text-xs text-stone-700 font-medium">
                  {selectedOrder.address?.address}
                </p>
                <p className="text-xs text-stone-700">
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Purchased Items ({selectedOrder.items?.length || 0})
              </p>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{item.title}</p>
                      <p className="text-stone-500 mt-0.5">
                        Size: <span className="font-medium text-stone-800">{item.size || "Standard"}</span> • Color: <span className="font-medium text-stone-800">{item.color || "Standard"}</span> • Qty: <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right font-semibold text-stone-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{selectedOrder.shipping ? formatPrice(selectedOrder.shipping) : "FREE"}</span>
              </div>
              {Boolean(selectedOrder.discount) && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-stone-200">
                <span>Total Paid ({selectedOrder.paymentMethod || "UPI"})</span>
                <span>{formatPrice(selectedOrder.total || 0)}</span>
              </div>
            </div>

            {/* Tracking & Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Courier Tracking Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. DELHIVERY-84920489"
                  defaultValue={selectedOrder.trackingNumber || ""}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleStatusUpdate(selectedOrder.orderId, selectedOrder.orderStatus, trackingInput)
                  }
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
