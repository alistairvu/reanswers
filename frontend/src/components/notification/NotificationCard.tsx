import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"

const NotificationCard: React.FC<NotificationInterface> = (props) => {
  return (
    <Card className="mb-1">
      <Card.Body>
        <Link to={props.link} className="text-decoration-none">
          <Card.Title>{props.title}</Card.Title>
        </Link>
        <Card.Text>{props.body}</Card.Text>
        <Card.Text className="text-muted">
          <em>
            {formatDistance(new Date(props.createdAt), new Date(), {
              addSuffix: true,
            })}
          </em>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default NotificationCard
