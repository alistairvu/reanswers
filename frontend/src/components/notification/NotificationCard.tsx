import Card from "react-bootstrap/Card"
import { LinkContainer } from "react-router-bootstrap"

const NotificationCard: React.FC<NotificationInterface> = (props) => {
  return (
    <Card>
      <Card.Body>
        <LinkContainer to={props.link}>
          <Card.Title>{props.title}</Card.Title>
        </LinkContainer>
        <Card.Text>{props.body}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default NotificationCard
