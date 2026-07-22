import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await db.product.findMany({
    include: { category: true, seller: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    
    // Admin needs a dummy seller or proper seller assignment for now
    // We will assign the first seller if any, or create a dummy one if schema requires it
    const firstSeller = await db.sellerProfile.findFirst();
    if (!firstSeller) {
      return NextResponse.json({ error: 'No sellers exist in system. Create a seller first.' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        ...data,
        sellerId: firstSeller.id
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
