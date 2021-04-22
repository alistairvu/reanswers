import mongoose from "mongoose"

interface TagSchemaInterface extends mongoose.Document {
  title: string
  count: number
}

const TagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

TagSchema.index({ title: 1 })

export default mongoose.model<TagSchemaInterface>("tag", TagSchema)
