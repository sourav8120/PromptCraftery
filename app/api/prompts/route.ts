import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Prompt from '@/models/Prompt'
import Category from '@/models/Category'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const difficulty = searchParams.get('difficulty')
    const adminView = searchParams.get('admin') === 'true'
    const skip = (page - 1) * limit

    const query: any = {}
    if (!adminView) query.isActive = true
    if (category) query.category = category
    if (featured === 'true') query.isFeatured = true
    if (difficulty) query.difficulty = difficulty

    if (search) {
      query.$text = { $search: search }
    }

    const [prompts, total] = await Promise.all([
      Prompt.find(query)
        .populate('category', 'name slug icon color')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prompt.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: prompts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
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
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      + '-' + Date.now()

    const prompt = await Prompt.create({
      ...body,
      slug,
      createdBy: (session.user as any).id,
    })

    // Update category count
    await Category.findByIdAndUpdate(body.category, { $inc: { promptCount: 1 } })

    const populated = await Prompt.findById(prompt._id).populate('category', 'name slug icon color')
    return NextResponse.json({ success: true, data: populated }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
