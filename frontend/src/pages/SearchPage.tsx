import Container from "react-bootstrap/Container"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import AppHelmet from "../components/AppHelmet"
import { SearchQuestionList } from "../components/search"
import { useLocation } from "react-router-dom"

const SearchPage: React.FC = () => {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const keyword = urlParams.get("keyword")

  return (
    <>
      <AppHelmet title={`Results for ${keyword}`} />
      <Container className="pt-2">
        <h1>
          Search results for <em>{keyword}</em>
        </h1>
        <Tabs defaultActiveKey="top" id="search-tab" className="mb-2">
          <Tab eventKey="top" title="Top">
            <SearchQuestionList keyword={keyword} slug="questions" />
          </Tab>
          <Tab eventKey="latest" title="Latest">
            <SearchQuestionList keyword={keyword} slug="questions" latest />
          </Tab>
          <Tab eventKey="tagged" title="Tagged">
            <SearchQuestionList keyword={keyword} slug="tags" />
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

export default SearchPage
