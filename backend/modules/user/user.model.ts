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

UserSchema.virtual("questions", {
  ref: "question",
  localField: "_id",
  foreignField: "author",
})

UserSchema.virtual("answers", {
  ref: "answer",
  localField: "_id",
  foreignField: "author",
})

export default mongoose.model<UserSchemaInterface>("user", UserSchema)
