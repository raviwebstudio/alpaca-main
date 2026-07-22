import { db } from '@/lib/db';
import OrderListClient from './OrderListClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      customer: { include: { profile: true } },
      items: { include: { product: true } },
      address: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Orders</h1>
        <p className="text-[#78716C] text-sm mt-1">Manage and track customer orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0D8D0] overflow-hidden">
        <OrderListClient orders={orders} />
      </div>
    </div>
  );
}
