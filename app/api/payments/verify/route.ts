import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, amount } = await req.json();
    if (!razorpayOrderId) {
      return NextResponse.json({ success: false, error: "Missing Razorpay order id" }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const orderId = `ord_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId,
      paymentId: razorpayPaymentId || `pay_TEST_${Date.now()}`,
      amount,
      status: "CONFIRMED",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
