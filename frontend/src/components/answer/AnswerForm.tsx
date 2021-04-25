import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import MarkdownEditor from "@uiw/react-markdown-editor"
import axiosClient from "../../api"

interface AnswerDataInterface {
  content: string
}

const AnswerForm: React.FC = () => {
  const {
    watch,
    handleSubmit,
    setValue,
    reset,
  } = useForm<AnswerDataInterface>()
  const markdownContent = watch("content", "")
  const { id: questionId } = useParams<{ id: string }>()

  const handleAnswer = async (answerData: AnswerDataInterface) => {
    try {
      const { data } = await axiosClient.post("/api/answers", {
        ...answerData,
        questionId,
      })
      if (data.success) {
        console.log(data)
        reset()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Give your answer!</Card.Title>
        <Form onSubmit={handleSubmit(handleAnswer)}>
          <Form.Group className="mb-3" controlId="body">
            <MarkdownEditor
              height={100}
              value={markdownContent}
              className="mb-2"
              placeholder="Body..."
              onChange={(editor: any, data: any, value: string) =>
                setValue("content", value)
              }
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Answer
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AnswerForm
