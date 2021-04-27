import Spinner from "react-bootstrap/Spinner"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { useInfiniteQuery } from "react-query"
import axiosClient from "../../api"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import AppQuestionList from "../AppQuestionList"

const SearchQuestionList: React.FC<{
  keyword: string
  latest?: boolean
  slug: string
}> = ({ keyword, latest, slug }) => {
  const getMatchingQuestions = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get(`/api/search/${slug}`, {
      params: {
        keyword: keyword,
        skip: pageParam,
        sort: latest ? "latest" : "",
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
  } = useInfiniteQuery(
    ["search", keyword, latest ? "latest" : "top", slug],
    getMatchingQuestions,
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.nextCursor > lastPage.questionCount) {
          return false
        }
        return lastPage.nextCursor
      },
    }
  )

  useInfiniteScroll(fetchNextPage, hasNextPage)

  if (isLoading) {
    return (
      <div className="mt-2 text-center">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <Row>
      <Col xs={12} md={{ span: 8, offset: 2 }}>
        <AppQuestionList
          questionData={questionData}
          hasNextPage={hasNextPage}
        />
      </Col>
    </Row>
  )
}

export default SearchQuestionList
