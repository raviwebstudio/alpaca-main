import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/orderService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing order ID" }, { status: 400 });
    }

    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        sheetSyncStatus: order.sheetSyncStatus || (order.sheetSynced ? "synced" : "failed"),
      },
      sheetSynced: order.sheetSynced,
      sheetSyncStatus: order.sheetSyncStatus || (order.sheetSynced ? "synced" : "failed"),
      sheetSyncError: order.sheetSyncError || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
