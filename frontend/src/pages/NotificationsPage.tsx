import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import AppHelmet from "../components/AppHelmet"

const NotificationsPage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Notifications" />

      <Container className="mt-3">
        <Row>
          <Col xs={12} md={8}>
            <h1 className="fw-bold">Notifications</h1>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default NotificationsPage
