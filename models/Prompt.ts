import mongoose, { Schema, Document } from 'mongoose'

export interface IPrompt extends Document {
  title: string
  slug: string
  content: string
  description: string
  category: mongoose.Types.ObjectId
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  useCase: string
  example?: string
  variables?: { name: string; description: string }[]
  copyCount: number
  likeCount: number
  isActive: boolean
  isFeatured: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PromptSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    useCase: { type: String, default: '' },
    example: { type: String, default: '' },
    variables: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    copyCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

PromptSchema.index({ title: 'text', content: 'text', description: 'text', tags: 'text' })
PromptSchema.index({ category: 1, isActive: 1 })
PromptSchema.index({ isFeatured: 1, isActive: 1 })

export default mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema)
