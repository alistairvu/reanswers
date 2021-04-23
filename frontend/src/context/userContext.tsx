import { createContext, useState, useEffect } from "react"
import axiosClient from "../api"
import useSocket from "../hooks/useSocket"

const UserContext = createContext(null)

export const UserProvider: React.FC = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState({
    _id: "",
    username: "",
    email: "",
  })
  const socket = useSocket()

  const clearUser = () => {
    window.localStorage.removeItem("jwt")
    setUser({
      _id: "",
      username: "",
      email: "",
    })
  }

  useEffect(() => {
    const getStatus = async () => {
      try {
        const { data } = await axiosClient.get("/api/auth/status")
        if (data.success) {
          if (data.loggedIn) {
            console.log(data.user)
            setUser(data.user)
            window.localStorage.setItem("jwt", data.token)
            socket.emit("join-room", data.user._id)
          }
          setIsLoaded(true)
        }
      } catch (err) {
        setIsLoaded(true)
        console.log(err)
      }
    }

    getStatus()
  }, [])

  return (
    <UserContext.Provider value={{ isLoaded, user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
