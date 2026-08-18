import { NextRequest, NextResponse } from "next/server";
import { getInventoryItems, updateVariantStock } from "@/lib/content";

export async function GET() {
  try {
    const items = getInventoryItems();
    const lowStockCount = items.filter((i) => i.isLowStock || i.isOutOfStock).length;
    const outOfStockCount = items.filter((i) => i.isOutOfStock).length;
    const totalUnits = items.reduce((sum, i) => sum + i.stock, 0);

    return NextResponse.json({
      success: true,
      items,
      stats: {
        totalVariants: items.length,
        totalUnits,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      productSlug: string;
      variantSku: string;
      stock: number;
    };

    if (!body.productSlug || !body.variantSku || body.stock === undefined) {
      return NextResponse.json(
        { success: false, error: "productSlug, variantSku and stock are required" },
        { status: 400 }
      );
    }

    const updated = updateVariantStock(body.productSlug, body.variantSku, Number(body.stock));

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Variant or product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      variantSku: body.variantSku,
      newStock: Number(body.stock),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update stock" },
      { status: 500 }
    );
  }
}
