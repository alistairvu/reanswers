import Question from "./question.model"
import Tag from "../tag/tag.model"
import mongoose from "mongoose"
import HTTPError from "../../httpError"
import { Request, Response, NextFunction } from "express"

// GET (all)

// GET (one)

//POST /api/questions
export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, imageUrl, tags } = req.body
    const author = req.user._id
    const tagIds: mongoose.Types.ObjectId[] = []

    for (let tag of tags) {
      await Tag.findOneAndUpdate(
        { title: tag },
        { $inc: { count: 1 } },
        { upsert: true }
      )
      const createdTag = await Tag.findOne({ title: tag })
      tagIds.push(createdTag._id)
    }

    const question = await Question.create({
      title,
      body,
      imageUrl,
      tags: tagIds,
      author,
    })

    res.send({ success: 1, data: question })
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
      throw new HTTPError("No matching quetions found", 404)
    }

    if (question.author.toString() !== req.user._id.toString()) {
      throw new HTTPError("Action not allowed", 401)
    }

    res.send({ success: 1, deleted: 1 })
  } catch (err) {
    next(err)
  }
}
