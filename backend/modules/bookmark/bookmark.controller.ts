import Question from "../question/question.model"
import Answer from "../answer/answer.model"
import Bookmark from "./bookmark.model"
import { Response, Request, NextFunction } from "express"
import HTTPError from "../../httpError"

// POST /api/bookmarks
export const handleBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questionId, answerId } = req.body

    if (questionId) {
      const question = await Question.findById(questionId)
      if (!question) {
        throw new HTTPError("No matching questions found!", 404)
      }

      const existingBookmark = await Bookmark.findOne({
        questionId: questionId,
        userId: req.user._id,
      })
      if (existingBookmark) {
        await existingBookmark.remove()
        return res.send({
          success: 1,
          message: `User ${req.user._id} added question ${questionId} to their bookmarks`,
        })
      }

      const data = await Bookmark.create({
        userId: req.user._id,
        questionId: questionId,
      })
      return res.send({
        success: 1,
        bookmark: data,
        message: `User ${req.user._id} added question ${questionId} to their bookmarks`,
      })
    }

    if (answerId) {
      const answer = await Answer.findById(answerId)
      if (!answer) {
        throw new HTTPError("No matching answers found", 404)
      }

      const existingBookmark = await Bookmark.findOne({
        answerId: answerId,
        userId: req.user._id,
      })
      if (existingBookmark) {
        await existingBookmark.remove()
        return res.send({
          success: 1,
          message: `User ${req.user._id} removed answer ${answerId} to their bookmarks`,
        })
      }

      const data = await Bookmark.create({
        userId: req.user._id,
        answerId: answerId,
      })

      return res.send({
        success: 1,
        bookmark: data,
        message: `User ${req.user._id} added answer ${answerId} to their bookmarks`,
      })
    }
  } catch (err) {
    next(err)
  }
}

// GET /api/bookmarks/questions
export const getBookmarkedQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.query.limit) || 10
    const skip = Number(req.query.skip) || 0

    const [bookmarks, bookmarkCount] = await Promise.all([
      Bookmark.find({
        userId: req.user._id,
        questionId: { $exists: true },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "question",
          populate: [
            {
              path: "tags",
            },
            {
              path: "author",
              select: "-password",
            },
            {
              path: "likeCount",
            },
            {
              path: "likes",
              match: { userId: req.user ? req.user._id : null },
            },
            {
              path: "bookmarks",
              match: { userId: req.user ? req.user._id : null },
            },
          ],
        }),
      Bookmark.find({
        userId: req.user._id,
        questionId: { $exists: true },
      }).countDocuments(),
    ])

    res.send({
      success: 1,
      bookmarks: bookmarks,
      bookmarkCount: bookmarkCount,
      nextCursor: skip + limit,
    })
  } catch (err) {
    next(err)
  }
}
