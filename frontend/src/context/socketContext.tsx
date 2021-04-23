import { io } from "socket.io-client"
import { createContext } from "react"

export const socket = io()
const SocketContext = createContext(null)

export default SocketContext
