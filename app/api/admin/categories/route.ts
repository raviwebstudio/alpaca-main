import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: { select: { products: true } },
        parent: { select: { name: true } },
        children: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ success: true, categories })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { name, slug, description, image, parentId } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 })
    }
    if (!slug || !slug.trim()) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await db.category.findUnique({ where: { slug: slug.trim() } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'A category with this slug already exists' }, { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId && parentId !== '' && parentId !== 'none' ? parentId : null,
      }
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
