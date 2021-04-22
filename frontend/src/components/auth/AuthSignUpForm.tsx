import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert'
import { useForm } from "react-hook-form";
import axiosClient from "../../api";
import UserContext from "../../context/userContext";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

interface SignUpInterface {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const AuthSignUpForm: React.FC = () => {
  const [signUpError, setSignUpError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInterface>()
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  const handleSignUp = async (signUpData: SignUpInterface) => {
    setSignUpError("");
    if (signUpData.password !== signUpData.passwordConfirmation) {
      setSignUpError("Passwords do not match!");
      return;
    }

    try {
      const body = {
        user: {
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
        },
      };
      console.log(signUpData);
      const { data } = await axiosClient.post("/api/auth/signup", signUpData);
      if (data.success) {
        console.log(data);
        window.localStorage.setItem("jwt", data.token);
        setUser(data.user);
        history.push("/");
      }
    } catch (err) {
      console.log(err);
      setSignUpError(err.response.data.message);
    }
  };

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
          {...register("password")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password-confirmation">
        <Form.Control
          type="password"
          placeholder="Enter your password"
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

      <Button type="submit" variant="primary">
        Sign Up
      </Button>
    </Form>
  );
};

export default AuthSignUpForm;
