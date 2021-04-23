import AppLayout from "./components/AppLayout"
import { Switch, Route } from "react-router-dom"
import {
  HomePage,
  LoginPage,
  SignupPage,
  NotificationsPage,
  AskPage,
  QuestionPage,
} from "./pages"
import { GuestRoute, ProtectedRoute } from "./components/routes"
import { useContext, useEffect } from "react"
import UserContext from "./context/userContext"
import useSocket from "./hooks/useSocket"

const App: React.FC = () => {
  const { isLoaded } = useContext(UserContext)
  const socket = useSocket()

  useEffect(() => {
    socket.on("connected", () => {
      console.log("Connected!")
    })
  }, [socket])

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
        <GuestRoute path="/signup">
          <SignupPage />
        </GuestRoute>
        <ProtectedRoute path="/notifications">
          <NotificationsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/ask">
          <AskPage />
        </ProtectedRoute>
      </Switch>
    </AppLayout>
  )
}

export default App
