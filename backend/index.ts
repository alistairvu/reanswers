import express from "express"
import http from "http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())

server.listen(port, () => console.log(`Listening on port ${port}`))
