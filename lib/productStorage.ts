import fs from "fs/promises";
import path from "path";
import { Product } from "@/data/products";

const dataFilePath = path.join(process.cwd(), "data", "products.json");

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    const products = JSON.parse(data);

    return products.map((product: any) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map((image: any) => (typeof image === "string" ? image : image?.url)).filter(Boolean)
        : [],
      colors: Array.isArray(product.colors)
        ? product.colors.map((color: any) => (typeof color === "string" ? color : color?.name)).filter(Boolean)
        : [],
    }));
  } catch (err) {
    console.error("Error reading products:", err);
    return [];
  }
}

export async function addProduct(product: Product): Promise<void> {
  const products = await getProducts();
  products.push(product);
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), "utf8");
}

export async function updateProduct(id: number | string, updatedProduct: Partial<Product>): Promise<void> {
  const products = await getProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct } as Product;
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  }
}

export async function deleteProduct(id: number | string): Promise<void> {
  let products = await getProducts();
  products = products.filter((p) => String(p.id) !== String(id));
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), "utf8");
}
