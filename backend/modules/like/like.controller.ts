import Question from "../question/question.model"
import Answer from "../answer/answer.model"
import Like from "./like.model"
import { Response, Request } from "express"
import HTTPError from "../../httpError"

// POST /api/likes

export const handleLike = async (req: Request, res: Response, next: any) => {
  try {
    const { questionId, answerId } = req.body

    if (questionId) {
      const question = await Question.findById(questionId)
      if (!question) {
        throw new HTTPError("No matching questions found!", 404)
      }

      const existingLike = await Like.findOne({
        questionId: questionId,
        userId: req.user._id,
      })
      if (existingLike) {
        await existingLike.remove()
        return res.send({
          success: 1,
          message: `User ${req.user._id} unliked question ${questionId}`,
        })
      }
      const data = Like.create({
        userId: req.user._id,
        questionId: questionId,
      })
      return res.send({
        success: 1,
        data: data,
        message: `User ${req.user._id} liked question ${questionId}`,
      })
    }

    if (answerId) {
      const answer = await Answer.findById(answerId)
      if (!answer) {
        throw new HTTPError("No matching answers found", 404)
      }
      const existingLike = await Like.findOne({
        answerId: answerId,
        userId: req.user._id,
      })
      if (existingLike) {
        await existingLike.remove()
        return res.send({
          success: 1,
          message: `User ${req.user._id} unliked answer ${answerId}`,
        })
      }
      const data = Like.create({
        userId: req.user._id,
        answerId: answerId,
      })
      return res.send({
        success: 1,
        data: data,
        message: `User ${req.user._id} liked answer ${answerId}`,
      })
    }
  } catch (err) {
    next(err)
  }
}


// POST api/likes/check

export const checkLike = async (req: Request, res: Response, next: any) => {
  
}