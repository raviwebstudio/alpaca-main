import fs from "fs";
import path from "path";
import {
  syncOrderToGoogleSheets,
  sendToGoogleSheetWebhook,
  maskWebhookUrl,
  HEADERS,
} from "./googleSheets";

export interface OrderItemInput {
  id: string;
  productId: number | string;
  slug?: string;
  title: string;
  price: number;
  image?: string;
  size: string;
  color: string;
  quantity: number;
  sellerId?: string;
  sellerName?: string;
}

export interface CustomerAddressInput {
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderSubmissionPayload {
  orderId?: string;
  items: OrderItemInput[];
  address: CustomerAddressInput;
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: "upi" | "card" | "netbanking" | string;
  paymentStatus?: "PAID" | "PENDING" | "CONFIRMED";
  orderStatus?: "PLACED" | "CONFIRMED" | "PROCESSING";
  placedAt?: string;
}

export interface SpreadsheetRow {
  "Order ID": string;
  "Order Date": string;
  "Customer Name": string;
  "Email": string;
  "Phone": string;
  "Address": string;
  "City": string;
  "State": string;
  "Pincode": string;
  "Product Name": string;
  "Product ID/SKU": string;
  "Size": string;
  "Color": string;
  "Quantity": number;
  "Product Price": number;
  "Subtotal": number;
  "Shipping": number;
  "Discount": number;
  "Total Amount": number;
  "Payment Method": string;
  "Payment Status": string;
  "Order Status": string;
}

export interface StoredOrderRecord extends OrderSubmissionPayload {
  orderId: string;
  placedAt: string;
  sheetSynced: boolean;
  sheetSyncStatus: "synced" | "failed" | "pending";
  sheetSyncError?: string | null;
  sheetSyncTimestamp?: string | null;
  rows: SpreadsheetRow[];
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

/**
 * Generate a collision-resistant unique Order ID.
 * Format: ALP-YYYYMMDD-XXXX (e.g. ALP-20260817-8492)
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const timeSlice = Date.now().toString().slice(-3);
  return `ALP-${year}${month}${day}-${randomPart}${timeSlice}`.slice(0, 18);
}

/**
 * Format order items into 22-column Google Sheet rows.
 * If an order has multiple products, each product gets its own row with the same Order ID.
 */
export function formatOrderToSpreadsheetRows(
  order: OrderSubmissionPayload & { orderId: string; placedAt: string }
): SpreadsheetRow[] {
  const {
    orderId,
    placedAt,
    address,
    items,
    subtotal,
    shipping,
    discount = 0,
    total,
    paymentMethod,
    paymentStatus = "CONFIRMED",
    orderStatus = "PLACED",
  } = order;

  const formattedDate = new Date(placedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return items.map((item) => ({
    "Order ID": orderId,
    "Order Date": formattedDate,
    "Customer Name": address.name || "N/A",
    "Email": address.email || "N/A",
    "Phone": address.phone || "N/A",
    "Address": address.address || "N/A",
    "City": address.city || "N/A",
    "State": address.state || "N/A",
    "Pincode": address.pincode || "N/A",
    "Product Name": item.title,
    "Product ID/SKU": String(item.productId || item.id || "N/A"),
    "Size": item.size || "Standard",
    "Color": item.color || "Standard",
    "Quantity": item.quantity,
    "Product Price": item.price,
    "Subtotal": subtotal,
    "Shipping": shipping,
    "Discount": discount,
    "Total Amount": total,
    "Payment Method": paymentMethod.toUpperCase(),
    "Payment Status": paymentStatus,
    "Order Status": orderStatus,
  }));
}

/**
 * Ensure the local fallback data store exists and save order safely.
 * Gracefully handles read-only filesystems in serverless production environments.
 */
export function saveOrderToLocalStore(order: StoredOrderRecord): void {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let orders: StoredOrderRecord[] = [];
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      try {
        const content = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
        orders = JSON.parse(content);
      } catch {
        orders = [];
      }
    }

    const existingIndex = orders.findIndex((o) => o.orderId === order.orderId);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }

    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    // In serverless environments (e.g. Vercel), local filesystem may be read-only
    console.warn("[OrderStore] Local persistence skipped (read-only filesystem or serverless):", err);
  }
}

