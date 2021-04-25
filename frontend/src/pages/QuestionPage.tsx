import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Spinner from "react-bootstrap/Spinner"
import axiosClient from "../api"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import QuestionCard from "../components/question/QuestionCard"
import { useContext } from "react"
import UserContext from "../context/userContext"
import {
  AnswerForm,
  AnswerLoginCard,
  AnswerCardList,
} from "../components/answer"

const QuestionPage: React.FC = () => {
  const { id: questionId } = useParams<{ id: string }>()
  const { user } = useContext(UserContext)

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
          <Col xs={12} lg={8}>
            {isLoading ? (
              <div className="mt-4 text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <QuestionCard {...questionData} />
                </div>
                <div className="my-4">
                  {user._id ? <AnswerForm /> : <AnswerLoginCard />}
                </div>
                <AnswerCardList />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default QuestionPage
