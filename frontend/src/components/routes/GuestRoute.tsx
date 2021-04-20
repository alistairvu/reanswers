import { Route, Redirect } from "react-router-dom"
import { useContext } from "react"
import UserContext from "../../context/userContext"

interface GuestRouteProps {
  exact?: boolean
  path: string
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children, exact, path }) => {
  const { user } = useContext(UserContext)

  if (user._id) {
    return <Redirect to="/" />
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  )
}

export default GuestRoute
