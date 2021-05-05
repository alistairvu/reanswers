import AppHeader from "./AppHeader"

const AppLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header className="sticky-top">
        <AppHeader />
      </header>

      <main className="bg-light min-vh-100">{children}</main>
    </div>
  )
}

export default AppLayout
