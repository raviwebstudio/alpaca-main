"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
} from "lucide-react";
import type { ContentProduct, ProductVariant } from "@/lib/content";

interface ProductEditorFormProps {
  initialData?: ContentProduct | null;
  isEditing?: boolean;
}

export function ProductEditorForm({ initialData, isEditing = false }: ProductEditorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "oversized");
  const [type, setType] = useState<"fashion" | "decor">(initialData?.type || "fashion");
  const [status, setStatus] = useState<"published" | "draft">(initialData?.status || "published");
  const [price, setPrice] = useState<number | string>(initialData?.price ?? 490);
  const [mrp, setMrp] = useState<number | string>(initialData?.mrp ?? 999);
  const [sku, setSku] = useState(initialData?.sku || "");
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(initialData?.lowStockThreshold ?? 10);
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [material, setMaterial] = useState(initialData?.material || "100% Heavyweight Cotton");
  const [shippingLeadTime, setShippingLeadTime] = useState(initialData?.shippingLeadTime || "Dispatches in 24-48 hours");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [bestSeller, setBestSeller] = useState(initialData?.bestSeller || false);
  const [newDrop, setNewDrop] = useState(initialData?.newDrop || false);

  // Lists & arrays
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ["/products/media/plain-white-t-shirt01.webp"]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  const [sizes, setSizes] = useState<string[]>(
    initialData?.sizes && initialData.sizes.length > 0 ? initialData.sizes : ["S", "M", "L", "XL"]
  );
  const [sizeInput, setSizeInput] = useState("");

  const [colors, setColors] = useState<string[]>(
    initialData?.colors && initialData.colors.length > 0 ? initialData.colors : ["Standard"]
  );
  const [colorInput, setColorInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights && initialData.highlights.length > 0
      ? initialData.highlights
      : ["Premium Quality", "Artisan Finished"]
  );
  const [highlightInput, setHighlightInput] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(initialData?.seo?.metaDescription || "");

  // Variants matrix
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.variants && initialData.variants.length > 0 ? initialData.variants : []
  );

  // Auto-generate slug and SKU when typing title if new
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);

      if (!sku) {
        setSku(`ALP-${category.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`);
      }
      if (!metaTitle) {
        setMetaTitle(`${title} | ALPAZA`);
      }
    }
  }, [title, isEditing, category, sku, metaTitle]);

  // Generate or update variant matrix
  const generateVariantMatrix = () => {
    const basePrice = Number(price) || 0;
    const baseMrp = Number(mrp) || Math.round(basePrice * 1.5);
    const baseSkuStr = sku || `ALP-${category.toUpperCase().slice(0, 3)}-101`;

    const newVariants: ProductVariant[] = [];
    colors.forEach((col) => {
      sizes.forEach((sz) => {
        const colCode = col.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "STD";
        const vSku = `${baseSkuStr}-${colCode}-${sz}`;
        
        // Find if exists
        const existing = variants.find((v) => v.size === sz && v.color === col);
        if (existing) {
          newVariants.push(existing);
        } else {
          newVariants.push({
            sku: vSku,
            size: sz,
            color: col,
            colorHex: col.toLowerCase().includes("black") ? "#111111" : col.toLowerCase().includes("white") ? "#FFFFFF" : "#D2C2B2",
            price: basePrice,
            mrp: baseMrp,
            stock: 25,
            image: images[0] || "",
          });
        }
      });
    });

    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (s: string) => {
    setSizes(sizes.filter((sz) => sz !== s));
  };

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (c: string) => {
    setColors(colors.filter((col) => col !== c));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const totalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      setError("Title and Slug are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload: ContentProduct = {
      id: initialData?.id || Date.now(),
      title,
      slug,
      category,
      type,
      status,
      price: Number(price),
      mrp: Number(mrp),
      stock: totalStock,
      lowStockThreshold: Number(lowStockThreshold),
      sku,
      sizes,
      colors,
      variants,
      images,
      description,
      summary,
      highlights,
      material,
      shippingLeadTime,
      featured,
      bestSeller,
      newDrop,
      seo: {
        metaTitle: metaTitle || `${title} | ALPAZA`,
        metaDescription: metaDesc || summary || description,
        keywords: ["alpaca", category, type].filter(Boolean),
      },
    };

    try {
      const url = isEditing
        ? `/api/admin/content/products/${encodeURIComponent(initialData?.slug || slug)}`
        : `/api/admin/content/products`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 600);
      } else {
        setError(data.error || "Failed to save product.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-16 bg-[#FAF8F5]/90 backdrop-blur-md py-4 z-10 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white rounded-xl border border-stone-200 hover:bg-stone-50 transition text-stone-700"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#1C1917]">
              {isEditing ? `Edit Product: ${title || initialData?.title}` : "Create New Product"}
            </h1>
            <p className="text-xs text-stone-500 font-mono">
              target: content/products/{slug || "slug"}.json
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b5835c] transition shadow-sm disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving to GitHub..." : isEditing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          Product successfully saved to content/products! Redirecting...
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Core Details & Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Basic Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Basic Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Heavyweight Cotton Oversized Tee"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Slug (URL Key) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="heavyweight-cotton-oversized-tee"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Base SKU *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="ALP-OVR-001"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:border-[#C8956C]"
                >
                  <option value="oversized">Oversized</option>
                  <option value="basics">Basics</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="frames">Frames</option>
                  <option value="wall-art">Wall Art</option>
                  <option value="table-decor">Table Decor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:border-[#C8956C]"
                >
                  <option value="fashion">Fashion Apparel</option>
                  <option value="decor">Home Decor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:border-[#C8956C]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card: Pricing & Base Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-[#1C1917] focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  MRP / Compare Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>
            </div>
          </div>

          {/* Card: Variant Matrix (Color + Size) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1C1917]">
                  Variant Matrix (Color + Size)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage SKU-level stock, prices, and color swatches.
                </p>
              </div>

              <button
                type="button"
                onClick={generateVariantMatrix}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              >
                <Sparkles size={14} />
                Generate Matrix
              </button>
            </div>

            {/* Sizes & Colors Config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-stone-50 rounded-xl border border-stone-200">
              {/* Sizes list */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Sizes ({sizes.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSize(s)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add size (e.g. XXL)"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Colors list */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Colors ({colors.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => removeColor(c)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add color (e.g. Olive)"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            {variants.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl">
                <Layers className="mx-auto text-stone-400 mb-2" size={28} />
                <p className="text-sm font-semibold text-stone-700">No variant matrix generated yet</p>
                <p className="text-xs text-stone-500 mt-1">
                  Click "Generate Matrix" above to build rows for each color × size combination.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <th className="p-3">Variant SKU</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Color</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {variants.map((v, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="p-2.5 font-mono">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(i, "sku", e.target.value)}
                            className="w-full px-2 py-1 border border-stone-200 rounded text-xs font-mono"
                          />
                        </td>
                        <td className="p-2.5 font-semibold text-stone-800">{v.size}</td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                              style={{ backgroundColor: v.colorHex || "#ccc" }}
                            />
                            <span>{v.color}</span>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariantChange(i, "price", Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-stone-200 rounded text-xs font-semibold"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(i, "stock", Number(e.target.value))}
                            className={`w-20 px-2 py-1 border rounded text-xs font-semibold ${
                              v.stock <= lowStockThreshold ? "border-amber-400 bg-amber-50" : "border-stone-200"
                            }`}
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="text-stone-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card: Descriptions & Material */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Description & Craft Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Summary / Tagline
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A clean heavyweight cotton tee with a calm oversized shape."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed craft and styling notes..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Fabric & Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="100% Cotton (180 GSM)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Shipping Lead Time
                </label>
                <input
                  type="text"
                  value={shippingLeadTime}
                  onChange={(e) => setShippingLeadTime(e.target.value)}
                  placeholder="Dispatches within 48 hours"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#C8956C]"
                />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Product Highlights
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-lg text-xs font-medium text-stone-800"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add bullet highlight (e.g. 240 GSM Heavyweight)"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Media Gallery, Storefront Badges & SEO */}
        <div className="space-y-6">
          {/* Card: Product Images */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>Image Gallery</span>
              <span className="text-xs text-stone-500 font-sans">{images.length} images</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-[4/5] bg-stone-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded font-medium">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-stone-700">Add Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/products/media/... or https://"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-3.5 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Add
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                You can also upload directly via <span className="font-semibold text-stone-700">public/products/media/</span> or Pages CMS.
              </p>
            </div>
          </div>

          {/* Card: Storefront Badges & Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Storefront Badges
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition">
                <div>
                  <p className="text-xs font-semibold text-[#1C1917]">Featured Product</p>
                  <p className="text-[11px] text-stone-500">Display in homepage hero and featured grids</p>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C8956C] focus:ring-[#C8956C]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition">
                <div>
                  <p className="text-xs font-semibold text-[#1C1917]">Best Seller Badge</p>
                  <p className="text-[11px] text-stone-500">Shows dark "Best Seller" pill on product card</p>
                </div>
                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C8956C] focus:ring-[#C8956C]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition">
                <div>
                  <p className="text-xs font-semibold text-[#1C1917]">New Drop Badge</p>
                  <p className="text-[11px] text-stone-500">Shows "New Drop" label on product card</p>
                </div>
                <input
                  type="checkbox"
                  checked={newDrop}
                  onChange={(e) => setNewDrop(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C8956C] focus:ring-[#C8956C]"
                />
              </label>
            </div>
          </div>

          {/* Card: SEO Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1C1917] border-b border-stone-100 pb-3">
              Search Engine Optimization (SEO)
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Product Title | ALPAZA"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Search result snippet description..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
