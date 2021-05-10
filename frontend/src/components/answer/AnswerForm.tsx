import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { useQueryClient } from "react-query"
import MarkdownEditor from "@uiw/react-markdown-editor"
import axiosClient from "../../api"
import { useState } from "react"

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
  const queryClient = useQueryClient()
  const { id: questionId } = useParams<{ id: string }>()
  const [isAnswering, setIsAnswering] = useState(false)

  const handleAnswer = async (answerData: AnswerDataInterface) => {
    try {
      setIsAnswering(true)
      if (!answerData.content) {
        return window.alert("You must add some text to your answer!")
      }
      const { data } = await axiosClient.post("/api/answers", {
        ...answerData,
        questionId,
      })
      if (data.success) {
        console.log(data)
        queryClient.invalidateQueries(["answers", questionId])
        reset()
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsAnswering(false)
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

          <Button type="submit" variant="primary" disabled={isAnswering}>
            Answer
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AnswerForm