/**
 * Get all stored orders from local fallback store.
 */
export function getLocalStoredOrders(): StoredOrderRecord[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const content = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("[OrderStore] Failed to read stored orders:", err);
  }
  return [];
}

/**
 * Get a single order by ID from local fallback store.
 */
export function getOrderById(orderId: string): StoredOrderRecord | null {
  try {
    const orders = getLocalStoredOrders();
    const found = orders.find((o) => o.orderId === orderId || (o as any).reference === orderId);
    return found || null;
  } catch (err) {
    console.warn("[OrderStore] Failed to get order by id:", err);
    return null;
  }
}

// Re-export for backward compatibility
export { sendToGoogleSheetWebhook, maskWebhookUrl, syncOrderToGoogleSheets };

/**
 * Main order processing service function.
 * Synchronizes orders to Google Sheets and sets sheetSyncStatus appropriately.
 */
export async function processOrderSubmission(
  payload: OrderSubmissionPayload
): Promise<{
  success: boolean;
  orderId: string;
  order: StoredOrderRecord;
  sheetSynced: boolean;
  sheetSyncStatus: "synced" | "failed";
  sheetSyncError?: string | null;
  message: string;
}> {
  const orderId = payload.orderId || generateOrderId();
  const placedAt = payload.placedAt || new Date().toISOString();

  const completePayload = {
    ...payload,
    orderId,
    placedAt,
    paymentStatus: payload.paymentStatus || "CONFIRMED",
    orderStatus: payload.orderStatus || "PLACED",
  };

  const rows = formatOrderToSpreadsheetRows(completePayload);

  // Send to Google Sheets (Service Account Direct API or Webhook)
  const sheetResult = await syncOrderToGoogleSheets(rows);

  const storedRecord: StoredOrderRecord = {
    ...completePayload,
    orderId,
    placedAt,
    sheetSynced: sheetResult.success,
    sheetSyncStatus: sheetResult.success ? "synced" : "failed",
    sheetSyncError: sheetResult.error || null,
    sheetSyncTimestamp: sheetResult.success ? new Date().toISOString() : null,
    rows,
  };

  // Server-side local fallback persistence (non-blocking in serverless)
  saveOrderToLocalStore(storedRecord);

  // Sync to GitHub content layer if applicable
  try {
    const { saveContentOrder } = await import("@/lib/content");
    saveContentOrder({
      orderId: storedRecord.orderId,
      placedAt: storedRecord.placedAt,
      customer: {
        name: storedRecord.address?.name || "Customer",
        email: storedRecord.address?.email || "",
        phone: storedRecord.address?.phone || "",
      },
      address: storedRecord.address,
      items: storedRecord.items,
      subtotal: storedRecord.subtotal,
      shipping: storedRecord.shipping,
      discount: storedRecord.discount || 0,
      total: storedRecord.total,
      paymentMethod: storedRecord.paymentMethod,
      paymentStatus: storedRecord.paymentStatus || "CONFIRMED",
      orderStatus: storedRecord.orderStatus || "PLACED",
      sheetSynced: storedRecord.sheetSynced,
      sheetSyncError: storedRecord.sheetSyncError,
      sheetSyncTimestamp: storedRecord.sheetSyncTimestamp,
    });
  } catch (contentErr) {
    // Non-blocking content sync warning
    console.warn("[OrderService] Could not save order to content/ layer:", contentErr);
  }

  return {
    success: sheetResult.success,
    orderId,
    order: storedRecord,
    sheetSynced: sheetResult.success,
    sheetSyncStatus: sheetResult.success ? "synced" : "failed",
    sheetSyncError: sheetResult.error || null,
    message: sheetResult.success
      ? "Order placed and recorded to Google Sheet successfully."
      : sheetResult.error || "Failed to record order to Google Sheet.",
  };
}
