import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useForm } from "react-hook-form"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import { useContext, useState, useEffect } from "react"
import { useHistory, useLocation, Link } from "react-router-dom"
import useSocket from "../../hooks/useSocket"

interface SignUpInterface {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

const AuthSignUpForm: React.FC = () => {
  const [signUpError, setSignUpError] = useState<string>("")
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInterface>()
  const { setUser } = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  const socket = useSocket()
  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get("redirect")

  const handleSignUp = async (signUpData: SignUpInterface) => {
    setSignUpError("")
    if (signUpData.password !== signUpData.passwordConfirmation) {
      setSignUpError("Passwords do not match!")
      return
    }

    try {
      setIsSigningUp(true)
      const { data } = await axiosClient.post("/api/auth/signup", signUpData)
      if (data.success) {
        setIsSigningUp(false)
        console.log(data)
        window.localStorage.setItem("jwt", data.token)
        setUser(data.user)
        socket.emit("join-room", data.user._id)
        history.push(redirect ? redirect : "/")
      }
    } catch (err) {
      setIsSigningUp(false)
      console.log(err)
      setSignUpError(err.response.data.message)
    }
  }

  useEffect(() => {
    setSignUpError("")
  }, [])

  return (
    <Form onSubmit={handleSubmit(handleSignUp)}>
      <Form.Group controlId="username" className="my-2">
        <Form.Control
          type="text"
          placeholder="Enter your Username"
          {...register("username", { required: true })}
        />
      </Form.Group>

      <Form.Group controlId="email" className="my-2">
        <Form.Control
          type="text"
          placeholder="Enter your Email"
          {...register("email", { required: true })}
        />
      </Form.Group>

      <Form.Group controlId="password" className="my-2">
        <Form.Control
          type="password"
          placeholder="Enter your Password"
          {...register("password", { required: true })}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password-confirmation">
        <Form.Control
          type="password"
          placeholder="Confirm your password"
          {...register("passwordConfirmation", { required: true })}
        />
        {errors.passwordConfirmation && (
          <Form.Text className="text-danger">
            {errors.passwordConfirmation.message}
          </Form.Text>
        )}
      </Form.Group>

      {signUpError && (
        <Alert variant="danger" className="mb-3">
          {signUpError}
        </Alert>
      )}

      <Button type="submit" variant="primary" className="my-2">
        Sign Up
      </Button>

      <p>
        Already have an account?{" "}
        <Link to={redirect ? `login?redirect=${redirect}` : "login"}>
          Click here to log in.
        </Link>
      </p>
    </Form>
  )
}

export default AuthSignUpForm
