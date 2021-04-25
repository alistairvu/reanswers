import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"
import { formatDistance } from "date-fns"
import { Col, Row } from "react-bootstrap"
import { useState, useContext } from "react"
import axiosClient from "../../api"
import UserContext from "../../context/userContext"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const [likeBtnColor, setLikeBtnColor] = useState(
    props.likes.length ? "#fff" : "grey"
  )
  const user = useContext(UserContext)
  console.log(user.user._id)

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
      const { data } = await axiosClient.post("/api/likes", {
        questionId: props._id,
        userId: user.user._id,
      })
      if (data.success) {
        console.log(data)
        if (likeBtnColor === "#fff") {
          setLikeBtnColor("grey")
        } else {
          setLikeBtnColor("#fff")
        }
      }
    } catch (err) {
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
        <Row>
          <Col xs={10}>
            <div className="tags">{renderTagBadges()}</div>
          </Col>
          {user.user._id && (
            <Col>
              <i
                id="likeBtn"
                className="fas fa-heart"
                style={{
                  cursor: "pointer",
                  fontSize: "30px",
                  color: likeBtnColor,
                }}
                onClick={handleLike}
              />
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
