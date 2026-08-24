import { NextRequest, NextResponse } from "next/server";
import {
  getLocalStoredOrders,
  saveOrderToLocalStore,
  syncOrderToGoogleSheets,
} from "@/lib/orderService";

export async function GET() {
  const orders = getLocalStoredOrders();
  const pendingSync = orders.filter((o) => !o.sheetSynced);

  return NextResponse.json({
    totalOrders: orders.length,
    pendingSyncCount: pendingSync.length,
    orders: orders.map((o) => ({
      orderId: o.orderId,
      placedAt: o.placedAt,
      customerName: o.address?.name,
      total: o.total,
      itemCount: o.items?.length,
      sheetSynced: o.sheetSynced,
      sheetSyncError: o.sheetSyncError,
      sheetSyncTimestamp: o.sheetSyncTimestamp,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: string };
    const orders = getLocalStoredOrders();

    const targets = orderId
      ? orders.filter((o) => o.orderId === orderId)
      : orders.filter((o) => !o.sheetSynced);

    if (targets.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending orders to sync.",
        syncedCount: 0,
      });
    }

    let syncedCount = 0;
    const errors: Array<{ orderId: string; error: string }> = [];

    for (const order of targets) {
      const result = await syncOrderToGoogleSheets(order.rows);
      if (result.success) {
        order.sheetSynced = true;
        order.sheetSyncError = null;
        order.sheetSyncTimestamp = new Date().toISOString();
        saveOrderToLocalStore(order);
        syncedCount++;
      } else {
        order.sheetSyncError = result.error || "Retry sync failed";
        saveOrderToLocalStore(order);
        errors.push({ orderId: order.orderId, error: result.error || "Unknown error" });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      syncedCount,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retry sync" },
      { status: 500 }
    );
  }
}
