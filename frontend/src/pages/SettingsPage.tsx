import Container from "react-bootstrap/Container"
import AppHelmet from "../components/AppHelmet"
import TabContainer from "react-bootstrap/TabContainer"
import TabContent from "react-bootstrap/TabContent"
import TabPane from "react-bootstrap/TabPane"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"
import { SettingsProfile } from "../components/settings"

const SettingsPage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Settings" />

      <Container className="py-2">
        <h1>Settings</h1>

        <TabContainer id="settings-tabs" defaultActiveKey="profile">
          <Row>
            <Col md={3}>
              <Nav variant="pills" className="flex-column mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col md={9}>
              <TabContent>
                <TabPane eventKey="profile">
                  <SettingsProfile />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabContainer>
      </Container>
    </>
  )
}

export default SettingsPage
