import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import User from "../modules/user/user.model"
import HTTPError from "../httpError"

// GET /api/auth/status
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
      throw new HTTPError("Invalid request", 401)
    }

    let _id: string

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
        _id: string
      }
      _id = payload._id
    } catch (err) {
      throw new HTTPError("Invalid token", 403)
    }

    const user = await User.findById(_id)

    if (!user) {
      throw new HTTPError("Invalid request", 401)
    }

    req.user = user
    next()
  } catch (err) {
    next(new HTTPError(err.message, 403))
  }
}
