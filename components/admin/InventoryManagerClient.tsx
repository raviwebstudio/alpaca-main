"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  ArrowUpDown,
  ExternalLink,
  Edit2,
} from "lucide-react";
import { formatPrice } from "@/lib/storefront";
import type { InventoryItem } from "@/lib/content";
import { SITE_IMAGES } from "@/lib/siteImages";

interface InventoryManagerClientProps {
  initialItems: InventoryItem[];
}

export function InventoryManagerClient({ initialItems }: InventoryManagerClientProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out" | "good">("all");
  const [savingSku, setSavingSku] = useState<string | null>(null);
  const [editedStock, setEditedStock] = useState<Record<string, number>>({});

  const totalVariants = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const outOfStockCount = items.filter((i) => i.isOutOfStock).length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "low") return item.isLowStock;
    if (filterStatus === "out") return item.isOutOfStock;
    if (filterStatus === "good") return !item.isLowStock && !item.isOutOfStock;
    return true;
  });

  const handleStockChange = (sku: string, val: number) => {
    setEditedStock((prev) => ({
      ...prev,
      [sku]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (item: InventoryItem) => {
    const newStock = editedStock[item.sku] !== undefined ? editedStock[item.sku] : item.stock;
    setSavingSku(item.sku);

    try {
      const res = await fetch("/api/admin/content/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: item.productSlug,
          variantSku: item.sku,
          stock: newStock,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => {
            if (i.sku === item.sku) {
              const updatedStock = newStock;
              return {
                ...i,
                stock: updatedStock,
                isLowStock: updatedStock > 0 && updatedStock <= i.lowStockThreshold,
                isOutOfStock: updatedStock <= 0,
              };
            }
            return i;
          })
        );
        setEditedStock((prev) => {
          const copy = { ...prev };
          delete copy[item.sku];
          return copy;
        });
      } else {
        alert(data.error || "Failed to update stock");
      }
    } catch (err: any) {
      alert(err.message || "Error updating stock");
    } finally {
      setSavingSku(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Inventory Control</h1>
          <p className="text-sm text-[#78716C] mt-1">
            Real-time variant stock management linked to <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/products/*.json</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Total Units</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{totalUnits}</p>
          </div>
          <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">SKU Variants</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{totalVariants}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <ArrowUpDown size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-600">Low Stock Alert</p>
            <p className="text-2xl font-serif font-bold text-amber-700 mt-1">{lowStockCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-red-600">Out of Stock</p>
            <p className="text-2xl font-serif font-bold text-red-700 mt-1">{outOfStockCount}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-700 rounded-xl">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0D8D0] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search SKU, Product, Color, Size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#C8956C]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterStatus === "all"
                ? "bg-[#1C1917] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("low")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterStatus === "low"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("out")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterStatus === "out"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-800 hover:bg-red-100"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("good")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterStatus === "good"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            In Stock ({items.length - lowStockCount - outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-3.5">Product & Variant</th>
                <th className="px-6 py-3.5">Variant SKU</th>
                <th className="px-6 py-3.5">Size</th>
                <th className="px-6 py-3.5">Color</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock Status</th>
                <th className="px-6 py-3.5">Quick Adjust Stock</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-stone-500">
                    No inventory variants matched your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const currentStock = editedStock[item.sku] !== undefined ? editedStock[item.sku] : item.stock;
                  const hasChanged = editedStock[item.sku] !== undefined && editedStock[item.sku] !== item.stock;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || SITE_IMAGES.placeholders.product}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/admin/products/edit/${item.productSlug}`}
                              className="font-semibold text-[#1C1917] hover:text-[#C8956C] transition line-clamp-1 text-xs"
                            >
                              {item.productTitle}
                            </Link>
                            <span className="text-[11px] text-stone-500 capitalize">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-stone-800 font-semibold">
                        {item.sku}
                      </td>

                      <td className="px-6 py-4 font-semibold text-xs text-stone-800">
                        {item.size}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                            style={{ backgroundColor: item.colorHex || "#333" }}
                          />
                          <span className="text-stone-700">{item.color}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-[#1C1917]">
                        {formatPrice(item.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            item.isOutOfStock
                              ? "bg-red-100 text-red-800"
                              : item.isLowStock
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.isOutOfStock ? (
                            <XCircle size={12} />
                          ) : item.isLowStock ? (
                            <AlertTriangle size={12} />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          {item.isOutOfStock ? "Out of Stock" : item.isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStockChange(item.sku, Math.max(0, currentStock - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-sm"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={(e) => handleStockChange(item.sku, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-semibold text-xs rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#C8956C]"
                          />

                          <button
                            type="button"
                            onClick={() => handleStockChange(item.sku, currentStock + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-sm"
                          >
                            +
                          </button>

                          {hasChanged && (
                            <button
                              type="button"
                              disabled={savingSku === item.sku}
                              onClick={() => handleSaveStock(item)}
                              className="px-2.5 py-1 rounded-lg bg-[#C8956C] text-white text-xs font-semibold hover:bg-[#b5835c] transition flex items-center gap-1 shadow-xs animate-pulse"
                            >
                              <Save size={12} />
                              {savingSku === item.sku ? "..." : "Save"}
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/products/edit/${item.productSlug}`}
                          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#C8956C] transition"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
