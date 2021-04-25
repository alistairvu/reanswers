import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"

const HomeQuestionCard: React.FC<QuestionInterface> = (props) => {
  return (
    <Card className="mb-1">
      <Card.Body>
        <Card.Title>
          <Link to={`/questions/${props._id}`}>{props.title}</Link>
        </Card.Title>
        <Card.Text>{props.body}</Card.Text>
        <Card.Text className="text-muted">
          {formatDistance(new Date(props.createdAt), new Date(), {
            addSuffix: true,
          })}{" "}
          • Asked by {props.author.username}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default HomeQuestionCard
