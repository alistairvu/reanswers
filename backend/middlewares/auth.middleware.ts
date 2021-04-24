import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import User from "../modules/user/user.model"
import HTTPError from "../httpError"

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

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      req.user = undefined
      return next()
    }

    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
      req.user = undefined
      return next()
    }

    const { _id } = jwt.decode(token) as {
      _id: string
    }

    const user = await User.findById(_id)
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}
