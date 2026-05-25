import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  promptCount: number
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    icon: { type: String, default: '✨' },
    color: { type: String, default: '#7c3aed' },
    promptCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
