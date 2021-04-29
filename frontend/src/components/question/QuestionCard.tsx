import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"
import { formatDistance } from "date-fns"
import { useState, useContext } from "react"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import QuestionUpdateForm from "./QuestionUpdateForm"
import { useHistory } from "react-router-dom"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const [isLiked, setIsLiked] = useState(props.likes.length > 0)
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarks.length > 0)
  const [isUpdateFormShown, setIsUpdateFormShown] = useState(false)
  const [likeCount, setLikeCount] = useState(props.likeCount)
  const user = useContext(UserContext)
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

  const formatDate = () => {
    return formatDistance(new Date(props.createdAt), new Date(), {
      addSuffix: true,
    })
  }

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      const { data } = await axiosClient.post("/api/likes", {
        questionId: props._id,
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

  const handleDelete = async () => {
    if (window.confirm("Do you really want to delete this question?")) {
      try {
        const { data } = await axiosClient.delete(`/api/questions/${props._id}`)
        if (data.success) {
          history.push("/")
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="display-6">{props.title}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          {formatDate()} • Asked by {props.author.username}
        </Card.Subtitle>

        <ReactMarkdown>{props.body}</ReactMarkdown>
        {props.updates && (
          <>
            <strong>Update:</strong>{" "}
            <ReactMarkdown>{props.updates}</ReactMarkdown>
          </>
        )}

        <div className="tags">{renderTagBadges()}</div>

        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </div>
            <div>
              {user.user._id === props.author._id && (
                <>
                  <i
                    className={`${
                      isUpdateFormShown ? "fas" : "far"
                    } fa-edit me-3`}
                    style={{
                      fontSize: "25px",
                      color: "#adb5bd",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsUpdateFormShown((prev) => !prev)}
                  ></i>
                  <i
                    className="far fa-trash-alt me-3"
                    style={{
                      fontSize: "25px",
                      color: "#adb5bd",
                      cursor: "pointer",
                    }}
                    onClick={handleDelete}
                  />
                </>
              )}
              {user.user._id && (
                <>
                  <i
                    className={`${
                      isBookmarked ? "fas" : "far"
                    } fa-bookmark me-3`}
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
          {isUpdateFormShown && (
            <QuestionUpdateForm
              updates={props.updates}
              toggleForm={setIsUpdateFormShown}
              questionId={props._id}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
