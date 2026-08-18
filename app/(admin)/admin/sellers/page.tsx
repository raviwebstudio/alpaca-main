import { db } from '@/lib/db';
import SellerListClient from './SellerListClient';

export const dynamic = 'force-dynamic';

export default async function SellersPage() {
  const sellers = await db.sellerProfile.findMany({
    include: {
      user: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Sellers</h1>
        <p className="text-[#78716C] text-sm mt-1">Manage seller accounts and approvals</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0D8D0] overflow-hidden">
        <SellerListClient sellers={sellers} />
      </div>
    </div>
  );
}
