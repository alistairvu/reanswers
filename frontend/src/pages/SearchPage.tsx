import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import AppQuestionCard from "../components/AppQuestionCard"
import AppHelmet from "../components/AppHelmet"
import { useLocation } from "react-router-dom"
import { useInfiniteQuery } from "react-query"
import axiosClient from "../api"

const SearchPage: React.FC = () => {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const keyword = urlParams.get("keyword")

  const getMatchingQuestions = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get("/api/search", {
      params: {
        keyword: keyword,
        skip: pageParam,
      },
    })
    if (data.success) {
      return data
    }
  }

  const {
    data: questionData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(["search", keyword], getMatchingQuestions, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage.nextCursor > lastPage.questionCount) {
        return false
      }
      return lastPage.nextCursor
    },
  })

  console.log({ questionData })

  return (
    <>
      <AppHelmet title={`Results for ${keyword}`} />
      <Container className="mt-2">
        <h1>
          Search results for <em>{keyword}</em>
          {isLoading ? (
            <div className="mt-2 text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <h2>Placeholder</h2>
          )}
        </h1>
      </Container>
    </>
  )
}

export default SearchPage
