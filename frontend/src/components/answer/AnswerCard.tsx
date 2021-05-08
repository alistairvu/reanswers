import { formatDistance } from "date-fns"
import Card from "react-bootstrap/Card"
import { useState, useContext } from "react"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

const AnswerCard: React.FC<AnswerInterface> = (props) => {
  const [isLiked, setIsLiked] = useState(props.likes.length > 0)
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarks.length > 0)
  const [likeCount, setLikeCount] = useState(props.likeCount)
  const { user } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { id: questionId } = useParams<{ id: string }>()

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      const { data } = await axiosClient.post("/api/likes", {
        answerId: props._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setIsLiked((prev) => !prev)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      console.log(err)
    }
  }

  const handleBookmark = async () => {
    try {
      setIsBookmarked((prev) => !prev)
      const { data } = await axiosClient.post("/api/bookmarks", {
        answerId: props._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setIsBookmarked((prev) => !prev)
      console.log(err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Do you really want to delete this answer?")) {
      try {
        const { data } = await axiosClient.delete(`/api/answers/${props._id}`)
        if (data.success) {
          queryClient.invalidateQueries(["answers", questionId, "top"])
          queryClient.invalidateQueries(["answers", questionId, "latest"])
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Card className="mb-1">
      <Card.Body>
        <Card.Text className="fw-bolder">
          {props.author.username}{" "}
          <span className="text-muted">
            •{" "}
            {formatDistance(new Date(props.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </Card.Text>
        <Card.Text>{props.content}</Card.Text>
        <div className="d-flex justify-content-between">
          <div className="text-muted">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </div>
          <div>
            {user._id.toString() === props.author._id.toString() && (
              <i
                className="far fa-trash-alt me-3"
                style={{
                  fontSize: "25px",
                  color: "#adb5bd",
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              />
            )}
            {user._id && (
              <>
                <i
                  className={`${isBookmarked ? "fas" : "far"} fa-bookmark me-3`}
                  style={{
                    fontSize: "25px",
                    color: "#adb5bd",
                    cursor: "pointer",
                  }}
                  onClick={handleBookmark}
                />
                <i
                  className={`${isLiked ? "fas" : "far"} fa-heart`}
                  style={{
                    cursor: "pointer",
                    fontSize: "25px",
                    color: isLiked ? "#d9534f" : "#adb5bd",
                  }}
                  onClick={handleLike}
                />
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default AnswerCard
