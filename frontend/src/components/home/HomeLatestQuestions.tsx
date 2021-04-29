import Spinner from "react-bootstrap/Spinner"
import { Fragment } from "react"
import { useInfiniteQuery } from "react-query"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import axiosClient from "../../api"
import AppQuestionCard from "../AppQuestionCard"

const HomeLatestQuestions: React.FC = () => {
  const getLatestQuestions = async ({ pageParam = 0 }) => {
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
  } = useInfiniteQuery("home_questions", getLatestQuestions, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage.nextCursor > lastPage.questionCount) {
        return false
      }
      return lastPage.nextCursor
    },
  })

  useInfiniteScroll(fetchNextPage, hasNextPage)

  return (
    <>
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
    </>
  )
}

export default HomeLatestQuestions
