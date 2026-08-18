import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, address: true, customer: true }
  });
  return NextResponse.json(order);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await req.json();
    const order = await db.order.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
