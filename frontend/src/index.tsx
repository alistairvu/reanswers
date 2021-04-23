import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "./context/userContext"
import App from "./App"
import "./styles/index.scss"
import SocketContext, { socket } from "./context/socketContext"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()
const rootElement = document.getElementById("root")
render(
  <SocketContext.Provider value={socket}>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </SocketContext.Provider>,
  rootElement
)
