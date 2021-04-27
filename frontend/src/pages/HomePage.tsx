import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import AppHelmet from "../components/AppHelmet"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useInfiniteQuery, useQuery } from "react-query"
import AppQuestionCard from "../components/AppQuestionCard"
import { Fragment } from "react"
import axiosClient from "../api"
import useInfiniteScroll from "../hooks/useInfiniteScroll"

const HomePage: React.FC = () => {
  const getQuestions = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get(`/api/questions`, {
      params: {
        skip: pageParam,
      },
    })
    console.log(data)
    if (data.success) {
      return data
    }
  }

  const getTopTags = async () => {
    const { data } = await axiosClient.get("/api/tags/top")
    if (data.success) {
      return data.tags
    }
  }

  const {
    data: questionData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("home_questions", getQuestions, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage.nextCursor > lastPage.questionCount) {
        return false
      }
      return lastPage.nextCursor
    },
  })

  const { data: tagData, isLoading: isTagLoading } = useQuery(
    "home_tags",
    getTopTags
  )

  useInfiniteScroll(fetchNextPage, hasNextPage)

  return (
    <>
      <AppHelmet title="Home" />

      <Container className="py-3">
        <Row>
          <Col className="d-none d-lg-block" lg={2}>
            <h5>Hot Tags</h5>
            <ol>
              {isTagLoading ? (
                <div className="my-2 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                tagData.map((tag: TagInterface) => (
                  <li key={tag._id}>{tag.title}</li>
                ))
              )}
            </ol>
          </Col>
          <Col xs={12} lg={8}>
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                {questionData.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.questions.map((question: QuestionInterface) => (
                      <AppQuestionCard {...question} key={question._id} />
                    ))}
                  </Fragment>
                ))}

                {hasNextPage ? (
                  <div className="my-2 text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="my-2 text-center">
                    <p>No more questions.</p>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomePage
