import Container from "react-bootstrap/Container"
import AppHelmet from "../components/AppHelmet"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import { BookmarkQuestionList } from "../components/bookmark"

const BookmarkPage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Bookmarks" />

      <Container className="py-3">
        <h1>Your Bookmarks</h1>

        <Tabs defaultActiveKey="questions" id="bookmark-tab" className="mb-2">
          <Tab eventKey="questions" title="Questions">
            <BookmarkQuestionList />
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

export default BookmarkPage
