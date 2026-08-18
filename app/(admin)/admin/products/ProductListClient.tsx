"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  Boxes,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/storefront";
import type { ContentProduct } from "@/lib/content";
import { SITE_IMAGES } from "@/lib/siteImages";

interface ProductListClientProps {
  initialProducts: ContentProduct[];
}

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ContentProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || (product.status || "published") === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product? This will remove the file from content/products.")) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/content/products/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
        router.refresh();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Product Catalog</h1>
          <p className="text-sm text-[#78716C] mt-1">
            {products.length} products stored in <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/products/*.json</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b5835c] transition shadow-xs"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0D8D0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title, SKU, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#C8956C] focus:ring-1 focus:ring-[#C8956C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-hidden focus:border-[#C8956C]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 text-sm rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-hidden focus:border-[#C8956C]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price / MRP</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const image = product.images?.[0] || SITE_IMAGES.placeholders.product;
                  const variantCount = product.variants?.length || 0;
                  const totalStock = product.stock || 0;
                  const isLow = totalStock > 0 && totalStock <= (product.lowStockThreshold || 10);
                  const isOut = totalStock <= 0;

                  return (
                    <tr key={product.slug} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={product.title}
                            className="w-12 h-14 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/admin/products/edit/${product.slug}`}
                              className="font-semibold text-[#1C1917] hover:text-[#C8956C] transition line-clamp-1"
                            >
                              {product.title}
                            </Link>
                            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-mono">
                              /product/{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-stone-700">
                        {product.sku || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize text-xs font-medium bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1C1917]">{formatPrice(product.price)}</p>
                        {product.mrp && product.mrp > product.price && (
                          <p className="text-xs text-stone-400 line-through">
                            {formatPrice(product.mrp)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                              isOut
                                ? "bg-red-100 text-red-800"
                                : isLow
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {totalStock} units
                          </span>
                        </div>
                        {variantCount > 0 && (
                          <p className="text-[11px] text-stone-500 mt-1">
                            {variantCount} variant(s)
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            (product.status || "published") === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {(product.status || "published") === "published" ? (
                            <CheckCircle size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          {product.status || "published"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            title="Preview on storefront"
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          <Link
                            href={`/admin/products/edit/${product.slug}`}
                            title="Edit product"
                            className="p-1.5 text-stone-600 hover:text-[#C8956C] hover:bg-stone-100 rounded-lg transition"
                          >
                            <Edit2 size={16} />
                          </Link>

                          <button
                            type="button"
                            title="Delete product"
                            disabled={deletingSlug === product.slug}
                            onClick={() => handleDelete(product.slug)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
