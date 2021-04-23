import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import AppHelmet from "../components/AppHelmet"
import axiosClient from "../api"
import { useInfiniteQuery } from "react-query"

const NotificationsPage: React.FC = () => {
  const getNotifications = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get("/api/notifications", {
      params: {
        skip: pageParam,
      },
    })
    console.log(data)
    if (data.success) {
      return data.notifications
    }
  }

  const { data: notificationData, isLoading } = useInfiniteQuery(
    "notifications",
    getNotifications,
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.nextCursor > lastPage.notificationCount) {
          return false
        }
        return lastPage.nextCursor
      },
    }
  )

  console.log({ isLoading, notificationData })

  return (
    <>
      <AppHelmet title="Notifications" />

      <Container className="mt-3">
        <Row>
          <Col xs={12} md={8}>
            <h1 className="fw-bold">Notifications</h1>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default NotificationsPage
