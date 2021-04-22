import { Route, Redirect } from "react-router-dom"
import { useContext } from "react"
import UserContext from "../../context/userContext"

interface ProtectedRouteProps {
  exact?: boolean
  path: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  exact,
  path,
}) => {
  const { user } = useContext(UserContext)

  if (!user._id) {
    return <Redirect to="/login" />
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  )
}

export default ProtectedRoute
