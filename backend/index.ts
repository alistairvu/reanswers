import express, { Request, Response, NextFunction } from "express"
import http from "http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db"

import authRouter from "./modules/auth/auth.router"

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status, message } = err
  res.status(status || 500).send({ success: 0, message: message })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
