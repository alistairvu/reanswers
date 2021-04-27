import { Response, Request } from "express"
import Answer from "./answer.model"
import Question from "../question/question.model"
import Notification from "../notification/notification.model"
import HTTPError from "../../httpError"

// GET /api/answers/questions/:id
export const getAnswers = async (req: Request, res: Response, next: any) => {
  try {
    const questionId = req.params.id
    const question = await Question.findById(questionId)

    const limit = Number(req.query.limit) || 10
    const skip = Number(req.query.skip) || 0

    if (!question) {
      throw new HTTPError("No matching questions found", 404)
    }

    const [answers, answerCount] = await Promise.all([
      Answer.find({
        question: questionId,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "-password")
        .populate("likeCount")
        .populate({
          path: "likes",
          match: { userId: req.user ? req.user._id : null },
        })
        .populate({
          path: "bookmarks",
          match: { userId: req.user ? req.user._id : null },
        }),
      Answer.find({ question: questionId }).countDocuments(),
    ])

    res.send({
      success: 1,
      answers: answers,
      answerCount: answerCount,
      nextCursor: limit + skip,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/answers
export const createAnswer = async (req: Request, res: Response, next: any) => {
  try {
    const { questionId, content } = req.body
    const question = await Question.findById(questionId)

    if (!question) {
      throw new HTTPError("No matching questions found!", 404)
    }

    const answer = await Answer.create({
      content: content,
      question: questionId,
      author: req.user._id,
    })

    await answer.populate("author", "-password").execPopulate()

    // TODO: change to callback
    const answerNotification = await Notification.create({
      title: `New answer for your question: ${question.title}`,
      body: `${req.user.username} answered your question!`,
      subscribers: [question.author],
      link: `/questions/${questionId}`,
    })

    req.io
      .to(question.author.toString())
      .emit("notification", answerNotification)

    res.send({ success: 1, answer: answer })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/answers/:id
export const deleteAnswer = async (req: Request, res: Response, next: any) => {
  try {
    const answerId = req.params.id
    const answer = await Answer.findById(answerId)

    if (!answer) {
      throw new HTTPError("No matching answers found!", 404)
    }
    await Answer.findByIdAndDelete(answerId)
    res.send({ success: 1, deleted: 1 })
  } catch (err) {
    next(err)
  }
}
