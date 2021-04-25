import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useLocation, useHistory } from "react-router-dom"

const AnswerLoginCard: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  return (
    <Card>
      <Card.Body>
        <Card.Title>You are not logged in yet!</Card.Title>
        <Card.Text>Log in to answer this question.</Card.Text>
        <Button
          onClick={() => {
            history.push(`/login?redirect=${location.pathname}`)
          }}
        >
          Log In
        </Button>
      </Card.Body>
    </Card>
  )
}

export default AnswerLoginCard
