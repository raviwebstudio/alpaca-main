import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await req.json();
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      paymentId: `pay_TEST_${Date.now()}`,
      mode: "TEST",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Simulation failed" }, { status: 500 });
  }
}
