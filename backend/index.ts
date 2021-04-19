import express, { Request, Response, NextFunction } from "express"
import http from "http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status, message } = err
  res.status(status || 500).send({ success: 0, message: message })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
