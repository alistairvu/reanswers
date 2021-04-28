import mongoose from "mongoose"

export interface BookmarkSchemaInterface extends mongoose.Document {
  questionId: mongoose.Types.ObjectId
  answerId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
}

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    questionId: {
      type: mongoose.Types.ObjectId,
      required: function () {
        return !this.answerId
      },
    },
    answerId: {
      type: mongoose.Types.ObjectId,
      required: function () {
        return !this.questionId
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

BookmarkSchema.virtual("question", {
  ref: "question",
  localField: "questionId",
  foreignField: "_id",
  justOne: true,
})

BookmarkSchema.virtual("answer", {
  ref: "answer",
  localField: "answerId",
  foreignField: "_id",
  justOne: true,
})

export default mongoose.model<BookmarkSchemaInterface>(
  "bookmark",
  BookmarkSchema
)
