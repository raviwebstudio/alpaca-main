import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { firstName, lastName, phone } = await req.json()

    // Update phone on User
    if (phone) {
      await db.user.update({
        where: { id: user.id },
        data: { phone }
      })
    }

    // Update or create CustomerProfile for name
    await db.customerProfile.upsert({
      where: { userId: user.id },
      update: { firstName: firstName || '', lastName: lastName || '' },
      create: {
        userId: user.id,
        firstName: firstName || 'Admin',
        lastName: lastName || '',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
