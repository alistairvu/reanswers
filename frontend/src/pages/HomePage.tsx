import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import AppHelmet from "../components/AppHelmet"
import { useInfiniteQuery } from "react-query"
import { HomeQuestionCard } from "../components/home"
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

  useInfiniteScroll(fetchNextPage, hasNextPage)

  console.log({ questionData, isLoading })

  return (
    <>
      <AppHelmet title="Home" />

      <Container className="py-3">
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {questionData.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((question: QuestionInterface) => (
                  <HomeQuestionCard {...question} key={question._id} />
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
      </Container>
    </>
  )
}

export default HomePage
