import mongoose from "mongoose"

export interface QuestionSchemaInterface extends mongoose.Document {
  title: string
  body: string
  updates: string
  imageUrl: string
  tags: mongoose.Types.ObjectId[]
  likedBy: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId[]
  answers: mongoose.Types.ObjectId[]
}

const QuestionSchema = new mongoose.Schema(
    {
      title: {
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
        required: true
      },
      answers:{
        type: [
          {
            type: mongoose.Types.ObjectId,
            ref: "answer",
          },
        ],
        default: [],
      }
    },
    { timestamps: true }
  )


export default mongoose.model<QuestionSchemaInterface>("question", QuestionSchema)