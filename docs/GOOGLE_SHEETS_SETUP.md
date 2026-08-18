# ALPACA Google Sheets Integration Setup Guide

Follow these steps to connect your ALPACA e-commerce checkout to automatically append incoming orders into your Google Sheet.

---

## Step 1: Get Your Google Sheet ID
1. Open your Google Sheet in your browser (e.g. `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`).
2. Copy the **Spreadsheet ID** from the URL (the string between `/d/` and `/edit`).

---

## Step 2: Configure Code.gs
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any default code.
3. Open [`google-apps-script/Code.gs`](../google-apps-script/Code.gs) from this project.
4. Replace `YOUR_SPREADSHEET_ID_HERE` on line 26 with your actual Spreadsheet ID:
   ```javascript
   const GOOGLE_SHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
   ```
5. Paste the entire code into Apps Script and click **Save** (Cmd+S / Ctrl+S).

---

## Step 3: Deploy Web App with Public Access
1. In Apps Script, click the blue **Deploy** button (top-right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure deployment settings:
   - **Description**: `ALPACA Order Sync`
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: `Anyone` *(CRITICAL: Must be set to Anyone so server can POST without login)*
4. Click **Deploy**.
5. Authorize access if prompted (Click **Advanced** > **Go to Untitled project (unsafe)**).
6. Copy the **Web App URL** provided (ending in `/exec`).

---

## Step 4: Configure ALPACA Environment
1. In your project root, open `.env.local`:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   GOOGLE_SHEET_ID="YOUR_SPREADSHEET_ID"
   ```
2. Test your webhook by opening the `/exec` URL in your browser:
   It should return:
   ```json
   {
     "status": "ACTIVE",
     "service": "ALPACA Google Sheet Webhook",
     "ordersSheetName": "Orders",
     "headers": [...]
   }
   ```

---

## Google Sheet Columns (22 Columns Auto-Generated)
The script will automatically format and generate the following headers on your first order:

| Col # | Header | Description |
| :--- | :--- | :--- |
| 1 | `Order ID` | Unique ID (e.g. `ALP-20260817-8492`) |
| 2 | `Order Date` | Timestamp in IST formatted date |
| 3 | `Customer Name` | Full customer name |
| 4 | `Email` | Customer email address |
| 5 | `Phone` | Customer 10-digit phone number |
| 6 | `Address` | Shipping address |
| 7 | `City` | Shipping city |
| 8 | `State` | Shipping state |
| 9 | `Pincode` | 6-digit postal code |
| 10 | `Product Name` | Name of the purchased item |
| 11 | `Product ID/SKU`| Product ID or SKU |
| 12 | `Size` | Selected product size |
| 13 | `Color` | Selected product color |
| 14 | `Quantity` | Quantity ordered |
| 15 | `Product Price` | Individual item price (INR ₹) |
| 16 | `Subtotal` | Order subtotal (INR ₹) |
| 17 | `Shipping` | Shipping charge (INR ₹) |
| 18 | `Discount` | Discount applied (INR ₹) |
| 19 | `Total Amount` | Total order amount paid (INR ₹) |
| 20 | `Payment Method`| Payment method (UPI / CARD / NETBANKING) |
| 21 | `Payment Status`| Payment confirmation status (CONFIRMED / PAID) |
| 22 | `Order Status` | Order status (PLACED / PROCESSING) |

---

## Multi-Product Orders
If an order contains multiple items (e.g., 3 different items), the system generates **3 separate rows** in the spreadsheet. Each row contains the specific product details while sharing the **same Order ID**, customer info, and total values.

---

## Zero-Loss Resilience
If Google Sheets is momentarily unreachable or if the webhook URL has not been configured yet:
- The order is **never lost**.
- It is saved locally on the server in `data/orders.json` with status `sheetSynced: false`.
- The customer completes checkout without failure, and you can re-sync pending orders using the `/api/orders/retry-sync` endpoint.
