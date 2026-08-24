import crypto from "crypto";
import type { SpreadsheetRow } from "./orderService";
import {
  getGoogleSheetsConfig,
  normalizePrivateKey,
  maskEnvSecret,
  type GoogleSheetsConfig,
} from "./env";

export const HEADERS = [
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
  "Order Status",
];

// In-memory token cache to prevent repeated OAuth roundtrips
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

// Re-export helpers for backward compatibility
export const formatPrivateKey = normalizePrivateKey;
export const maskString = maskEnvSecret;

/**
 * Retrieve Google Service Account access token using OAuth 2.0 JWT Bearer flow.
 * Uses native Node.js crypto module for RS256 signing.
 */
export async function getGoogleServiceAccountAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if valid for at least another 60 seconds
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.token;
  }

  const normalizedKey = normalizePrivateKey(privateKey);
  if (!normalizedKey || !normalizedKey.includes("PRIVATE KEY")) {
    const keyError =
      "Invalid GOOGLE_PRIVATE_KEY format: Must be a valid PEM formatted RSA private key containing '-----BEGIN PRIVATE KEY-----'.";
    console.error(`[GoogleSheetsAPI] Auth Error: ${keyError}`);
    throw new Error(keyError);
  }

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const claimSet = {
    iss: clientEmail.trim(),
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedClaimSet = Buffer.from(JSON.stringify(claimSet)).toString("base64url");
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  let signature: string;
  try {
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    signature = signer.sign(normalizedKey, "base64url");
  } catch (signErr: any) {
    console.error(
      `[GoogleSheetsAPI] Failed to sign JWT with provided private key: ${signErr.message}`
    );
    throw new Error(`Google Service Account Private Key signing failed: ${signErr.message}`);
  }

  const jwtAssertion = `${unsignedToken}.${signature}`;

  console.log(
    `[GoogleSheetsAPI] Requesting OAuth access token for service account ${maskEnvSecret(clientEmail, 6)}...`
  );

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtAssertion,
    }),
  });

  const tokenText = await tokenResponse.text();
  let tokenData: any;
  try {
    tokenData = JSON.parse(tokenText);
  } catch {
    tokenData = { raw: tokenText };
  }

  if (!tokenResponse.ok || !tokenData.access_token) {
    const errorDescription =
      tokenData.error_description || tokenData.error || `HTTP ${tokenResponse.status}: ${tokenText}`;
    console.error(
      `[GoogleSheetsAPI] OAuth Authentication failed (${tokenResponse.status}): ${errorDescription}`
    );
    throw new Error(`Google Service Account authentication failed: ${errorDescription}`);
  }

  const expiresIn = Number(tokenData.expires_in) || 3600;
  cachedAccessToken = {
    token: tokenData.access_token,
    expiresAt: now + expiresIn,
  };

  console.log(`[GoogleSheetsAPI] Successfully obtained OAuth access token (valid for ${expiresIn}s)`);
  return tokenData.access_token;
}

/**
 * Append order rows to Google Sheets via direct Google Sheets API v4 using Service Account.
 */
export async function appendRowsViaGoogleSheetsApi(
  rows: SpreadsheetRow[],
  sheetId: string,
  clientEmail: string,
  privateKey: string,
  tabName: string = "Orders"
): Promise<{ success: boolean; error?: string; rowsAdded?: number }> {
  const orderId = rows[0]?.["Order ID"] || "UNKNOWN";

  try {
    const accessToken = await getGoogleServiceAccountAccessToken(clientEmail, privateKey);

    const values = rows.map((row) =>
      HEADERS.map((header) => {
        const val = row[header as keyof SpreadsheetRow];
        return val !== undefined && val !== null ? val : "";
      })
    );

    const range = `${tabName}!A:V`;
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      sheetId
    )}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    console.log(
      `[GoogleSheetsAPI] Appending ${rows.length} row(s) for Order ${orderId} to spreadsheet ${maskEnvSecret(
        sheetId,
        4
      )} (tab: ${tabName})...`
    );

    const response = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range,
        majorDimension: "ROWS",
        values,
      }),
    });

    const responseText = await response.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      // If tab does not exist (HTTP 400 "Unable to parse range"), create tab and add headers first
      if (
        response.status === 400 &&
        (responseText.includes("Unable to parse range") || responseText.includes(tabName))
      ) {
        console.log(`[GoogleSheetsAPI] Tab '${tabName}' not found. Initializing tab with headers...`);
        await initializeSheetTabWithHeaders(sheetId, accessToken, tabName);

        // Retry append once after tab initialization
        const retryResponse = await fetch(appendUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range,
            majorDimension: "ROWS",
            values,
          }),
        });

        const retryText = await retryResponse.text();
        if (!retryResponse.ok) {
          const retryErr = `Google Sheets API retry failed (${retryResponse.status}): ${retryText}`;
          console.error(`[GoogleSheetsAPI] Write failure for Order ${orderId}: ${retryErr}`);
          return { success: false, error: retryErr };
        }

        console.log(
          `[GoogleSheetsAPI] Confirmed! Order ${orderId} (${rows.length} row(s)) written to Google Sheet '${tabName}'.`
        );
        return { success: true, rowsAdded: rows.length };
      }

      const errorMessage =
        responseData.error?.message ||
        responseData.error_description ||
        `HTTP ${response.status}: ${responseText}`;

      console.error(
        `[GoogleSheetsAPI] Write failure for Order ${orderId} (${response.status}): ${errorMessage}`
      );

      // Check for common permission error
      if (response.status === 403 || response.status === 401) {
        console.error(
          `[GoogleSheetsAPI] Permission Denied: Ensure your Google Sheet is shared with edit access to service account email: ${clientEmail}`
        );
      }

      return {
        success: false,
        error: `Google Sheets API error: ${errorMessage}`,
      };
    }

    const updatedRows =
      responseData.updates?.updatedRows || responseData.updates?.updatedRange ? rows.length : rows.length;

    console.log(
      `[GoogleSheetsAPI] Confirmed! Order ${orderId} (${rows.length} row(s)) written to Google Sheet '${tabName}'.`
    );

    return {
      success: true,
      rowsAdded: updatedRows,
    };
  } catch (err: any) {
    const errorMsg = err.message || "Unknown error occurred while calling Google Sheets API";
    console.error(`[GoogleSheetsAPI] Error syncing order ${orderId}: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Initialize a sheet tab and add the 22 column headers.
 */
async function initializeSheetTabWithHeaders(
  sheetId: string,
  accessToken: string,
  tabName: string
): Promise<void> {
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          },
        ],
      }),
    });
  } catch (tabErr) {
    console.warn(`[GoogleSheetsAPI] Tab creation notice:`, tabErr);
  }

  const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    sheetId
  )}/values/${encodeURIComponent(`${tabName}!A1:V1`)}?valueInputOption=USER_ENTERED`;

  await fetch(headerUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      range: `${tabName}!A1:V1`,
      majorDimension: "ROWS",
      values: [HEADERS],
    }),
  });
}

