import Card from "react-bootstrap/Card"

const AnswerCard: React.FC<AnswerInterface> = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Text>{props.content}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default AnswerCard
