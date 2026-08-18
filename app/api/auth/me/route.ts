import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ user: null })
    }
    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      include: {
        profile: true,
      }
    })
    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message }, { status: 500 })
  }
}
