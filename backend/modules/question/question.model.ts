import mongoose from "mongoose"
import Answer from "../answer/answer.model"
import Bookmark, { BookmarkSchemaInterface } from "../bookmark/bookmark.model"
import Like from "../like/like.model"
import Tag from "../tag/tag.model"

export interface QuestionSchemaInterface extends mongoose.Document {
  title: string
  body: string
  updates: string
  imageUrl: string
  tags: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId
  bookmarks: BookmarkSchemaInterface[]
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
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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
  justOne: false,
})

QuestionSchema.virtual("bookmarks", {
  ref: "bookmark",
  localField: "_id",
  foreignField: "questionId",
  justOne: false,
})

QuestionSchema.virtual("likeCount", {
  ref: "like",
  localField: "_id",
  foreignField: "questionId",
  count: true,
})

QuestionSchema.index({ title: "text", body: "text", updates: "text" })

QuestionSchema.pre(
  "remove",
  async function (this: QuestionSchemaInterface, next: any) {
    await Answer.remove({ question: this._id })
    await Bookmark.remove({ questionId: this._id })
    await Like.remove({ questionId: this._id })

    const updateTags = async (id: mongoose.Types.ObjectId) => {
      await Tag.findOneAndUpdate({ _id: id }, { $inc: { count: -1 } })
    }
    const updateTagPromises = []

    for (let tag of this.tags) {
      updateTagPromises.push(updateTags(tag))
    }

    await Promise.all(updateTagPromises)

    next()
  }
)

export default mongoose.model<QuestionSchemaInterface>(
  "question",
  QuestionSchema
)
