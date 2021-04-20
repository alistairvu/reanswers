import AppHeader from "./AppHeader"

const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <header>
        <AppHeader />
      </header>

      <main>{children}</main>
    </>
  )
}

export default AppLayout
