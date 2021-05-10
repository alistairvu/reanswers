import Container from "react-bootstrap/Container"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import AppHelmet from "../components/AppHelmet"
import { ProfileQuestionList } from "../components/profile"

const ProfilePage: React.FC = () => {
  return (
    <>
      <AppHelmet title={`Profile`} />
      <Container className="pt-2">
        <h1>Your Profile</h1>
        <Tabs defaultActiveKey="questions" id="profile-tab" className="mb-2">
          <Tab eventKey="questions" title="Questions">
            <ProfileQuestionList />
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

export default ProfilePage
