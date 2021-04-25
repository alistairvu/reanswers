import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useForm } from "react-hook-form"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import { useContext, useState, useEffect } from "react"
import { useHistory, useLocation, Link } from "react-router-dom"
import useSocket from "../../hooks/useSocket"

interface LogInInterface {
  login: string
  password: string
}

const AuthLogInForm: React.FC = () => {
  const { register, handleSubmit } = useForm<LogInInterface>()
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { setUser } = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  const socket = useSocket()
  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get("redirect")

  const handleLogIn = async (loginData: LogInInterface) => {
    try {
      setLoginError("")
      setIsLoggingIn(true)
      console.log(loginData)
      const { data } = await axiosClient.post("/api/auth/login", loginData)
      if (data.success) {
        console.log(data)
        setIsLoggingIn(false)
        window.localStorage.setItem("jwt", data.token)
        setUser(data.user)
        socket.emit("join-room", data.user._id)
        history.push(redirect ? redirect : "/")
      }
    } catch (err) {
      setIsLoggingIn(false)
      setLoginError(err.response.data.message || err.message)
      console.log(err)
    }
  }

  useEffect(() => {
    setLoginError("")
  }, [])

  return (
    <Form onSubmit={handleSubmit(handleLogIn)}>
      <Form.Group controlId="login" className="my-2">
        <Form.Control
          type="text"
          placeholder="Username or email"
          {...register("login")}
        />
      </Form.Group>

      <Form.Group controlId="password" className="my-2">
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password")}
        />
      </Form.Group>

      {loginError && <Alert variant="danger">{loginError}</Alert>}

      <Button
        type="submit"
        variant="primary"
        className="my-2"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Logging In..." : "Log In"}
      </Button>

      <p>
        New to reanswers?{" "}
        <Link to={redirect ? `signup?redirect=${redirect}` : "signup"}>
          Click here to sign up.
        </Link>
      </p>
    </Form>
  )
}

export default AuthLogInForm
