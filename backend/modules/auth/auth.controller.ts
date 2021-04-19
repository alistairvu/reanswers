import User from "../user/user.model"
import HTTPError from "../../httpError"
import { Request, Response, NextFunction } from "express"
import argon from "argon2"
import { genAccessToken, genRefreshToken } from "../../jwt"
import { setAdd } from "../../redis"

// POST /api/auth/signup
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })
    if (!existingUser) {
      throw new HTTPError("User already exists", 422)
    }

    const passwordDigest = await argon.hash(password)
    const newUser = await User.create({
      username,
      email,
      password: passwordDigest,
    })

    const accessToken = genAccessToken(newUser._id)
    const refreshToken = genRefreshToken(newUser._id)

    await setAdd(`reanswers-${newUser._id}`, refreshToken)

    res.cookie("refresh", refreshToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 20 * 365 * 24 * 3600 * 1000,
    })

    res.send({ success: 1, user: newUser, token: accessToken })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login

// GET /api/auth/status
