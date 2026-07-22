import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await db.order.findMany({
    include: {
      customer: { include: { profile: true } },
      items: { include: { product: true } },
      address: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}
