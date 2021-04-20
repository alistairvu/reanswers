import Helmet from "react-helmet"

interface AppHelmetProps {
  title: string
}

const AppHelmet: React.FC<AppHelmetProps> = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | reanswers</title>
    </Helmet>
  )
}

export default AppHelmet
