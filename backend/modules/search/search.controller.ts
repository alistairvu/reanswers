import Question from "../question/question.model"
import Answer from "../answer/answer.model"
import Tag from "../tag/tag.model"
import { Response, Request, NextFunction } from "express"

// GET /api/search/questions
export const searchQuestionsByKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword, sort } = req.query
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 10

    const order =
      sort === "latest" ? { createdAt: -1 } : { score: { $meta: "textScore" } }

    const [questions, questionCount] = await Promise.all([
      Question.find(
        {
          $text: {
            $search: keyword as string,
            $caseSensitive: false,
          },
        },
        { score: { $meta: "textScore" } }
      )
        .sort(order)
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
      Question.find({
        $text: {
          $search: keyword as string,
          $caseSensitive: false,
        },
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

    console.log(tag)

    if (!tag) {
      return res.send({
        success: 1,
        questions: [],
        questionCount: 0,
        nextCursor: skip + limit,
      })
    }

    const questions = await Question.find({ tags: tag._id })
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
      })

    console.log(questions)

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

// GET /api/search/answers
export const searchAnswersByKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword, sort } = req.query
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 10

    const order =
      sort === "latest" ? { createdAt: -1 } : { score: { $meta: "textScore" } }

    const [answers, answerCount] = await Promise.all([
      Answer.find(
        {
          $text: {
            $search: keyword as string,
            $caseSensitive: false,
          },
        },
        { score: { $meta: "textScore" } }
      )
        .sort(order)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .populate("author", "username")
        .populate("likeCount")
        .populate({
          path: "likes",
          match: { userId: req.user ? req.user._id : null },
        })
        .populate({
          path: "bookmarks",
          match: { userId: req.user ? req.user._id : null },
        }),
      Answer.find({
        $text: {
          $search: keyword as string,
          $caseSensitive: false,
        },
      }).countDocuments(),
    ])

    res.send({
      success: 1,
      answers: answers,
      answerCount: answerCount,
      nextCursor: skip + limit,
    })
  } catch (err) {
    next(err)
  }
}
