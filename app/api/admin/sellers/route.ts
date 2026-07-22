import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sellers = await db.sellerProfile.findMany({
    include: {
      user: true,
      _count: { select: { products: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(sellers);
}
