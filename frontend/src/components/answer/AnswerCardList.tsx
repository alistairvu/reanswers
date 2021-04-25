import axiosClient from "../../api"
import { useInfiniteQuery } from "react-query"
import { useParams } from "react-router-dom"

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

  const { data: answerData, isLoading } = useInfiniteQuery(
    ["answers", questionId],
    getAnswers,
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.nextCursor > lastPage.notificationCount) {
          return false
        }
        return lastPage.nextCursor
      },
    }
  )

  return <div></div>
}

export default AnswerCardList
