import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { LinkContainer } from "react-router-bootstrap"
import { useContext } from "react"
import UserContext from "../context/userContext"
import { useHistory } from "react-router-dom"
import axiosClient from "../api"

const AppHeader: React.FC = () => {
  const { user, clearUser, isLoaded } = useContext(UserContext)
  const history = useHistory()

  const handleLogOut = async () => {
    try {
      const { data } = await axiosClient.delete("/api/auth/logout")
      if (data.success) {
        clearUser()
        history.push("/login")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const renderNav = () => {
    if (!isLoaded) return null

    if (!user._id) {
      return (
        <Nav className="ms-auto">
          <LinkContainer to="/signup">
            <Nav.Link>Sign Up</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/login">
            <Nav.Link>Log In</Nav.Link>
          </LinkContainer>
        </Nav>
      )
    }

    return (
      <Nav className="ms-auto">
        <LinkContainer to="/ask">
          <Nav.Link className="me-2">
            <i className="fas fa-plus" /> Ask
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/notifications">
          <Nav.Link className="me-2">
            <i className="fas fa-bell" /> Notifications
          </Nav.Link>
        </LinkContainer>
        <NavDropdown
          title={
            <>
              <i className="fas fa-user" /> {user.username}
            </>
          }
          id="user-nav-dropdown"
        >
          <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  }

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">reanswer</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">{renderNav()}</Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppHeader
