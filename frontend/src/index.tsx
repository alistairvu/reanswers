import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import App from "./App"
import "./styles/index.scss"

const rootElement = document.getElementById("root")
render(
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>,
  rootElement
)
