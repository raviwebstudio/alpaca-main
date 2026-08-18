import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser, comparePassword, hashPassword } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { currentPassword, newPassword } = await req.json()

    const dbUser = await db.user.findUnique({ where: { id: user.id } })
    if (!dbUser || !dbUser.passwordHash) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const isValid = await comparePassword(currentPassword, dbUser.passwordHash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const newHash = await hashPassword(newPassword)
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
