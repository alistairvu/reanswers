import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import AppHelmet from "../components/AppHelmet"
import axiosClient from "../api"
import { useInfiniteQuery, useQueryClient } from "react-query"
import { Fragment, useEffect } from "react"
import useSocket from "../hooks/useSocket"
import NotificationCard from "../components/notification/NotificationCard"
import useInfiniteScroll from "../hooks/useInfiniteScroll"

const NotificationsPage: React.FC = () => {
  const getNotifications = async ({ pageParam = 0 }) => {
    const { data } = await axiosClient.get("/api/notifications", {
      params: {
        skip: pageParam,
      },
    })
    console.log(data)
    if (data.success) {
      return data
    }
  }

  const socket = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    socket.on("notification", (notification: NotificationInterface) => {
      console.log("New notification!")
      const newNotificationPage = [notification]
      queryClient.setQueryData("notifications", (data: any) => {
        return {
          pages: [newNotificationPage, ...data.pages],
          pageParams: data.pageParams,
        }
      })
    })
  }, [socket, queryClient])

  const {
    data: notificationData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("notifications", getNotifications, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage.nextCursor > lastPage.notificationCount) {
        return false
      }
      return lastPage.nextCursor
    },
  })

  useInfiniteScroll(fetchNextPage, hasNextPage)

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
                    {page.notifications.map(
                      (notification: NotificationInterface) => (
                        <NotificationCard
                          key={notification._id}
                          {...notification}
                        />
                      )
                    )}
                  </Fragment>
                ))}

                {hasNextPage ? (
                  <div className="my-2 text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <div className="my-2 text-center">
                    <p>No more notifications.</p>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default NotificationsPage
