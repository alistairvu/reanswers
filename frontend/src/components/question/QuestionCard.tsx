import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <ReactMarkdown>{props.body}</ReactMarkdown>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
