import Question from "../question/question.model"
import { Response, Request, NextFunction } from "express"

// GET /api/search
const findQuestionByKeyword = async (
  res: Response,
  req: Request,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err)
  }
}
