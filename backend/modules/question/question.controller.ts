import Question from "./question.model"
import Tag from "../tag/tag.model"
import mongoose from "mongoose"
import HTTPError from "../../httpError"
import { Request, Response, NextFunction } from "express"

// GET /api/questions
export const getQuestions = async (req: Request, res: Response, next: any) => {
  try {
    const limit = Number(req.query.limit) || 10
    const skip = Number(req.query.skip) || 0
    const sort = req.query.sort
    const order = sort == "top" ? { likedBy: -1 } : { createdAt: -1 }

    const [questions, questionCount] = await Promise.all([
      Question.find({})
        .sort(order)
        .select("-__v")
        .populate("author", "username email")
        .populate("tags", "title")
        .populate({
          path: "likes",
          match: { userId: req.user ? req.user._id : null },
        }),
      Question.find({}).countDocuments(),
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

// GET /api/questions/:id
export const showQuestion = async (req: Request, res: Response, next: any) => {
  try {
    const question = await Question.findById(req.params.id)
      .select("-__v")
      .populate("author", "username email")
      .populate("tags", "title")
      .populate({
        path: "likes",
        match: { userId: req.user ? req.user._id : null },
      })

    if (!question) {
      throw new HTTPError("No matching questions found", 404)
    }

    res.send({ success: 1, question: question })
  } catch (err) {
    next(err)
  }
}

//POST /api/questions
export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, imageUrl, tags } = req.body
    console.log({ title, body })
    const author = req.user._id
    let tagIds: mongoose.Types.ObjectId[] = []

    if (tags) {
      const tagPromises: Promise<mongoose.Types.ObjectId>[] = []

      const createTag = async (tag: string) => {
        await Tag.findOneAndUpdate(
          { title: tag },
          { $inc: { count: 1 } },
          { upsert: true }
        )
        const createdTag = await Tag.findOne({ title: tag })
        return createdTag._id
      }

      for (let tag of tags) {
        tagPromises.push(createTag(tag))
      }

      tagIds = await Promise.all(tagPromises)
    }

    const question = await Question.create({
      title,
      body,
      imageUrl,
      tags: tagIds,
      author,
    })

    res.send({ success: 1, question: question })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/questions/:id
export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id)

    if (!question) {
      throw new HTTPError("No matching questions found", 404)
    }

    if (question.author.toString() !== req.user._id.toString()) {
      throw new HTTPError("Action not allowed", 401)
    }

    res.send({ success: 1, deleted: 1 })
  } catch (err) {
    next(err)
  }
}

// POST /api/questions/:id
export const updateQuestion = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const { content } = req.body

    const question = await Question.findById(req.params.id)
    if (!question) {
      throw new HTTPError("No matching questions found", 404)
    }

    if (!content.trim()) {
      throw new HTTPError("No update content inserted", 422)
    }

    const updatedQuestion = await Question.updateOne(
      { _id: req.params.id },
      { updates: content }
    )
    res.send({ success: 1, question: updatedQuestion })
  } catch (err) {
    next(err)
  }
}
