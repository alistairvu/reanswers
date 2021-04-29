import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import AppHelmet from "../components/AppHelmet"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import { useQuery } from "react-query"
import axiosClient from "../api"
import { HomeLatestQuestions } from "../components/home"

const HomePage: React.FC = () => {
  const getTopTags = async () => {
    const { data } = await axiosClient.get("/api/tags/top")
    if (data.success) {
      return data.tags
    }
  }

  const { data: tagData, isLoading: isTagLoading } = useQuery(
    "home_tags",
    getTopTags
  )

  return (
    <>
      <AppHelmet title="Home" />

      <Container className="py-3">
        <Row>
          <Col className="d-none d-lg-block" lg={2}>
            <h5>Hot Tags</h5>
            <ol>
              {isTagLoading ? (
                <div className="my-2 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                tagData.map((tag: TagInterface) => (
                  <li key={tag._id}>{tag.title}</li>
                ))
              )}
            </ol>
          </Col>
          <Col xs={12} lg={8}>
            <Tabs defaultActiveKey="latest" id="home-tab" className="mb-2">
              <Tab eventKey="latest" title="Latest">
                <HomeLatestQuestions />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomePage
