import jwt from "jsonwebtoken"

export const genAccessToken = (userId: string) => {
  const token = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })
  return token
}

export const genRefreshToken = (userId: string) => {
  const token = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET)
  return token
}
