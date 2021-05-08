import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import axiosClient from "../../api"
import { useContext, useState } from "react"
import UserContext from "../../context/userContext"
import { useForm } from "react-hook-form"

interface ProfileUpdateInterface {
  email: string
  username: string
  password: string
  passwordConfirmation: string
}

const SettingsProfile: React.FC = () => {
  const { user, setUser } = useContext(UserContext)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInterface>({
    defaultValues: {
      email: user.email,
      username: user.username,
    },
  })

  const handleUpdate = async (updatedInfo: ProfileUpdateInterface) => {
    if (updatedInfo.password !== updatedInfo.passwordConfirmation) {
      return setUpdateError("Passwords must match")
    }

    try {
      setIsUpdating(true)
      setUpdateError("")
      setIsUpdateSuccess(false)
      const { data } = await axiosClient.put(
        `/api/users/${user._id}`,
        updatedInfo
      )
      if (data.success) {
        setIsUpdateSuccess(true)
        setUser((prev: any) => ({
          ...prev,
          username: data.user.username,
          email: data.user.email,
        }))
      }
    } catch (err) {
      setUpdateError(err.response.data.message || err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const renderAlert = () => {
    if (errors.username) {
      return <Alert variant="danger">{errors.username.message}</Alert>
    }

    if (errors.email) {
      return <Alert variant="danger">{errors.email.message}</Alert>
    }

    if (updateError) {
      return <Alert variant="danger">{updateError}</Alert>
    }

    if (isUpdateSuccess) {
      return <Alert variant="success">Update successful!</Alert>
    }
  }

  return (
    <>
      <h3>Profile</h3>
      {renderAlert()}
      <Form onSubmit={handleSubmit(handleUpdate)}>
        <Row>
          <Col md={{ span: 6 }}>
            <Form.Group controlId="profileUsername" className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "You cannot leave a blank username",
                })}
              />
            </Form.Group>
          </Col>

          <Col md={{ span: 6 }}>
            <Form.Group controlId="profileEmail" className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "You cannot leave a blank email",
                })}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 6 }}>
            <Form.Group controlId="profileUsername" className="mb-2">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </Form.Group>
          </Col>

          <Col md={{ span: 6 }}>
            <Form.Group controlId="profileEmail" className="mb-2">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                {...register("passwordConfirmation")}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={isUpdating}>
          Update
        </Button>
      </Form>
    </>
  )
}

export default SettingsProfile
