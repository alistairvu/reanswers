import { Badge } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const renderTagBadges = () => {
    return props.tags.map(tag => <Badge key={tag._id} className="me-2" bg="primary">#{tag.title}</Badge>)
  }  

  return (
    <Card>
      <Card.Body>
        <Card.Title >{props.title}</Card.Title>
        {/* <Card.Subtitle>{props.author.username}</Card.Subtitle> */}
        <ReactMarkdown>{props.body}</ReactMarkdown>
        <div className="tags">
            {renderTagBadges()}
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
