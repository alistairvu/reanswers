import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"
import TagQuestionList from "../components/tag/TagQuestionList"

const TagPage: React.FC = () => {
  const { id: tagId } = useParams<{ id: string }>()

  return (
    <Container className="py-2">
      <TagQuestionList tagId={tagId} />
    </Container>
  )
}

export default TagPage
