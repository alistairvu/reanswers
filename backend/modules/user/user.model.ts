import mongoose from "mongoose"

export interface UserSchemaInterface extends mongoose.Document {
  username: string
  email: string
  password: string
  questions: mongoose.Types.ObjectId[]
  answers: mongoose.Types.ObjectId[]
  bookmarks: mongoose.Types.ObjectId[]
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    questions: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "question",
        },
      ],
      default: [],
    },
    answers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "answer",
        },
      ],
      default: [],
    },
    bookmarks: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "question",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

export default mongoose.model<UserSchemaInterface>("user", UserSchema)
