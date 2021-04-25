import User from "../user/user.model"
import HTTPError from "../../httpError"
import { Request, Response, NextFunction } from "express"
import argon from "argon2"
import { genAccessToken, genRefreshToken } from "../../jwt"
import { setAdd, setRemove, setIsMember } from "../../redis"
import jwt from "jsonwebtoken"

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
    if (existingUser) {
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
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { login, password } = req.body

    const existingUser = await User.findOne({
      $or: [{ username: login }, { email: login }],
    })
    if (!existingUser) {
      throw new HTTPError("Wrong login/password combination", 401)
    }

    const hashPassword = existingUser.password
    const comparedPassword = await argon.verify(hashPassword, password)
    if (!comparedPassword)
      throw new HTTPError("Wrong login/password combination", 401)

    const accessToken = genAccessToken(existingUser._id)
    const refreshToken = genRefreshToken(existingUser._id)
    await setAdd(`reanswers-${existingUser._id}`, refreshToken)

    res.cookie("refresh", refreshToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 20 * 365 * 24 * 3600 * 1000,
    })

    res.send({ success: 1, user: existingUser, token: accessToken })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/refresh
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh: refreshToken } = req.cookies
    console.log(refreshToken)

    if (!refreshToken) {
      throw new HTTPError("No valid tokens found", 422)
    }

    let _id: string

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ) as {
        _id: string
      }
      _id = payload._id
    } catch (error) {
      throw new HTTPError("Invalid token", 401)
    }

    const isRefreshToken = await setIsMember(`reanswers-${_id}`, refreshToken)
    if (!isRefreshToken) {
      throw new HTTPError("Token expired", 401)
    }

    const accessToken = genAccessToken(_id)

    return res.send({
      success: 1,
      token: accessToken,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/status
export const getLoginStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh: refreshToken } = req.cookies

    if (!refreshToken) {
      return res.send({ success: 1, loggedIn: 0 })
    }

    let _id: string

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ) as {
        _id: string
      }
      _id = payload._id
    } catch (error) {
      return res.send({ success: 1, loggedIn: 0 })
    }

    const user = await User.findById(_id)
    if (!user) {
      return res.send({ success: 1, loggedIn: 0 })
    }

    const isRefreshToken = await setIsMember(`reanswers-${_id}`, refreshToken)
    if (!isRefreshToken) {
      return res.send({ success: 1, loggedIn: 0 })
    }

    const accessToken = genAccessToken(_id)

    return res.send({
      success: 1,
      loggedIn: 1,
      user: user,
      token: accessToken,
    })
  } catch (err) {
    next(err)
  }
}

// DELETE api/auth/logout
export const logoutUser = async (req: Request, res: Response, next: any) => {
  try {
    const { refresh: refreshToken } = req.cookies
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { _id: string }

    await setRemove(`reanswers-${payload._id}`, refreshToken)

    res.clearCookie("refreshToken")

    res.send({ success: 1, loggedOut: 1 })
  } catch (err) {
    next(err)
  }
}
