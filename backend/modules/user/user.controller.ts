import User from "./user.model"
import { Request, Response, NextFunction } from "express"
import HTTPError from "../../httpError"
import argon from "argon2"

// GET /api/users/:id
export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId).select("-password")

    if (!user) {
      throw new HTTPError("No matching user found", 404)
    }

    res.send({ success: 1, user: user })
  } catch (err) {
    next(err)
  }
}

// POST /api/users/:id
export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })

    if (existingUser && existingUser._id.toString() !== req.params.id) {
      throw new HTTPError("Username or email already taken", 422)
    }

    if (req.user._id.toString() !== req.params.id) {
      throw new HTTPError("You cannot update this user", 401)
    }

    const user = await User.findById(req.params.id)

    user.username = username || user.username
    user.email = email || user.email

    if (password) {
      const passwordDigest = await argon.hash(password)
      user.password = passwordDigest
    }
    await user.save()

    res.send({ success: 1, user: user })
  } catch (err) {
    next(err)
  }
}
