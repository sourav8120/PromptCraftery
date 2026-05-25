import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') !== 'false'
    const query = activeOnly ? { isActive: true } : {}
    const categories = await Category.find(query).sort({ sortOrder: 1, name: 1 }).lean()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const body = await req.json()
    const { name, description, icon, color, sortOrder } = body
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const existing = await Category.findOne({ slug })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 })
    }
    const category = await Category.create({ name, slug, description, icon, color, sortOrder })
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
