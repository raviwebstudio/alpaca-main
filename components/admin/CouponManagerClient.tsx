"use client";

import { useState } from "react";
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Percent,
  IndianRupee,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/storefront";
import type { ContentCoupon } from "@/lib/content";

interface CouponManagerClientProps {
  initialCoupons: ContentCoupon[];
}

export function CouponManagerClient({ initialCoupons }: CouponManagerClientProps) {
  const [coupons, setCoupons] = useState<ContentCoupon[]>(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number | string>(10);
  const [minOrderValue, setMinOrderValue] = useState<number | string>(999);
  const [maxDiscount, setMaxDiscount] = useState<number | string>("");
  const [expiresAt, setExpiresAt] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState<number | string>(100);
  const [description, setDescription] = useState("");

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    setLoading(true);
    try {
      const payload: ContentCoupon = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        isActive: true,
        usageLimit: Number(usageLimit) || 100,
        usageCount: 0,
        description,
      };

      const res = await fetch("/api/admin/content/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => [...prev.filter((c) => c.code !== data.coupon.code), data.coupon]);
        setModalOpen(false);
        setCode("");
        setDescription("");
      } else {
        alert(data.error || "Failed to create coupon");
      }
    } catch (err: any) {
      alert(err.message || "Error creating coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (coupon: ContentCoupon) => {
    try {
      const updated: ContentCoupon = {
        ...coupon,
        isActive: !coupon.isActive,
      };

      const res = await fetch("/api/admin/content/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.map((c) => (c.code === coupon.code ? data.coupon : c)));
      }
    } catch (err: any) {
      alert(err.message || "Error updating coupon");
    }
  };

  const handleDeleteCoupon = async (couponCode: string) => {
    if (!confirm(`Delete coupon ${couponCode}?`)) return;

    try {
      const res = await fetch(`/api/admin/content/coupons?code=${encodeURIComponent(couponCode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      } else {
        alert(data.error || "Failed to delete coupon");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting coupon");
    }
  };

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Coupons & Discounts</h1>
          <p className="text-sm text-[#78716C] mt-1">
            Store promotional vouchers saved in <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/coupons/*.json</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b5835c] transition shadow-xs self-start"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Total Vouchers</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{coupons.length}</p>
          </div>
          <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
            <Ticket size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">Active Coupons</p>
            <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-600">Total Redemptions</p>
            <p className="text-2xl font-serif font-bold text-amber-700 mt-1">{totalUses}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-3.5">Coupon Code</th>
                <th className="px-6 py-3.5">Discount</th>
                <th className="px-6 py-3.5">Min Order</th>
                <th className="px-6 py-3.5">Max Cap</th>
                <th className="px-6 py-3.5">Usage</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    No coupons created yet. Click "Create Coupon" to add your first promotion.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-[#1C1917]">
                      <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 tracking-wider">
                        {c.code}
                      </span>
                      {c.description && (
                        <p className="text-[11px] font-sans font-normal text-stone-500 mt-1">
                          {c.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-xs text-stone-800">
                      {c.discountType === "percentage" ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-700">
                          {c.discountValue}% OFF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[#1C1917]">
                          ₹{c.discountValue} OFF
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-stone-600">
                      {c.minOrderValue ? formatPrice(c.minOrderValue) : "No minimum"}
                    </td>

                    <td className="px-6 py-4 text-xs text-stone-600">
                      {c.maxDiscount ? formatPrice(c.maxDiscount) : "No cap"}
                    </td>

                    <td className="px-6 py-4 text-xs text-stone-600">
                      {c.usageCount} / {c.usageLimit || "∞"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E0D8D0] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-serif font-bold text-[#1C1917]">Create Promo Coupon</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-mono tracking-wider uppercase focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% off for festive season orders above ₹999"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#C8956C] text-white text-xs font-semibold hover:bg-[#b5835c] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
