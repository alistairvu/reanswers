import mongoose from "mongoose"

export interface BookmarkSchemaInterface extends mongoose.Document {
  questionId: mongoose.Types.ObjectId
  answerId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
}

const BookmarkSchema = new mongoose.Schema({
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
})

export default mongoose.model<BookmarkSchemaInterface>(
  "bookmark",
  BookmarkSchema
)
