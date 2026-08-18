import { getContentCoupons } from "@/lib/content";
import { CouponManagerClient } from "@/components/admin/CouponManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = getContentCoupons();

  return <CouponManagerClient initialCoupons={coupons} />;
}
