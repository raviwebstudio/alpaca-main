import { NextRequest, NextResponse } from "next/server";
import {
  getContentOrders,
  getContentOrderById,
  updateContentOrderStatus,
  saveContentOrder,
  type ContentOrder,
} from "@/lib/content";

export async function GET() {
  try {
    const orders = getContentOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      orderId: string;
      status?: string;
      trackingNumber?: string;
      notes?: string;
    };

    if (!body.orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const updated = updateContentOrderStatus(
      body.orderId,
      body.status || "CONFIRMED",
      body.trackingNumber,
      body.notes
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
