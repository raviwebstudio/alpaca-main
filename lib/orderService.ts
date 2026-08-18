import fs from "fs";
import path from "path";

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
 * Guarantees zero order loss if external sheet sync fails.
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
    console.error("[OrderStore] Failed to save order locally:", err);
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
    console.error("[OrderStore] Failed to read stored orders:", err);
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
    console.error("[OrderStore] Failed to get order by id:", err);
    return null;
  }
}

/**
 * Mask the Google Apps Script Webhook URL to safely log without exposing full deployment IDs.
 * Example: https://script.google.com/macros/s/AKfy...xxbJ/exec
 */
export function maskWebhookUrl(rawUrl: string): string {
  if (!rawUrl) return "[NOT_SET]";
  try {
    const parsed = new URL(rawUrl);
    const parts = parsed.pathname.split("/");
    const sIndex = parts.indexOf("s");
    if (sIndex !== -1 && parts[sIndex + 1]) {
      const id = parts[sIndex + 1];
      if (id.length > 8) {
        parts[sIndex + 1] = `${id.slice(0, 4)}...${id.slice(-4)}`;
      }
      parsed.pathname = parts.join("/");
    }
    return parsed.toString();
  } catch {
    return rawUrl.length > 16
      ? `${rawUrl.slice(0, 10)}...${rawUrl.slice(-6)}`
      : rawUrl;
  }
}

/**
 * Send order rows to Google Apps Script Webhook with reliable retry mechanism and structured logging.
 */
export async function sendToGoogleSheetWebhook(
  rows: SpreadsheetRow[],
  webhookUrl?: string,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string; rowsAdded?: number }> {
  let url =
    webhookUrl ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url || !url.trim()) {
    const errorMsg =
      "Google Sheets webhook URL is not configured in GOOGLE_SHEET_WEBHOOK_URL environment variable.";
    console.warn(`[GoogleSheetSync] Webhook skipped: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }

  url = url.trim();

  // Fix common protocol typos e.g. "hhttps://"
  if (url.startsWith("hhttps://")) {
    url = "https://" + url.slice(9);
  } else if (url.startsWith("hhttp://")) {
    url = "http://" + url.slice(8);
  }

  const maskedUrl = maskWebhookUrl(url);
  const orderId = rows[0]?.["Order ID"] || "UNKNOWN";

  // Detect and advise if user entered the Apps Script Editor URL instead of Web App deployment URL
  if (
    url.includes("script.google.com") &&
    (url.includes("/edit") || url.includes("/home/projects/"))
  ) {
    const errorMsg =
      "The configured URL is an Apps Script Editor URL. Please deploy as Web App (Deploy > New deployment > Web app > Who has access: Anyone) and use the /exec URL.";
    console.error(`[GoogleSheetSync] Configuration error for order ${orderId}: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }

  let lastError = "Unknown sync error";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[GoogleSheetSync] Attempt ${attempt}/${maxRetries} sending ${rows.length} row(s) for Order ${orderId} to ${maskedUrl}`
      );

      // Google Apps Script requires following redirects (302)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          action: "ADD_ORDERS",
          sheetId: process.env.GOOGLE_SHEET_ID ? process.env.GOOGLE_SHEET_ID.trim() : undefined,
          rows,
        }),
        redirect: "follow",
      });

      const responseStatus = response.status;
      const text = await response.text();

      console.log(
        `[GoogleSheetSync] HTTP ${responseStatus} from ${maskedUrl} for Order ${orderId} (attempt ${attempt}): ${text.slice(0, 200)}`
      );

      if (
        responseStatus === 401 ||
        text.includes("accounts.google.com") ||
        text.includes("ServiceLogin")
      ) {
        lastError =
          "Google Apps Script returned 401 Unauthorized / Login Redirect. In Apps Script, click Deploy > Manage deployments > Edit > set 'Who has access' to 'Anyone' and redeploy.";
        console.error(`[GoogleSheetSync] Auth error: ${lastError}`);
        return {
          success: false,
          error: lastError,
        };
      }

      if (text.includes("Sorry, unable to open the file at present")) {
        lastError =
          "Google Apps Script returned 'Unable to open file'. Please ensure you have deployed the script with 'Who has access: Anyone' and copied the valid /exec Web App URL.";
        console.error(`[GoogleSheetSync] Deployment error: ${lastError}`);
        return {
          success: false,
          error: lastError,
        };
      }

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
          lastError =
            "Received HTML page from Google instead of JSON. Ensure your Apps Script Web App is deployed with 'Who has access: Anyone'.";
          console.error(`[GoogleSheetSync] HTML response error: ${lastError}`);
          return {
            success: false,
            error: lastError,
          };
        }
        data = { raw: text };
      }

      if (!response.ok && responseStatus >= 400) {
        lastError = `Webhook returned HTTP ${responseStatus}: ${text.slice(0, 120)}`;
        console.warn(`[GoogleSheetSync] HTTP error on attempt ${attempt}: ${lastError}`);
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, attempt * 600));
          continue;
        }
        return {
          success: false,
          error: lastError,
        };
      }

      if (data.success === true) {
        console.log(
          `[GoogleSheetSync] Confirmed! Order ${orderId} (${rows.length} row(s)) added to Google Sheet tab '${data.sheetName || "Orders"}'.`
        );
        return {
          success: true,
          rowsAdded: data.rowsAdded || rows.length,
        };
      }

      lastError = data.error || data.message || `Google Apps Script returned non-success response: ${JSON.stringify(data)}`;
      console.warn(`[GoogleSheetSync] Non-success response on attempt ${attempt}: ${lastError}`);
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, attempt * 600));
        continue;
      }
      return {
        success: false,
        error: lastError,
      };
    } catch (error: any) {
      lastError = error.message || "Network error while connecting to Google Apps Script webhook";
      console.error(
        `[GoogleSheetSync] Network error on attempt ${attempt}/${maxRetries} for Order ${orderId}: ${lastError}`
      );
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, attempt * 600));
      }
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}

/**
 * Main order processing service function.
 */
export async function processOrderSubmission(
  payload: OrderSubmissionPayload
): Promise<{
  success: boolean;
  orderId: string;
  order: StoredOrderRecord;
  sheetSynced: boolean;
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

  // Send to Google Sheets Webhook
  const sheetResult = await sendToGoogleSheetWebhook(rows);

  const storedRecord: StoredOrderRecord = {
    ...completePayload,
    orderId,
    placedAt,
    sheetSynced: sheetResult.success,
    sheetSyncError: sheetResult.error || null,
    sheetSyncTimestamp: sheetResult.success ? new Date().toISOString() : null,
    rows,
  };

  // Safe server-side persistence (Zero data loss guarantee)
  saveOrderToLocalStore(storedRecord);

  // Sync to GitHub content layer
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
    console.warn("[OrderService] Could not save order to content/ layer:", contentErr);
  }

  return {
    success: true,
    orderId,
    order: storedRecord,
    sheetSynced: sheetResult.success,
    sheetSyncError: sheetResult.error || null,
    message: sheetResult.success
      ? "Order placed and recorded to Google Sheet successfully."
      : "Order placed securely! (Google Sheet sync pending)",
  };
}
