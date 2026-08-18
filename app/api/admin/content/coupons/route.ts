import { NextRequest, NextResponse } from "next/server";
import {
  getContentCoupons,
  getContentCouponByCode,
  saveContentCoupon,
  deleteContentCoupon,
  type ContentCoupon,
} from "@/lib/content";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const coupon = getContentCouponByCode(code);
      if (!coupon) {
        return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, coupon });
    }

    const coupons = getContentCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContentCoupon;

    if (!body || !body.code || body.discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount value are required" },
        { status: 400 }
      );
    }

    const newCoupon: ContentCoupon = {
      code: body.code.trim().toUpperCase(),
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue) || 0,
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      expiresAt: body.expiresAt || undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      usageLimit: Number(body.usageLimit) || 100,
      usageCount: Number(body.usageCount) || 0,
      description: body.description || "",
    };

    saveContentCoupon(newCoupon);

    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "Code is required" }, { status: 400 });
    }

    const deleted = deleteContentCoupon(code);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
