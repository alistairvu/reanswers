import Tag from "./tag.model"
import Question from "../question/question.model"
import mongoose from "mongoose"
import { Request, Response, NextFunction } from "express"

// GET /api/tags/top
export const getTopTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await Tag.find({
      count: { $gt: 0 },
    })
      .sort({ count: -1 })
      .limit(10)
    res.send({ success: 1, tags: tags })
  } catch (err) {
    next(err)
  }
}

// GET /api/tags/:id
export const getQuestionsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: tagId } = req.params
    const limit = Number(req.query.limit) || 10
    const skip = Number(req.query.skip) || 0

    const [tagInfo, questions, questionCount] = await Promise.all([
      Tag.findById(tagId),
      Question.find({ tags: mongoose.Types.ObjectId(tagId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .populate("author", "username email")
        .populate("tags", "title")
        .populate("likeCount")
        .populate({
          path: "likes",
          match: { userId: req.user ? req.user._id : null },
        })
        .populate({
          path: "bookmarks",
          match: { userId: req.user ? req.user._id : null },
        }),
      Question.find({ tags: mongoose.Types.ObjectId(tagId) }).countDocuments(),
    ])

    console.log(tagInfo)

    res.send({
      success: 1,
      questions: questions,
      tagInfo: tagInfo,
      questionCount: questionCount,
      nextCursor: skip + limit,
    })
  } catch (err) {
    next(err)
  }
}
