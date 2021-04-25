import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"
import axiosClient from "../../api"
import { useContext, useState } from "react"
import UserContext from "../../context/userContext"

const HomeQuestionCard: React.FC<QuestionInterface> = (props) => {
  const user = useContext(UserContext)
  const [isLiked, setIsLiked] = useState(
    props.likes.length > 0
  )
  const renderTagBadges = () => {
    return props.tags.map((tag) => (
      <Badge key={tag._id} className="me-2" bg="primary">
        #{tag.title}
      </Badge>
    ))
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
    <Card className="mb-1">
      <Card.Body>
        <Card.Title>
          <Link to={`/questions/${props._id}`}>{props.title}</Link>
        </Card.Title>
        <Card.Text>{props.body}</Card.Text>
        <Card.Text className="text-muted">
          {formatDistance(new Date(props.createdAt), new Date(), {
            addSuffix: true,
          })}{" "}
          • Asked by {props.author.username}
        </Card.Text>
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
        </div>
      </Card.Body>
    </Card>
  )
}

export default HomeQuestionCard
