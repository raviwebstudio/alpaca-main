import fs from "fs";
import path from "path";
import {
  syncOrderToGoogleSheets,
  sendToGoogleSheetWebhook,
  maskWebhookUrl,
  HEADERS,
} from "./googleSheets";
import { normalizePhone } from "./security";

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

  const cleanPhone = normalizePhone(address.phone) || address.phone || "N/A";

  return items.map((item) => ({
    "Order ID": orderId,
    "Order Date": formattedDate,
    "Customer Name": address.name || "N/A",
    "Email": address.email || "N/A",
    "Phone": cleanPhone,
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
export function saveOrderToLocalStore(order: StoredOrderRecord): boolean {
  try {
    const dataDir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (mkdirErr) {
        // Read-only filesystem in Vercel production serverless
        console.warn("[OrderStore] Cannot create data dir (read-only filesystem):", mkdirErr);
        return false;
      }
    }

    let currentOrders: StoredOrderRecord[] = [];
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      try {
        const fileData = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
        currentOrders = JSON.parse(fileData);
        if (!Array.isArray(currentOrders)) currentOrders = [];
      } catch {
        currentOrders = [];
      }
    }

    // Insert or update order by orderId
    const existingIndex = currentOrders.findIndex((o) => o.orderId === order.orderId);
    if (existingIndex >= 0) {
      currentOrders[existingIndex] = order;
    } else {
      currentOrders.unshift(order);
    }

    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(currentOrders, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("[OrderStore] Failed to persist order locally (normal in Vercel serverless):", err);
    return false;
  }
}

/**
 * Get stored orders from local fallback file.
 */
export function getLocalStoredOrders(): StoredOrderRecord[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const fileData = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
      const orders = JSON.parse(fileData);
      return Array.isArray(orders) ? orders : [];
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
  const cleanPhone = normalizePhone(payload.address?.phone || "");

  const completePayload = {
    ...payload,
    address: {
      ...payload.address,
      phone: cleanPhone,
    },
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
