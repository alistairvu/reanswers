import AppHeader from "./AppHeader"
import Helmet from "react-helmet"

interface AppLayoutProps {
  title: string
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Helmet>
        <title>{title} | reanswer</title>
      </Helmet>

      <header>
        <AppHeader />
      </header>

      <main>{children}</main>
    </>
  )
}

export default AppLayout
