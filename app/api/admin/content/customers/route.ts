import { NextResponse } from "next/server";
import { getContentCustomers } from "@/lib/content";

export async function GET() {
  try {
    const customers = getContentCustomers();
    const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalOrdersAll = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);

    return NextResponse.json({
      success: true,
      customers,
      stats: {
        totalCustomers: customers.length,
        totalSpentAll,
        totalOrdersAll,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
