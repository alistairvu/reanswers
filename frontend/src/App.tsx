import AppLayout from "./components/AppLayout"
import { Switch, Route } from "react-router-dom"
import { HomePage, LoginPage } from "./pages"
import { GuestRoute } from "./components/routes"
import { useContext } from "react"
import UserContext from "./context/userContext"

const App: React.FC = () => {
  const { isLoaded } = useContext(UserContext)

  if (!isLoaded) {
    return <AppLayout />
  }

  return (
    <AppLayout>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <GuestRoute path="/login">
          <LoginPage />
        </GuestRoute>
      </Switch>
    </AppLayout>
  )
}

export default App
