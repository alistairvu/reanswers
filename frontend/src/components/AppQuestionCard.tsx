import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import { Link, useHistory } from "react-router-dom"
import { formatDistance } from "date-fns"
import axiosClient from "../api"
import { useContext, useState } from "react"
import UserContext from "../context/userContext"
import ReactMarkdown from "react-markdown"

const AppQuestionCard: React.FC<QuestionInterface> = (props) => {
  const user = useContext(UserContext)
  const [isLiked, setIsLiked] = useState(props.likes.length > 0)
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarks.length > 0)
  const [likeCount, setLikeCount] = useState(props.likeCount)
  const history = useHistory()

  const renderTagBadges = () => {
    return props.tags.map((tag) => (
      <Badge
        key={tag._id}
        className="me-2"
        bg="primary"
        onClick={() => history.push(`/tags/${tag._id}`)}
        style={{ cursor: "pointer" }}
      >
        #{tag.title}
      </Badge>
    ))
  }

  const handleLike = async () => {
    console.log(UserContext)
    try {
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prev) => !prev)
      const { data } = await axiosClient.post("/api/likes", {
        questionId: props._id,
        userId: user.user._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prev) => !prev)
      console.log(err)
    }
  }

  const handleBookmark = async () => {
    try {
      setIsBookmarked((prev) => !prev)
      const { data } = await axiosClient.post("/api/bookmarks", {
        questionId: props._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setIsBookmarked((prev) => !prev)
      console.log(err)
    }
  }

  console.log(props)

  return (
    <Card className="mb-1">
      <Card.Body>
        <Card.Title className="fs-5">
          <Link to={`/questions/${props._id}`} className="text-decoration-none">
            {props.title}
          </Link>
        </Card.Title>
        <Card.Subtitle className="text-muted">
          {formatDistance(new Date(props.createdAt), new Date(), {
            addSuffix: true,
          })}{" "}
          • Asked by {props.author.username}
        </Card.Subtitle>

        <Card.Text className="mt-3">
          <ReactMarkdown>{props.body}</ReactMarkdown>
        </Card.Text>

        <div className="tags">{renderTagBadges()}</div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div className="text-muted">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </div>
          <div>
            {user.user._id && (
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

export default AppQuestionCard