/**
 * Mask the Google Apps Script Webhook URL to safely log without exposing full deployment IDs.
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
    return rawUrl.length > 16 ? `${rawUrl.slice(0, 10)}...${rawUrl.slice(-6)}` : rawUrl;
  }
}

/**
 * Send order rows to Google Apps Script Webhook.
 */
export async function sendToGoogleSheetWebhook(
  rows: SpreadsheetRow[],
  webhookUrl?: string,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string; rowsAdded?: number }> {
  const config = getGoogleSheetsConfig();
  let url = webhookUrl || config.webhookUrl;

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

  if (url.startsWith("hhttps://")) {
    url = "https://" + url.slice(9);
  } else if (url.startsWith("hhttp://")) {
    url = "http://" + url.slice(8);
  }

  const maskedUrl = maskWebhookUrl(url);
  const orderId = rows[0]?.["Order ID"] || "UNKNOWN";

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

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "ADD_ORDERS",
          sheetId: config.sheetId,
          rows,
        }),
        redirect: "follow",
      });

      const responseStatus = response.status;
      const text = await response.text();

      console.log(
        `[GoogleSheetSync] HTTP ${responseStatus} from ${maskedUrl} for Order ${orderId} (attempt ${attempt}): ${text.slice(
          0,
          200
        )}`
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
          `[GoogleSheetSync] Confirmed! Order ${orderId} (${rows.length} row(s)) added to Google Sheet tab '${
            data.sheetName || "Orders"
          }'.`
        );
        return {
          success: true,
          rowsAdded: data.rowsAdded || rows.length,
        };
      }

      lastError =
        data.error ||
        data.message ||
        `Google Apps Script returned non-success response: ${JSON.stringify(data)}`;
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
 * Unified Google Sheet Sync Function.
 * Uses centralized getGoogleSheetsConfig() from lib/env.ts.
 */
export async function syncOrderToGoogleSheets(
  rows: SpreadsheetRow[]
): Promise<{
  success: boolean;
  error?: string;
  rowsAdded?: number;
  method?: "service_account" | "webhook";
}> {
  const config = getGoogleSheetsConfig();

  // 1. Try Direct Google Sheets API if Service Account credentials exist
  if (config.hasServiceAccount && config.serviceAccountEmail && config.privateKey && config.sheetId) {
    console.log(
      `[GoogleSheetSync] Service Account credentials detected. Using Direct Google Sheets API v4...`
    );
    const apiResult = await appendRowsViaGoogleSheetsApi(
      rows,
      config.sheetId,
      config.serviceAccountEmail,
      config.privateKey,
      config.sheetName
    );

    if (apiResult.success) {
      return {
        success: true,
        rowsAdded: apiResult.rowsAdded,
        method: "service_account",
      };
    }

    console.warn(
      `[GoogleSheetSync] Direct Google Sheets API failed: ${apiResult.error}. Checking for webhook fallback...`
    );

    // If webhook is also available, try it as fallback
    if (config.webhookUrl) {
      console.log(`[GoogleSheetSync] Attempting Webhook fallback...`);
      const webhookResult = await sendToGoogleSheetWebhook(rows, config.webhookUrl);
      if (webhookResult.success) {
        return {
          success: true,
          rowsAdded: webhookResult.rowsAdded,
          method: "webhook",
        };
      }
    }

    return {
      success: false,
      error: apiResult.error,
      method: "service_account",
    };
  }

  // 2. Try Google Apps Script Webhook if configured
  if (config.hasWebhook && config.webhookUrl) {
    console.log(`[GoogleSheetSync] Google Sheets Webhook URL detected. Using Webhook sync...`);
    const webhookResult = await sendToGoogleSheetWebhook(rows, config.webhookUrl);
    return {
      success: webhookResult.success,
      error: webhookResult.error,
      rowsAdded: webhookResult.rowsAdded,
      method: "webhook",
    };
  }

  // 3. Neither credentials configured
  const missingConfigError =
    "Google Sheets credentials are not configured in environment variables. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID (or GOOGLE_SHEET_WEBHOOK_URL).";
  console.error(`[GoogleSheetSync] Config Error: ${missingConfigError}`);

  return {
    success: false,
    error: missingConfigError,
  };
}
