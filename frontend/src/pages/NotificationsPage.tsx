import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import AppHelmet from "../components/AppHelmet"
import axiosClient from "../api"
import { useInfiniteQuery } from "react-query"
import { Fragment } from "react"
import NotificationCard from "../components/notification/NotificationCard"

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
            {isLoading ? (
              <div className="mt-2 text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="mt-2">
                {notificationData.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.map((notification: NotificationInterface) => (
                      <NotificationCard
                        key={notification._id}
                        {...notification}
                      />
                    ))}
                  </Fragment>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default NotificationsPage
