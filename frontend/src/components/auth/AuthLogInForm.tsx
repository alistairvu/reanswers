import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useForm } from "react-hook-form"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import { useContext } from "react"
import { useHistory } from "react-router-dom"

interface LogInInterface {
  login: string
  password: string
}

const AuthLogInForm: React.FC = () => {
  const { register, handleSubmit } = useForm<LogInInterface>()
  const { setUser } = useContext(UserContext)
  const history = useHistory()

  const handleLogIn = async (loginData: LogInInterface) => {
    try {
      console.log(loginData)
      const { data } = await axiosClient.post("/api/auth/login", loginData)
      if (data.success) {
        console.log(data)
        window.localStorage.setItem("jwt", data.token)
        setUser(data.user)
        history.push("/")
      }
    } catch (err) {
      console.log(err)
    }
  }

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

      <Button type="submit" variant="primary">
        Log In
      </Button>
    </Form>
  )
}

export default AuthLogInForm