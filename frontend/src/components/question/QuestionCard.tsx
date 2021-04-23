import { Badge } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import ReactMarkdown from "react-markdown"
import { formatDistance } from 'date-fns'

const QuestionCard: React.FC<QuestionInterface> = (props) => {
  const renderTagBadges = () => {
    return props.tags.map(tag => <Badge key={tag._id} className="me-2" bg="primary">#{tag.title}</Badge>)
  }  

  const formatDate = () => {
    return formatDistance(
      new Date(props.createdAt),
      new Date(),
      { addSuffix: true }
    )
  }
  
  return (
    <Card>
      <Card.Body>
        <Card.Title className="display-6">{props.title}</Card.Title>
        <Card.Subtitle className="mb-2">{props.author.username}</Card.Subtitle>
        {/* <Card.Subtitle className="mb-3 text-muted"><em>{format(new Date(props.createdAt), 'dd-MM-yyyy kk:mm ')}</em></Card.Subtitle> */}
        <Card.Subtitle className="mb-3 text-muted"><em>{formatDate()}</em></Card.Subtitle>
        <ReactMarkdown>{props.body}</ReactMarkdown>
        <div className="tags">
            {renderTagBadges()}
        </div>
      </Card.Body>
    </Card>
  )
}

export default QuestionCard
