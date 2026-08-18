/**
 * ALPACA E-COMMERCE GOOGLE APPS SCRIPT WEBHOOK (ROOT FIX)
 * 
 * -------------------------------------------------------------
 * QUICK SETUP (3 Minutes):
 * -------------------------------------------------------------
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
 * 2. Copy the SPREADSHEET ID from the URL (the long string between /d/ and /edit).
 * 3. Paste your SPREADSHEET ID below into GOOGLE_SHEET_ID.
 * 4. In your Google Sheet, click: Extensions > Apps Script.
 * 5. Delete all existing code, paste this ENTIRE file, and click Save (Cmd+S / Ctrl+S).
 * 6. Click: Deploy > New deployment.
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set:
 *    - Description: "ALPACA Order Sync"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so the server can post orders)
 * 9. Click "Deploy", authorize access if prompted ("Advanced" > "Go to Untitled project (unsafe)").
 * 10. Copy the Web App URL (ends in /exec) and paste into your .env.local:
 *     GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
 */

// =========================================================================
// 1. CONFIGURATION: Paste your Google Spreadsheet ID here
// Example URL: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
// The ID is: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
// =========================================================================
const GOOGLE_SHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

// The tab/sheet name where all customer orders will be recorded
const ORDERS_SHEET_NAME = "Orders";

// Exactly 22 columns matching ALPACA order schema
const HEADERS = [
  "Order ID",
  "Order Date",
  "Customer Name",
  "Email",
  "Phone",
  "Address",
  "City",
  "State",
  "Pincode",
  "Product Name",
  "Product ID/SKU",
  "Size",
  "Color",
  "Quantity",
  "Product Price",
  "Subtotal",
  "Shipping",
  "Discount",
  "Total Amount",
  "Payment Method",
  "Payment Status",
  "Order Status"
];

/**
 * Open the target spreadsheet by explicit ID.
 */
function openTargetSpreadsheet(payload) {
  var sheetId = (payload && payload.sheetId) ? payload.sheetId.toString().trim() : GOOGLE_SHEET_ID.trim();

  // If placeholder is still present, try getActiveSpreadsheet only as fallback
  if (!sheetId || sheetId === "YOUR_SPREADSHEET_ID_HERE") {
    try {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) {
        Logger.log("[Sync] Using active container spreadsheet: " + active.getId());
        return active;
      }
    } catch (e) {}
    var errMsg = "GOOGLE_SHEET_ID is not configured in Code.gs. Please paste your Google Spreadsheet ID into line 26 of Code.gs.";
    Logger.log("[Sync Error] " + errMsg);
    console.error(errMsg);
    throw new Error(errMsg);
  }

  try {
    var ss = SpreadsheetApp.openById(sheetId);
    Logger.log("[Sync] Successfully opened spreadsheet: " + ss.getName() + " (" + sheetId + ")");
    return ss;
  } catch (err) {
    var openErr = "Could not open Google Sheet with ID '" + sheetId + "'. Verify the ID and ensure your Google account has edit access: " + err.toString();
    Logger.log("[Sync Error] " + openErr);
    console.error(openErr, err);
    throw new Error(openErr);
  }
}

/**
 * Find or create the "Orders" tab.
 */
function getOrCreateOrdersSheet(ss) {
  var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
  if (!sheet) {
    // If default "Sheet1" exists and is blank, rename it to "Orders"
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0) {
      defaultSheet.setName(ORDERS_SHEET_NAME);
      sheet = defaultSheet;
      Logger.log("[Sync] Renamed empty 'Sheet1' to '" + ORDERS_SHEET_NAME + "'");
    } else {
      sheet = ss.insertSheet(ORDERS_SHEET_NAME);
      Logger.log("[Sync] Created new sheet tab '" + ORDERS_SHEET_NAME + "'");
    }
  }
  return sheet;
}

/**
 * Ensure all 22 column headers are present with styling and freeze top row.
 */
function ensureHeaders(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2C241D");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    Logger.log("[Sync] Appended 22 headers to empty Orders sheet.");
  } else {
    var firstRow = sheet.getRange(1, 1, 1, Math.min(HEADERS.length, Math.max(sheet.getLastColumn(), 1))).getValues()[0];
    if (firstRow[0] !== HEADERS[0]) {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      var headerRange2 = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange2.setFontWeight("bold");
      headerRange2.setBackground("#2C241D");
      headerRange2.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
      Logger.log("[Sync] Inserted 22 headers at row 1.");
    }
  }
}

