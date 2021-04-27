import { InfiniteData } from "react-query"
import Spinner from "react-bootstrap/Spinner"
import { Fragment } from "react"
import AppQuestionCard from "./AppQuestionCard"

interface AppQuestionListProps {
  questionData: InfiniteData<any>
  hasNextPage: boolean
}

const AppQuestionList: React.FC<AppQuestionListProps> = ({
  questionData,
  hasNextPage,
}) => {
  return (
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
  )
}

export default AppQuestionList
