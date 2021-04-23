import { Badge } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const renderTagBadges = () => {
    const tags = props.tags
    return tags.map(tag => <Badge>{tag}</Badge>)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <ReactMarkdown>{props.body}</ReactMarkdown>
        <div className="tags">
            {renderTagBadges()}
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
