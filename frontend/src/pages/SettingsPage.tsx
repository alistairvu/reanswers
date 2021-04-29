import Container from "react-bootstrap/Container"
import AppHelmet from "../components/AppHelmet"

const SettingsPage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Settings" />

      <Container className="py-2">
        <h1>Settings</h1>
      </Container>
    </>
  )
}

export default SettingsPage
