import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import axiosClient from "../api"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import QuestionCard from "../components/question/QuestionCard"

const QuestionPage: React.FC = () => {
  const { id: questionId } = useParams<{ id: string }>()

  const fetchQuestion = async () => {
    const { data } = await axiosClient.get(`/api/questions/${questionId}`)
    console.log(data)
    if (data.success) {
      return data.data
    }
  }

  const { data: questionData, isLoading, error: questionError } = useQuery(
    ["question", questionId],
    fetchQuestion
  )

  console.log({ questionData, isLoading, questionError })

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col xs={12} md={8}>
            <QuestionCard {...questionData} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default QuestionPage
