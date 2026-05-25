import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Prompt from '@/models/Prompt'
import Category from '@/models/Category'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const prompt = await Prompt.findById(params.id).populate('category', 'name slug icon color')
    if (!prompt) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: prompt })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const body = await req.json()
    const oldPrompt = await Prompt.findById(params.id)
    const prompt = await Prompt.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
      .populate('category', 'name slug icon color')
    if (!prompt) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Update category counts if category changed
    if (oldPrompt && body.category && oldPrompt.category.toString() !== body.category) {
      await Category.findByIdAndUpdate(oldPrompt.category, { $inc: { promptCount: -1 } })
      await Category.findByIdAndUpdate(body.category, { $inc: { promptCount: 1 } })
    }

    return NextResponse.json({ success: true, data: prompt })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const prompt = await Prompt.findByIdAndDelete(params.id)
    if (prompt) {
      await Category.findByIdAndUpdate(prompt.category, { $inc: { promptCount: -1 } })
    }
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
