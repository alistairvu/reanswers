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

UserSchema.virtual("bookmarks", {
  ref: "bookmark",
  localField: "_id",
  foreignField: "userId",
})

export default mongoose.model<UserSchemaInterface>("user", UserSchema)
