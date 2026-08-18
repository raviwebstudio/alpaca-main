import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/content";

export async function GET() {
  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
