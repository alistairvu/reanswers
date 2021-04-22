import Tag from "./tag.model"
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
