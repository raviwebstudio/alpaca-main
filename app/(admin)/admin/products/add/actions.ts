"use server";

import { addProduct, updateProduct } from "@/lib/productStorage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/data/products";

export async function createProductAction(data: any) {
  const newProduct: Product = {
    id: Date.now().toString() as any, // Simple ID generation
    title: data.title,
    slug: data.slug,
    price: Number(data.price),
    type: data.type || "fashion",
    category: data.category,
    sizes: data.sizes,
    colors: data.colors,
    material: data.material || "",
    images: data.images,
    description: data.description,
    summary: data.summary,
    highlights: [],
  };

  await addProduct(newProduct);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, data: any) {
  await updateProduct(id, {
    title: data.title,
    slug: data.slug,
    price: Number(data.price),
    type: data.type || "fashion",
    category: data.category,
    sizes: data.sizes,
    colors: data.colors,
    material: data.material || "",
    images: data.images,
    description: data.description,
    summary: data.summary,
  } as any);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/edit/${id}`);
  revalidatePath("/shop");
  redirect("/admin/products");
}
