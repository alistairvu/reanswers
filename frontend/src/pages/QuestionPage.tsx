import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Spinner from "react-bootstrap/Spinner"
import axiosClient from "../api"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import QuestionCard from "../components/question/QuestionCard"
import AppHelmet from "../components/AppHelmet"
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
      return data.question
    }
  }

  const { data: questionData, isLoading, error: questionError } = useQuery(
    ["question", questionId],
    fetchQuestion
  )

  console.log({ questionData, isLoading, questionError })

  return (
    <>
      <AppHelmet title={isLoading ? "Question" : questionData.title} />

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
                <Tabs defaultActiveKey="top" id="home-tab" className="mb-2">
                  <Tab eventKey="top" title="Top">
                    <AnswerCardList slug="top"/>
                  </Tab>
                  <Tab eventKey="latest" title="Latest">
                    <AnswerCardList slug="latest"/>
                  </Tab>
                </Tabs>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default QuestionPage
