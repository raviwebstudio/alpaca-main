import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await req.json();
    const seller = await db.sellerProfile.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}
