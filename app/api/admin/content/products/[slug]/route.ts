import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getContentProductBySlug,
  getContentProductById,
  saveContentProduct,
  deleteContentProduct,
  type ContentProduct,
} from "@/lib/content";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = getContentProductBySlug(slug) || getContentProductById(slug);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = getContentProductBySlug(slug) || getContentProductById(slug);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const body = (await req.json()) as Partial<ContentProduct>;

    const updated: ContentProduct = {
      ...existing,
      ...body,
      id: existing.id,
      slug: existing.slug, // keep original slug filename
      price: body.price !== undefined ? Number(body.price) : existing.price,
      mrp: body.mrp !== undefined ? Number(body.mrp) : existing.mrp,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : existing.lowStockThreshold,
      variants: Array.isArray(body.variants) ? body.variants : existing.variants,
      images: Array.isArray(body.images) ? body.images : existing.images,
      updatedAt: new Date().toISOString(),
    };

    saveContentProduct(updated);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/home-decor");
      revalidatePath("/new-arrivals");
      revalidatePath(`/product/${slug}`);
    } catch {}

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const success = deleteContentProduct(slug);

    if (!success) {
      return NextResponse.json({ success: false, error: "Product not found or could not be deleted" }, { status: 404 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/home-decor");
      revalidatePath("/new-arrivals");
    } catch {}

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
