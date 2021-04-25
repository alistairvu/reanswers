import { formatDistance } from "date-fns"
import Card from "react-bootstrap/Card"

const AnswerCard: React.FC<AnswerInterface> = (props) => {
  return (
    <Card className="mb-1">
      <Card.Body>
        <Card.Text className="fw-bolder">{props.author.username}</Card.Text>
        <Card.Text>{props.content}</Card.Text>
        <Card.Text className="text-muted fw-bolder">
          {formatDistance(new Date(props.createdAt), new Date(), {
            addSuffix: true,
          })}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default AnswerCard
