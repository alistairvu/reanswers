import Question from "../question/question.model"
import Tag from "../tag/tag.model"
import { Response, Request, NextFunction } from "express"

// GET /api/search
export const searchQuestionsByKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 10

    const [questions, questionCount] = await Promise.all([
      Question.find({
        $or: [
          { title: { $regex: `${keyword}`, $options: "i" } },
          { body: { $regex: `${keyword}`, $options: "i" } },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .populate("author", "username email")
        .populate("tags", "title")
        .populate({
          path: "likes",
          match: { userId: req.user ? req.user._id : null },
        }),
      Question.find({
        text: { $regex: `${keyword}`, $options: "i" },
      }).countDocuments(),
    ])

    res.send({
      success: 1,
      questions: questions,
      questionCount: questionCount,
      nextCursor: skip + limit,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/search/tags
export const searchQuestionsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 10

    const tag = await Tag.findOne({ title: keyword as string })

    if (!tag) {
      return res.send({
        success: 1,
        questions: [],
        questionCount: 0,
        nextCursor: skip + limit,
      })
    }

    const questions = await Question.find({ tag: tag._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .populate("author", "username email")
      .populate("tags", "title")
      .populate({
        path: "likes",
        match: { userId: req.user ? req.user._id : null },
      })

    res.send({
      success: 1,
      questions: questions,
      questionCount: tag.count,
      nextCursor: skip + limit,
    })
  } catch (err) {
    next(err)
  }
}
