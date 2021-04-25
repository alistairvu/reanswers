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
    const tags = await Tag.find({}).sort({ count: -1 }).limit(10)
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
    const questions = await Question.find({
      tags: mongoose.Types.ObjectId(tagId),
    })
    res.send({ success: 1, questions: questions })
  } catch (err) {
    next(err)
  }
}
