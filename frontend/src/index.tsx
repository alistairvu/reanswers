import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "./context/userContext"
import App from "./App"
import "./styles/index.scss"

const rootElement = document.getElementById("root")
render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>,
  rootElement
)
