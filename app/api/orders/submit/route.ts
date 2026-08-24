import { NextRequest, NextResponse } from "next/server";
import {
  processOrderSubmission,
  type OrderSubmissionPayload,
} from "@/lib/orderService";
import {
  checkRateLimit,
  checkDuplicateOrder,
  verifyTurnstileToken,
  validateOrderPayload,
} from "@/lib/security";

/**
 * Extract client IP from request headers in serverless / proxy environments.
 */
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  try {
    // 1. Rate Limiting (Maximum 5 checkout requests per IP every 10 minutes)
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      console.warn(
        `[SubmitOrderAPI] Rate limit exceeded for IP ${clientIp}. Requests throttled for ${rateLimit.retryAfterSeconds}s.`
      );
      return NextResponse.json(
        {
          success: false,
          error: `Too many checkout requests from this IP. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { turnstileToken, ...orderPayload } = rawBody as OrderSubmissionPayload & {
      turnstileToken?: string;
    };

    // 2. Cloudflare Turnstile Bot Protection Validation (Server-side only)
    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: turnstileResult.error || "Security verification failed. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    // 3. Strict Server-Side Payload & Field Validation
    const validation = validateOrderPayload(orderPayload);
    if (!validation.valid) {
      console.warn(
        `[SubmitOrderAPI] Validation failure from IP ${clientIp}: ${validation.error}`
      );
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // 4. Duplicate Order Detection (Same phone + product within 2 minutes)
    const duplicateCheck = checkDuplicateOrder(
      orderPayload.address.phone,
      orderPayload.items
    );
    if (duplicateCheck.isDuplicate) {
      console.warn(
        `[SubmitOrderAPI] Duplicate order rejected for phone ${orderPayload.address.phone} within 2-minute window.`
      );
      return NextResponse.json(
        {
          success: false,
          error: `A similar order was just placed recently. Please wait ${duplicateCheck.retryAfterSeconds} seconds before placing another order.`,
          retryAfter: duplicateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(duplicateCheck.retryAfterSeconds),
          },
        }
      );
    }

    // 5. Process order and write to Google Sheets (Only valid, verified requests reach here)
    const result = await processOrderSubmission(orderPayload);

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
          sheetSyncStatus: "failed",
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
        sheetSynced: true,
        sheetSyncStatus: "synced",
        sheetSyncError: null,
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
