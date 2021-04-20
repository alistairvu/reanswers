import Container from "react-bootstrap/Container"
import AppHelmet from "../components/AppHelmet"

const HomePage: React.FC = () => {
  return (
    <>
      <AppHelmet title="Home" />

      <Container className="text-center py-5">
        <h1>Welcome to React!</h1>
        <h3 style={{ fontSize: 30 }}>
          Get started by editing{" "}
          <code style={{ color: "red" }}>src/App.tsx</code>
        </h3>
      </Container>
    </>
  )
}

export default HomePage
