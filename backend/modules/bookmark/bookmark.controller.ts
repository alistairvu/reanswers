import Question from "../question/question.model"
import Answer from "../answer/answer.model"
import Bookmark from "./bookmark.model"
import { Response, Request } from "express"
import HTTPError from "../../httpError"

// POST /api/bookmarks

export const handleBookmark = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const { questionId, answerId } = req.body

    if (questionId) {
      const question = await Question.findById(questionId)
      if (!question) {
        throw new HTTPError("No matching questions found!", 404)
      }

      const existingLike = await Bookmark.findOne({
        questionId: questionId,
        userId: req.user._id,
      })
      if (existingLike) {
        await existingLike.remove()
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
        data: data,
        message: `User ${req.user._id} added question ${questionId} to their bookmarks`,
      })
    }

    if (answerId) {
      const answer = await Answer.findById(answerId)
      if (!answer) {
        throw new HTTPError("No matching answers found", 404)
      }
      const existingLike = await Bookmark.findOne({
        answerId: answerId,
        userId: req.user._id,
      })
      if (existingLike) {
        await existingLike.remove()
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
        data: data,
        message: `User ${req.user._id} added answer ${answerId} to their bookmarks`,
      })
    }
  } catch (err) {
    next(err)
  }
}
