import {
  getContentProducts,
  getContentProductById,
  saveContentProduct,
  deleteContentProduct,
  type ContentProduct,
} from "@/lib/content";
import { Product } from "@/data/products";

export async function getProducts(): Promise<Product[]> {
  const contentProds = getContentProducts();
  return contentProds.map((p) => ({
    id: Number(p.id) || 1,
    title: p.title,
    slug: p.slug,
    price: p.price,
    type: p.type || "fashion",
    category: p.category as any,
    sizes: p.sizes,
    colors: p.colors,
    material: p.material,
    images: p.images,
    description: p.description,
    summary: p.summary,
    highlights: p.highlights,
    shippingLeadTime: p.shippingLeadTime,
    featured: p.featured,
    bestSeller: p.bestSeller,
    newDrop: p.newDrop,
  }));
}

export async function addProduct(product: Product): Promise<void> {
  const contentProd: ContentProduct = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    mrp: Math.round(product.price * 1.5),
    stock: 50,
    lowStockThreshold: 10,
    sku: `ALP-${(product.category || "GEN").toUpperCase().slice(0, 3)}-${String(product.id).padStart(3, "0")}`,
    category: product.category,
    type: product.type,
    status: "published",
    sizes: product.sizes,
    colors: product.colors,
    variants: [],
    images: product.images,
    description: product.description,
    summary: product.summary,
    highlights: product.highlights,
    material: product.material,
    shippingLeadTime: product.shippingLeadTime,
    featured: product.featured,
    bestSeller: product.bestSeller,
    newDrop: product.newDrop,
  };
  saveContentProduct(contentProd);
}

export async function updateProduct(id: number | string, updatedProduct: Partial<Product>): Promise<void> {
  const existing = getContentProductById(id);
  if (existing) {
    const merged: ContentProduct = {
      ...existing,
      ...updatedProduct,
      category: (updatedProduct.category || existing.category) as any,
      type: (updatedProduct.type || existing.type) as any,
    };
    saveContentProduct(merged);
  }
}

export async function deleteProduct(id: number | string): Promise<void> {
  deleteContentProduct(id);
}

