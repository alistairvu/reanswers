import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import AppHelmet from "../components/AppHelmet"
import AuthLogInForm from "../components/auth/AuthLogInForm"

const LoginPage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Home" />

      <Container className="mt-3">
        <Row>
          <Col className="d-none d-md-block mt-md-5" md={8}>
            <h1 className="fw-bold">Welcome back to the land of curiosity.</h1>
            <h2>
              Ask the community. Answer with your knowledge. Connect with other
              curious minds.
            </h2>
          </Col>
          <Col xs={12} md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title className="fs-2 fw-bold text-center mb-3">
                  Log In
                </Card.Title>
                <AuthLogInForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default LoginPage
