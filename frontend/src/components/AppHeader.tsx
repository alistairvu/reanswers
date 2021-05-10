import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { LinkContainer } from "react-router-bootstrap"
import { useContext } from "react"
import UserContext from "../context/userContext"
import { useHistory, useLocation } from "react-router-dom"
import axiosClient from "../api"
import useSocket from "../hooks/useSocket"
import { useState, useEffect } from "react"
import AppSearchBar from "./AppSearchBar"

const AppHeader: React.FC = () => {
  const { user, clearUser, isLoaded } = useContext(UserContext)
  const history = useHistory()
  const socket = useSocket()
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const location = useLocation()

  useEffect(() => {
    socket.on("notification", () => {
      if (location.pathname !== "/notifications") {
        setHasNewNotification(true)
      }
    })
  }, [socket, location.pathname])

  useEffect(() => {
    if (location.pathname === "/notifications") {
      setHasNewNotification(false)
    }
  }, [location.pathname])

  const handleLogOut = async () => {
    try {
      const { data } = await axiosClient.delete("/api/auth/logout")
      if (data.success) {
        socket.emit("leave-room", user._id)
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
          <AppSearchBar />
          <LinkContainer to={`/signup?redirect=${location.pathname}`}>
            <Nav.Link>Sign Up</Nav.Link>
          </LinkContainer>
          <LinkContainer to={`/login?redirect=${location.pathname}`}>
            <Nav.Link>Log In</Nav.Link>
          </LinkContainer>
        </Nav>
      )
    }

    return (
      <Nav className="ms-auto">
        <AppSearchBar />
        <LinkContainer to="/ask">
          <Nav.Link className="me-2">
            <i className="fas fa-plus" /> Ask
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/notifications">
          <Nav.Link className="me-2">
            <i className="fas fa-bell" /> Notifications{" "}
            {hasNewNotification && (
              <span style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
                •
              </span>
            )}
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
          <LinkContainer to="/profile">
            <NavDropdown.Item>Profile</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/bookmarks">
            <NavDropdown.Item>Bookmarks</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/settings">
            <NavDropdown.Item>Settings</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold brand-name fs-4">
            reanswers
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">{renderNav()}</Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppHeader
