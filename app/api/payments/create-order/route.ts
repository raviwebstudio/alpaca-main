import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, items } = await req.json();
    if (!amount || !items?.length) {
      return NextResponse.json({ success: false, error: "Invalid order data" }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      orderId: `ALPACA_${Date.now()}`,
      razorpayOrderId: `order_DUMMY_${Date.now()}`,
      amount,
      currency: "INR",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
