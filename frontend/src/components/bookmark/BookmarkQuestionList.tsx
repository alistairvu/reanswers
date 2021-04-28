import axiosClient from "../../api"
import Spinner from "react-bootstrap/Spinner"
import QuestionCard from "../AppQuestionCard"
import { Fragment } from "react"
import { useInfiniteQuery } from "react-query"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"

const BookmarkQuestionList: React.FC = () => {
  const fetchBookmarks = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get("/api/bookmarks/questions", {
      params: {
        skip: pageParam,
      },
    })
    if (data.success) {
      return data
    }
  }

  const {
    data: bookmarkData,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery("bookmarked_questions", fetchBookmarks)

  useInfiniteScroll(fetchNextPage, hasNextPage)

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <>
      {bookmarkData.pages.map((page, index) => (
        <Fragment key={index}>
          {page.bookmarks.map((bookmark: BookmarkInterface) => (
            <QuestionCard key={bookmark._id} {...bookmark.question} />
          ))}
        </Fragment>
      ))}

      {hasNextPage ? (
        <div className="text-center my-2">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="text-center my-2">No more bookmarks.</div>
      )}
    </>
  )
}

export default BookmarkQuestionList
