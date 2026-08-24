import { NextRequest, NextResponse } from "next/server";
import {
  processOrderSubmission,
  type OrderSubmissionPayload,
} from "@/lib/orderService";

// In-memory set of recently processed request keys to prevent duplicate clicks
const recentSubmissions = new Map<string, number>();

// Cleanup stale deduplication records older than 60 seconds
function cleanOldSubmissions() {
  const cutoff = Date.now() - 60000;
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (timestamp < cutoff) {
      recentSubmissions.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    cleanOldSubmissions();

    const body = (await req.json()) as OrderSubmissionPayload;

    if (!body || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (!body.address || !body.address.name || !body.address.address) {
      return NextResponse.json(
        { success: false, error: "Complete delivery address is required." },
        { status: 400 }
      );
    }

    // Generate deduplication signature based on customer phone, total, items length, and payment method
    const dedupeKey = `${body.address.phone}_${body.total}_${body.items.length}_${body.paymentMethod}`;
    const lastSeen = recentSubmissions.get(dedupeKey);

    if (lastSeen && Date.now() - lastSeen < 4000) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate submission detected. Please wait a moment.",
        },
        { status: 429 }
      );
    }

    recentSubmissions.set(dedupeKey, Date.now());

    const result = await processOrderSubmission(body);

    // Return error if sheet write fails (never return false success)
    if (!result.success || !result.sheetSynced) {
      console.error(
        `[SubmitOrderAPI] Google Sheet synchronization failed for order ${result.orderId}: ${result.sheetSyncError}`
      );
      return NextResponse.json(
        {
          success: false,
          orderId: result.orderId,
          order: result.order,
          sheetSynced: false,
          sheetSyncError: result.sheetSyncError || "Failed to record order to Google Sheet.",
          error: result.sheetSyncError || "Failed to record order to Google Sheet.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        order: result.order,
        sheetSynced: result.sheetSynced,
        sheetSyncError: result.sheetSyncError,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[SubmitOrderAPI] Unhandled error processing order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while placing the order.",
      },
      { status: 500 }
    );
  }
}
