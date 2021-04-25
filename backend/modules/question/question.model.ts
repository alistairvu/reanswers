import mongoose from "mongoose"

export interface QuestionSchemaInterface extends mongoose.Document {
  title: string
  body: string
  updates: string
  imageUrl: string
  tags: mongoose.Types.ObjectId[]
  likedBy: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId
  answers: mongoose.Types.ObjectId[]
}

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    updates: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    tags: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "tag",
        },
      ],
      default: [],
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
  },
  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
)

QuestionSchema.virtual("answers", {
  ref: "answer",
  localField: "_id",
  foreignField: "question",
})

QuestionSchema.virtual("likes", {
  ref: "like",
  localField: "_id",
  foreignField: "questionId",
  justOne: false
})

export default mongoose.model<QuestionSchemaInterface>(
  "question",
  QuestionSchema
)
