import { getTurnstileConfig } from "./env";
import type { OrderSubmissionPayload } from "./orderService";

// ============================================================================
// Phone Normalization & Validation Helper
// ============================================================================

export const normalizePhone = (value: string): string => {
  const cleaned = (value || "").replace(/\D/g, "");

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.slice(2);
  }

  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned.slice(1);
  }

  return cleaned;
};

export const isValidIndianPhone = (value: string): boolean => {
  const phone = normalizePhone(value);
  return /^[6-9]\d{9}$/.test(phone);
};

// ============================================================================
// 1. In-Memory Rate Limiter (Max 5 requests per IP every 10 minutes)
// ============================================================================

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Clean up stale rate limit records older than 15 minutes.
 */
function cleanStaleRateLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Check if an IP address has exceeded the rate limit.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  cleanStaleRateLimits();

  const now = Date.now();
  const normalizedIp = ip?.trim() || "unknown-ip";
  const record = rateLimitStore.get(normalizedIp) || { timestamps: [] };

  // Filter timestamps within current window
  const activeTimestamps = record.timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const retryAfterSeconds = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000
    );
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(normalizedIp, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length,
    retryAfterSeconds: 0,
  };
}

// ============================================================================
// 2. Duplicate Order Detector (Same Phone + Products within 2 minutes)
// ============================================================================

const duplicateOrderStore = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

function cleanStaleDuplicateRecords() {
  const now = Date.now();
  for (const [key, ts] of duplicateOrderStore.entries()) {
    if (now - ts > DUPLICATE_WINDOW_MS) {
      duplicateOrderStore.delete(key);
    }
  }
}

/**
 * Create a fingerprint key based on customer phone and ordered product items.
 */
export function createOrderDedupeKey(
  phone: string,
  items: Array<{ productId: string | number; size?: string; color?: string; quantity?: number }>
): string {
  const normalizedPhone = normalizePhone(phone);
  const sortedItemsKey = items
    .map(
      (it) =>
        `${it.productId}:${(it.size || "std").toLowerCase()}:${(
          it.color || "std"
        ).toLowerCase()}:${it.quantity || 1}`
    )
    .sort()
    .join("|");

  return `${normalizedPhone}__${sortedItemsKey}`;
}

/**
 * Check if an order with the same phone and products was placed in the last 2 minutes.
 */
export function checkDuplicateOrder(
  phone: string,
  items: Array<{ productId: string | number; size?: string; color?: string; quantity?: number }>
): { isDuplicate: boolean; retryAfterSeconds: number } {
  cleanStaleDuplicateRecords();

  const now = Date.now();
  const key = createOrderDedupeKey(phone, items);
  const lastPlacedAt = duplicateOrderStore.get(key);

  if (lastPlacedAt && now - lastPlacedAt < DUPLICATE_WINDOW_MS) {
    const retryAfterSeconds = Math.ceil(
      (DUPLICATE_WINDOW_MS - (now - lastPlacedAt)) / 1000
    );
    return {
      isDuplicate: true,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
    };
  }

  duplicateOrderStore.set(key, now);
  return {
    isDuplicate: false,
    retryAfterSeconds: 0,
  };
}

// ============================================================================
// 3. Cloudflare Turnstile Token Server Verification
// ============================================================================

export async function verifyTurnstileToken(
  token?: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const { secretKey, isConfigured } = getTurnstileConfig();

  // If secret key is not configured in environment, allow with warning in development
  if (!isConfigured || !secretKey) {
    console.warn(
      "[Security] TURNSTILE_SECRET_KEY is not configured. Bypassing Turnstile verification for dev/demo mode."
    );
    return { success: true };
  }

  if (!token || !token.trim()) {
    console.warn("[Security] Turnstile token is missing from request body.");
    return {
      success: false,
      error: "Bot protection verification required. Please try again.",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (remoteIp && remoteIp !== "unknown-ip") {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success === true) {
      console.log(
        `[Security] Turnstile bot challenge successfully passed for IP ${remoteIp || "unknown"}`
      );
      return { success: true };
    }

    const errorCodes = Array.isArray(data["error-codes"])
      ? data["error-codes"].join(", ")
      : "Verification failed";

    console.warn(
      `[Security] Cloudflare Turnstile verification rejected: ${errorCodes}`
    );

    return {
      success: false,
      error: "Bot verification challenge failed. Please refresh and try again.",
    };
  } catch (err: any) {
    console.error("[Security] Error calling Cloudflare Turnstile API:", err);
    return {
      success: false,
      error: "Security verification service temporarily unavailable.",
    };
  }
}

// ============================================================================
// 4. Strict Server-Side Payload & Data Format Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateOrderPayload(
  payload: OrderSubmissionPayload
): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid order request body." };
  }

  // 1. Validate Address
  const { address } = payload;
  if (!address || typeof address !== "object") {
    return { valid: false, error: "Complete customer delivery address is required." };
  }

  const name = address.name?.trim();
  if (!name || name.length < 2 || name.length > 100) {
    return { valid: false, error: "Please enter a valid customer name (minimum 2 characters)." };
  }

  if (!isValidIndianPhone(address.phone)) {
    return {
      valid: false,
      error: "Please enter a valid Indian mobile number.",
    };
  }

  if (address.email && address.email.trim()) {
    const email = address.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 120) {
      return { valid: false, error: "Please provide a valid email address." };
    }
  }

  const deliveryAddress = address.address?.trim();
  if (!deliveryAddress || deliveryAddress.length < 5) {
    return { valid: false, error: "Please enter a complete delivery street address." };
  }

  const city = address.city?.trim();
  if (!city || city.length < 2) {
    return { valid: false, error: "Please enter a valid city name." };
  }

  const state = address.state?.trim();
  if (!state || state.length < 2) {
    return { valid: false, error: "Please enter a valid state." };
  }

  const pincode = address.pincode?.trim().replace(/\D/g, "");
  if (!pincode || pincode.length !== 6) {
    return { valid: false, error: "Please enter a valid 6-digit postal pincode." };
  }

  // 2. Validate Order Items
  const { items } = payload;
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: "Order must contain at least one product item." };
  }

  if (items.length > 50) {
    return { valid: false, error: "Order exceeds maximum allowed item count." };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object") {
      return { valid: false, error: `Invalid product item at position ${i + 1}.` };
    }

    if (!item.title || item.title.trim().length === 0) {
      return { valid: false, error: `Product title is required for item #${i + 1}.` };
    }

    const price = Number(item.price);
    if (isNaN(price) || price <= 0) {
      return { valid: false, error: `Invalid price for product '${item.title}'.` };
    }

    const qty = Number(item.quantity);
    if (isNaN(qty) || qty < 1 || qty > 20) {
      return { valid: false, error: `Invalid quantity for product '${item.title}'.` };
    }
  }

  // 3. Validate Total Amount
  const total = Number(payload.total);
  if (isNaN(total) || total <= 0) {
    return { valid: false, error: "Order total amount must be a positive number." };
  }

  return { valid: true };
}
