import { formatDistance } from "date-fns"
import Card from "react-bootstrap/Card"
import { useState, useContext } from "react"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"

const AnswerCard: React.FC<AnswerInterface> = (props) => {
  const [isLiked, setIsLiked] = useState(props.likes.length > 0)
  const user = useContext(UserContext)
  
  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev)
      const { data } = await axiosClient.post("/api/likes", {
        answerId: props._id,
      })
      if (data.success) {
        console.log(data)
      }
    } catch (err) {
      setIsLiked((prev) => !prev)
      console.log(err)
    }
  }

  return (
    <Card className="mb-1">
      <Card.Body>
        <Card.Text className="fw-bolder">{props.author.username}</Card.Text>
        <Card.Text>{props.content}</Card.Text>
        <div className="d-flex justify-content-between">
          <Card.Text className="text-muted fw-bolder">
            {formatDistance(new Date(props.createdAt), new Date(), {
              addSuffix: true,
            })}
          </Card.Text>
          <div>
            {user.user._id && (
              <i
                className={`${isLiked ? "fas" : "far"} fa-heart`}
                style={{
                  cursor: "pointer",
                  fontSize: "25px",
                  color: isLiked ? "#d9534f" : "#adb5bd",
                }}
                onClick={handleLike}
              />
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default AnswerCard
