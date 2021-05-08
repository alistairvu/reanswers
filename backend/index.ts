import express, { Request, Response, NextFunction } from "express"
import http from "http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db"
import morgan from "morgan"
import { Server } from "socket.io"
import path from "path"

import authRouter from "./modules/auth/auth.router"
import questionRouter from "./modules/question/question.router"
import tagRouter from "./modules/tag/tag.router"
import answerRouter from "./modules/answer/answer.router"
import notificationRouter from "./modules/notification/notification.router"
import likeRouter from "./modules/like/like.router"
import bookmarkRouter from "./modules/bookmark/bookmark.router"
import searchRouter from "./modules/search/search.router"
import userRouter from "./modules/user/user.router"

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)
const io = new Server(server)

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

app.use("/api/auth", authRouter)
app.use("/api/questions", questionRouter)
app.use("/api/tags", tagRouter)
app.use("/api/answers", answerRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/likes", likeRouter)
app.use("/api/bookmarks", bookmarkRouter)
app.use("/api/search", searchRouter)
app.use("/api/users", userRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  )
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status, message } = err
  res.status(status || 500).send({ success: 0, message: message })
})

io.on("connection", (socket) => {
  socket.emit("connected")

  socket.on("join-room", (userId) => {
    socket.join(userId)
    console.log(`Joined room ${userId}`)
  })

  socket.on("leave-room", (userId) => {
    socket.leave(userId)
    console.log(`Left room ${userId}`)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
