"use client";

import { useEffect, useState } from "react";
import { createProductAction, updateProductAction } from "@/app/(admin)/admin/products/add/actions";
import { productCategoryOptions, decorCategoryOptions } from "@/data/products";
import { LOCAL_CATEGORIES_EVENT, readLocalCategories } from "@/lib/localCategories";

type ProductFormProps = {
  initialData?: any;
  productId?: string;
  mode?: "create" | "edit";
  categories?: any[];
};

const normalizeImages = (images: any, title: string) => {
  const parsedImages = typeof images === "string" ? JSON.parse(images || "[]") : images;
  if (!Array.isArray(parsedImages)) return [];

  return parsedImages.map((image) => {
    if (typeof image === "string") {
      return { url: image, alt: title };
    }

    return { url: image?.url || "", alt: image?.alt || title };
  });
};

const normalizeColors = (colors: any) => {
  const parsedColors = typeof colors === "string" ? JSON.parse(colors || "[]") : colors;
  if (!Array.isArray(parsedColors)) return [];

  return parsedColors.map((color) => {
    if (typeof color === "string") {
      return { name: color, hex: "#000000" };
    }

    return { name: color?.name || "New Color", hex: color?.hex || "#000000" };
  });
};

export default function ProductForm({ initialData, productId, mode = "create" }: ProductFormProps) {
  const initialTitle = initialData?.title || initialData?.name || "";
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [type, setType] = useState<"fashion" | "decor">(initialData?.type || "fashion");
  const [category, setCategory] = useState(initialData?.category || "oversized");
  const [sizes, setSizes] = useState<string[]>(Array.isArray(initialData?.sizes) ? initialData.sizes : []);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(normalizeColors(initialData?.colors));
  const [images, setImages] = useState<{ url: string; alt: string }[]>(normalizeImages(initialData?.images, initialTitle));
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [loading, setLoading] = useState(false);
  const [savedCategories, setSavedCategories] = useState<{ value: string; label: string; description: string }[]>([]);

  useEffect(() => {
    const syncCategories = () => {
      setSavedCategories(
        readLocalCategories().map((category) => ({
          value: category.slug,
          label: category.name,
          description: category.description || "Custom category",
        })),
      );
    };

    syncCategories();
    window.addEventListener(LOCAL_CATEGORIES_EVENT, syncCategories);
    window.addEventListener("storage", syncCategories);

    return () => {
      window.removeEventListener(LOCAL_CATEGORIES_EVENT, syncCategories);
      window.removeEventListener("storage", syncCategories);
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const addSize = (size: string) => {
    if (!sizes.includes(size)) setSizes([...sizes, size]);
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    setColors([...colors, { name: "New Color", hex: "#000000" }]);
  };

  const updateColor = (index: number, key: "name" | "hex", value: string) => {
    const newColors = [...colors];
    newColors[index][key] = value;
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addImage = () => {
    setImages([...images, { url: "", alt: "" }]);
  };

  const updateImage = (index: number, key: "url" | "alt", value: string) => {
    const newImages = [...images];
    newImages[index][key] = value;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title,
      slug,
      price,
      type,
      category,
      sizes,
      colors,
      images,
      description,
      summary,
    };

    if (mode === "edit" && productId) {
      await updateProductAction(productId, payload);
      return;
    }

    await createProductAction(payload);
    setLoading(false);
  };

  const defaultCategories = type === "fashion" ? productCategoryOptions : decorCategoryOptions;
  const currentCategories = [
    ...defaultCategories,
    ...savedCategories.filter(
      (category) => !defaultCategories.some((defaultCategory) => defaultCategory.value === category.value),
    ),
  ];

  return (
    <div className="flex-1 overflow-auto">
      <h2 className="text-3xl font-serif text-[#1C1917] mb-8">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-stone-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Title</label>
            <input required value={title} onChange={handleTitleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Slug</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Price (₹)</label>
            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none bg-white">
              <option value="fashion">Fashion</option>
              <option value="decor">Decor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Category</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none bg-white">
              {currentCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Sizes</label>
          <div className="flex gap-2 mb-2">
            {["S", "M", "L", "XL", "XXL"].map(size => (
              <button type="button" key={size} onClick={() => sizes.includes(size) ? removeSize(size) : addSize(size)} className={`px-3 py-1 rounded-full border text-sm ${sizes.includes(size) ? "bg-[#1C1917] text-white" : "border-stone-200 text-stone-600"}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Colors</label>
            <button type="button" onClick={addColor} className="text-xs bg-stone-100 px-2 py-1 rounded">+ Add Color</button>
          </div>
          {colors.map((c, i) => (
            <div key={i} className="flex gap-4 items-center">
              <input value={c.name} onChange={(e) => updateColor(i, "name", e.target.value)} placeholder="Color Name" className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="color" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className="w-10 h-10 border rounded cursor-pointer" />
              <button type="button" onClick={() => removeColor(i)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Images</label>
            <button type="button" onClick={addImage} className="text-xs bg-stone-100 px-2 py-1 rounded">+ Add Image URL</button>
          </div>
          {images.map((img, i) => (
            <div key={i} className="flex gap-4 items-center">
              <input value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)} placeholder="Image URL (e.g. /inventory/item.jpg)" className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)} placeholder="Alt text" className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <button type="button" onClick={() => removeImage(i)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Summary</label>
          <input required value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-500 uppercase tracking-wider">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:border-[#C8956C] outline-none"></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-[#1C1917] hover:bg-black text-white py-3 rounded-full font-medium transition">
            {loading ? "Saving..." : mode === "edit" ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
