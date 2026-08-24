import Link from "next/link";
import {
  ExternalLink,
  FileSpreadsheet,
  FolderGit2,
  KeyRound,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const serviceAccountConfigured = Boolean(
    (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL) &&
      (process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) &&
      (process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SPREADSHEET_ID)
  );
  const webhookConfigured = Boolean(
    process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL
  );
  const sheetIdConfigured = Boolean(
    process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SPREADSHEET_ID
  );
  const isSyncActive = serviceAccountConfigured || webhookConfigured;

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Store & Content Settings</h1>
        <p className="text-sm text-[#78716C] mt-1">
          Configure Pages CMS GitHub connection, Google Sheets synchronization, and store preferences.
        </p>
      </div>

      {/* Card 1: Pages CMS & GitHub Integration */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-stone-900 text-white rounded-xl">
              <FolderGit2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#1C1917]">
                Pages CMS & GitHub Content Architecture
              </h2>
              <p className="text-xs text-[#78716C]">
                GitHub is the single source of truth. Flat JSON files are stored in <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">content/</span>
              </p>
            </div>
          </div>

          <a
            href="https://pagescms.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
          >
            Launch Pages CMS
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <p className="font-semibold text-stone-900">Schema File</p>
            <p className="text-stone-600 font-mono">.pages.yml</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <p className="font-semibold text-stone-900">Media Upload Directory</p>
            <p className="text-stone-600 font-mono">public/products/media/</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <p className="font-semibold text-stone-900">Products Catalog</p>
            <p className="text-stone-600 font-mono">content/products/*.json</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <p className="font-semibold text-stone-900">Orders & Customers</p>
            <p className="text-stone-600 font-mono">content/orders/ & content/customers/</p>
          </div>
        </div>
      </div>

      {/* Card 2: Google Sheets Synchronization */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#1C1917]">
                Google Sheets Auto-Sync
              </h2>
              <p className="text-xs text-[#78716C]">
                22-column real-time order appending via Google Sheets API (Service Account) or Webhook
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isSyncActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {serviceAccountConfigured
              ? "Service Account Active"
              : webhookConfigured
              ? "Webhook Active"
              : "Pending Setup"}
          </span>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-700 font-medium">Service Account Auth:</span>
            <span className="font-mono text-stone-600">
              {serviceAccountConfigured
                ? "GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY (Active)"
                : "Not Configured"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-700 font-medium">Spreadsheet Target ID:</span>
            <span className="font-mono text-stone-600">
              {sheetIdConfigured ? "GOOGLE_SHEET_ID (Active)" : "Not Configured"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-700 font-medium">Webhook URL Fallback:</span>
            <span className="font-mono text-stone-600">
              {webhookConfigured ? "GOOGLE_SHEET_WEBHOOK_URL (Active)" : "Not Configured"}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Admin Profile & Security */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
              <UserCircle size={22} />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#1C1917]">
                Admin Profile & Credentials
              </h2>
              <p className="text-xs text-[#78716C]">
                Manage administrator credentials, name, email, and password.
              </p>
            </div>
          </div>

          <Link
            href="/admin/profile"
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-semibold transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
