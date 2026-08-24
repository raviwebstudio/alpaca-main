/**
 * Server-Side Environment Variable Validator & Configuration Helper
 * 
 * Centralizes all Google Sheets and environment credential loading.
 * Ensures credentials are never read directly from process.env throughout the codebase
 * and protects private keys from client leakage.
 */

export interface GoogleSheetsConfig {
  serviceAccountEmail?: string;
  privateKey?: string;
  sheetId?: string;
  sheetName: string;
  webhookUrl?: string;
  hasServiceAccount: boolean;
  hasWebhook: boolean;
  isConfigured: boolean;
}

export interface TurnstileConfig {
  secretKey?: string;
  siteKey?: string;
  isConfigured: boolean;
}

/**
 * Normalizes RSA private keys for Google Service Account authentication.
 * Handles escaped newlines (`\\n` -> `\n`), double quotes, single quotes, and trimming.
 */
export function normalizePrivateKey(rawKey?: string): string {
  if (!rawKey) return "";
  let key = rawKey.trim();

  // Strip leading and trailing double or single quotes
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Replace literal escaped '\n' sequences with real newlines
  key = key.replace(/\\n/g, "\n");

  return key.trim();
}

/**
 * Safely masks sensitive keys/emails for server diagnostic logging.
 */
export function maskEnvSecret(str?: string, keepVisible: number = 4): string {
  if (!str) return "[NOT_SET]";
  const trimmed = str.trim();
  if (trimmed.length <= keepVisible * 2) return "***";
  return `${trimmed.slice(0, keepVisible)}...${trimmed.slice(-keepVisible)}`;
}

/**
 * Validates and retrieves the Google Sheets server configuration.
 * Strictly checks process.env on the server.
 */
export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const serviceAccountEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL ||
    process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;

  const rawPrivateKey =
    process.env.GOOGLE_PRIVATE_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  const sheetId =
    process.env.GOOGLE_SHEET_ID ||
    process.env.GOOGLE_SPREADSHEET_ID ||
    process.env.SPREADSHEET_ID;

  const sheetName = process.env.GOOGLE_SHEET_NAME?.trim() || "Orders";

  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  const privateKey = normalizePrivateKey(rawPrivateKey);

  const hasServiceAccount = Boolean(
    serviceAccountEmail?.trim() &&
    privateKey &&
    privateKey.includes("PRIVATE KEY") &&
    sheetId?.trim()
  );

  const hasWebhook = Boolean(webhookUrl?.trim());
  const isConfigured = hasServiceAccount || hasWebhook;

  return {
    serviceAccountEmail: serviceAccountEmail?.trim() || undefined,
    privateKey: privateKey || undefined,
    sheetId: sheetId?.trim() || undefined,
    sheetName,
    webhookUrl: webhookUrl?.trim() || undefined,
    hasServiceAccount,
    hasWebhook,
    isConfigured,
  };
}

/**
 * Retrieves Cloudflare Turnstile bot protection configuration.
 */
export function getTurnstileConfig(): TurnstileConfig {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  return {
    secretKey,
    siteKey,
    isConfigured: Boolean(secretKey),
  };
}

/**
 * Validates whether Google Sheets credentials exist in the server environment.
 * If credentials are missing, returns a detailed diagnostics error message.
 */
export function validateGoogleSheetsEnv(): {
  valid: boolean;
  config: GoogleSheetsConfig;
  missingKeys: string[];
  errorMessage?: string;
} {
  const config = getGoogleSheetsConfig();
  const missingKeys: string[] = [];

  if (!config.hasServiceAccount && !config.hasWebhook) {
    if (!config.serviceAccountEmail) missingKeys.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    if (!config.privateKey) missingKeys.push("GOOGLE_PRIVATE_KEY");
    if (!config.sheetId) missingKeys.push("GOOGLE_SHEET_ID");

    const errorMessage =
      `Google Sheets credentials are not configured in environment variables. ` +
      `Please configure either Service Account credentials (${missingKeys.join(", ")}) or GOOGLE_SHEET_WEBHOOK_URL.`;

    return {
      valid: false,
      config,
      missingKeys,
      errorMessage,
    };
  }

  return {
    valid: true,
    config,
    missingKeys: [],
  };
}
