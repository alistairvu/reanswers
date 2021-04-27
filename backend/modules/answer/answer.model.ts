import mongoose from "mongoose"

export interface AnswerSchemaInterface extends mongoose.Document {
  title: string
  likedBy: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId
  question: mongoose.Types.ObjectId
}

const AnswerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likedBy: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    question: {
      type: mongoose.Types.ObjectId,
      ref: "question",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

AnswerSchema.virtual("likes", {
  ref: "like",
  localField: "_id",
  foreignField: "answerId",
  justOne: false,
})

AnswerSchema.virtual("likeCount", {
  ref: "like",
  localField: "_id",
  foreignField: "answerId",
  count: true,
})

AnswerSchema.index({ content: "text" })

export default mongoose.model<AnswerSchemaInterface>("answer", AnswerSchema)
