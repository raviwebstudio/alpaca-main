import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getContentProducts,
  saveContentProduct,
  type ContentProduct,
} from "@/lib/content";

export async function GET() {
  try {
    const products = getContentProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContentProduct;

    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, error: "Product title is required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct: ContentProduct = {
      ...body,
      id: body.id || Date.now(),
      slug,
      price: Number(body.price) || 0,
      mrp: Number(body.mrp) || Math.round((Number(body.price) || 0) * 1.5),
      stock: Number(body.stock) || 0,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      sku: body.sku || `ALP-${(body.category || "GEN").toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      category: body.category || "oversized",
      type: body.type || "fashion",
      status: body.status || "published",
      variants: Array.isArray(body.variants) ? body.variants : [],
      images: Array.isArray(body.images) ? body.images : [],
      updatedAt: new Date().toISOString(),
    };

    saveContentProduct(newProduct);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/home-decor");
      revalidatePath("/new-arrivals");
    } catch {}

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
