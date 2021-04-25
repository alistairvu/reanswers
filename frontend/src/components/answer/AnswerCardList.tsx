import Spinner from "react-bootstrap/Spinner"
import axiosClient from "../../api"
import { useInfiniteQuery } from "react-query"
import { Fragment } from "react"
import AnswerCard from "./AnswerCard"
import { useParams } from "react-router-dom"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

const AnswerCardList: React.FC = () => {
  const { id: questionId } = useParams<{ id: string }>()

  const getAnswers = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get(
      `/api/answers/question/${questionId}`,
      {
        params: {
          skip: pageParam,
        },
      }
    )
    console.log(data)
    if (data.success) {
      return data
    }
  }

  const {
    data: answerData,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(["answers", questionId], getAnswers, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage.nextCursor > lastPage.answerCount) {
        return false
      }
      return lastPage.nextCursor
    },
  })

  useInfiniteScroll(fetchNextPage, hasNextPage)

  if (isLoading) {
    return (
      <div className="mt-2 text-center">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="mt-2">
      {answerData.pages.map((page, index) => (
        <Fragment key={index}>
          {page.data.map((answer: AnswerInterface) => (
            <AnswerCard key={answer._id} {...answer} />
          ))}
        </Fragment>
      ))}

      {hasNextPage ? (
        <div className="my-2 text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="my-2 text-center">
          <p>No more answers.</p>
        </div>
      )}
    </div>
  )
}

export default AnswerCardList
