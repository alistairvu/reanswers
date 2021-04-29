import Spinner from "react-bootstrap/Spinner"
import { Fragment } from "react"
import { useInfiniteQuery } from "react-query"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import axiosClient from "../../api"
import AppQuestionCard from "../AppQuestionCard"
import AppHelmet from "../AppHelmet"

interface TagQuestionListProps {
  tagId: string
}

const TagQuestionList: React.FC<TagQuestionListProps> = ({ tagId }) => {
  const getQuestionsByTag = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get(`/api/tags/${tagId}`, {
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
  } = useInfiniteQuery(["tagged_question", tagId], getQuestionsByTag, {
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
          <AppHelmet title={questionData.pages[0].tagInfo?.title || "Tagged"} />

          <h1>
            Questions tagged with{" "}
            <em>{questionData.pages[0].tagInfo?.title || "Tagged"}</em>
          </h1>

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

export default TagQuestionList
