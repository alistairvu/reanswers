import { useInfiniteQuery } from "react-query"
import axiosClient from "../../api"
import Spinner from "react-bootstrap/Spinner"
import AnswerCard from "../AppAnswerCard"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import { Fragment } from "react"

const BookmarkAnswerList: React.FC = () => {
  const fetchBookmarks = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get("/api/bookmarks/answers", {
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
  } = useInfiniteQuery("bookmarked_answers", fetchBookmarks)

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
            <AnswerCard key={bookmark._id} {...bookmark.answer} />
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

export default BookmarkAnswerList
