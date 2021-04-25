import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"
import { formatDistance } from "date-fns"
import { useState, useContext } from "react"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"
import QuestionUpdateForm from "./QuestionUpdateForm"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const [isLiked, setIsLiked] = useState(
    props.likes.length > 0
  )
  const [isUpdateFormShown, setIsUpdateFormShown] = useState(false)
  const user = useContext(UserContext)

  const renderTagBadges = () => {
    return props.tags.map((tag) => (
      <Badge key={tag._id} className="me-2" bg="primary">
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
    console.log(UserContext)
    try {
      setIsLiked(prev => !prev)
      const { data } = await axiosClient.post("/api/likes", {
        questionId: props._id,
        userId: user.user._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setIsLiked(prev => !prev)
      console.log(err)
    }
  }


  return (
    <Card>
      <Card.Body>
        <Card.Title className="display-6">{props.title}</Card.Title>
        <Card.Subtitle className="mb-2">{props.author.username}</Card.Subtitle>
        <Card.Subtitle className="mb-3 text-muted">
          <em>{formatDate()}</em>
        </Card.Subtitle>
        <ReactMarkdown>{props.body}</ReactMarkdown>
        <div className="tags">{renderTagBadges()}</div>
        <div className="mt-3">
          {user.user._id && (
            <i
              className="fas fa-heart"
              style={{
                cursor: "pointer",
                fontSize: "25px",
                color: isLiked ? "#d9534f" : "#adb5bd",
              }}
              onClick={handleLike}
            />
          )}
          {user.user._id === props.author._id && (
            <i
              className="fas fa-pen ms-3"
              style={{ fontSize: "25px", color: "#adb5bd", cursor: "pointer" }}
              onClick={() => setIsUpdateFormShown(prev => !prev)}
            ></i>
          )}
          {isUpdateFormShown && <QuestionUpdateForm/> }
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
