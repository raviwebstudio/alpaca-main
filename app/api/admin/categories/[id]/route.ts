import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const { id } = await params
    const body = await req.json()
    const { name, slug, description, image, parentId } = body

    const category = await db.category.update({
      where: { id },
      data: {
        name: name?.trim(),
        slug: slug?.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId && parentId !== '' && parentId !== 'none' ? parentId : null,
      }
    })
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params

    // Check if category has products
    const productCount = await db.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete — ${productCount} products use this category. Reassign them first.`
      }, { status: 400 })
    }

    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