/**
 * Handle POST request from ALPACA website checkout.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for concurrent write locks
    lock.waitLock(30000);

    Logger.log("[Sync] Incoming POST request received.");

    var rawContents = "";
    if (e && e.postData && e.postData.contents) {
      rawContents = e.postData.contents;
    } else if (e && e.parameter && e.parameter.payload) {
      rawContents = e.parameter.payload;
    }

    if (!rawContents) {
      var noDataMsg = "No POST data or payload received in request.";
      Logger.log("[Sync Error] " + noDataMsg);
      return createJsonResponse({ success: false, error: noDataMsg });
    }

    var payload;
    try {
      payload = JSON.parse(rawContents);
    } catch (parseErr) {
      Logger.log("[Sync Error] Failed to parse JSON: " + parseErr.toString());
      return createJsonResponse({ success: false, error: "Invalid JSON payload: " + parseErr.toString() });
    }

    // 1. Open Google Sheet via explicit ID
    var ss = openTargetSpreadsheet(payload);
    var sheet = getOrCreateOrdersSheet(ss);
    ensureHeaders(sheet);

    // 2. Build rows to insert (one row per product, sharing Order ID)
    var rowsToInsert = [];

    // Format A: Payload contains formatted 22-column rows array
    if (Array.isArray(payload.rows) && payload.rows.length > 0) {
      rowsToInsert = payload.rows.map(function(row) {
        if (Array.isArray(row)) return row;
        return HEADERS.map(function(header) {
          var val = row[header];
          return (val !== undefined && val !== null) ? val : "";
        });
      });
    }
    // Format B: Direct order object with items array
    else if (payload.items && Array.isArray(payload.items) && payload.items.length > 0) {
      var order = payload;
      var orderId = order.orderId || ("ALP-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000));
      var placedAt = order.placedAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      var addr = order.address || {};

      rowsToInsert = order.items.map(function(item) {
        return [
          orderId,
          placedAt,
          addr.name || "",
          addr.email || "",
          addr.phone || "",
          addr.address || "",
          addr.city || "",
          addr.state || "",
          addr.pincode || "",
          item.title || item.name || "Alpaca Product",
          String(item.productId || item.id || item.sku || "N/A"),
          item.size || "Standard",
          item.color || "Standard",
          Number(item.quantity) || 1,
          Number(item.price) || 0,
          Number(order.subtotal) || 0,
          Number(order.shipping) || 0,
          Number(order.discount) || 0,
          Number(order.total) || 0,
          String(order.paymentMethod || "UPI").toUpperCase(),
          String(order.paymentStatus || "CONFIRMED"),
          String(order.orderStatus || "PLACED")
        ];
      });
    }
    // Format C: Single row object
    else if (typeof payload === "object" && payload["Order ID"]) {
      rowsToInsert = [
        HEADERS.map(function(header) {
          var val = payload[header];
          return (val !== undefined && val !== null) ? val : "";
        })
      ];
    }

    if (rowsToInsert.length === 0) {
      var noRowsMsg = "No valid order items found in payload to write to sheet.";
      Logger.log("[Sync Error] " + noRowsMsg);
      return createJsonResponse({ success: false, error: noRowsMsg });
    }

    // 3. Write rows to sheet
    var nextRow = sheet.getLastRow() + 1;
    var writeRange = sheet.getRange(nextRow, 1, rowsToInsert.length, HEADERS.length);
    writeRange.setValues(rowsToInsert);

    // 4. Format monetary columns (cols 15-19)
    try {
      sheet.getRange(nextRow, 15, rowsToInsert.length, 5).setNumberFormat("₹#,##0.00");
    } catch (fmtErr) {}

    // Flush changes to guarantee immediate persistence
    SpreadsheetApp.flush();

    var targetOrderId = rowsToInsert[0][0] || "N/A";
    Logger.log("[Sync Success] Added " + rowsToInsert.length + " row(s) for Order " + targetOrderId + " starting at row " + nextRow);

    return createJsonResponse({
      success: true,
      message: "Order successfully synchronized to Google Sheet",
      orderId: targetOrderId,
      rowsAdded: rowsToInsert.length,
      startRow: nextRow,
      sheetName: ORDERS_SHEET_NAME,
      spreadsheetName: ss.getName()
    });

  } catch (error) {
    Logger.log("[Sync Exception] " + error.toString());
    console.error("ALPACA Webhook Error", error);
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: error.message || error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check & setup diagnostic endpoint (GET request).
 * Open your /exec URL in a browser to test that your sheet connection is fully operational!
 */
function doGet(e) {
  try {
    var ss = openTargetSpreadsheet(null);
    var sheet = getOrCreateOrdersSheet(ss);
    ensureHeaders(sheet);

    return createJsonResponse({
      status: "ACTIVE",
      service: "ALPACA Google Sheet Webhook",
      spreadsheetId: ss.getId(),
      spreadsheetName: ss.getName(),
      ordersSheetName: sheet.getName(),
      totalRows: sheet.getLastRow(),
      totalColumns: sheet.getLastColumn(),
      headers: HEADERS,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      status: "CONFIG_REQUIRED",
      service: "ALPACA Google Sheet Webhook",
      error: err.toString(),
      instructions: "Please paste your Google Sheet ID into line 26 of Code.gs, Save, and Redeploy.",
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Utility to return ContentService JSON output with proper mime type.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
