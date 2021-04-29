import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useQueryClient } from "react-query"
import MarkdownEditor from "@uiw/react-markdown-editor"
import axiosClient from "../../api"

interface QuestionUpdateDataInterface {
  content: string
}

interface QuestionUpdateFormProps {
  updates: string
  toggleForm: (value: boolean) => void
  questionId: string
}

const QuestionUpdateForm: React.FC<QuestionUpdateFormProps> = ({
  updates,
  toggleForm,
  questionId,
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const {
    watch,
    handleSubmit,
    setValue,
  } = useForm<QuestionUpdateDataInterface>()
  const markdownContent = watch("content", updates)
  const queryClient = useQueryClient()

  const handleUpdate = async (updateData: QuestionUpdateDataInterface) => {
    try {
      setIsUpdating(true)
      const { data } = await axiosClient.post(`/api/questions/${questionId}`, {
        ...updateData,
        questionId,
      })
      if (data.success) {
        console.log(data)
        queryClient.invalidateQueries(["question", questionId])
        setIsUpdating(false)
        toggleForm(false)
      }
    } catch (err) {
      setIsUpdating(false)
      console.log(err)
    }
  }

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Update your Question!</Card.Title>
        <Form onSubmit={handleSubmit(handleUpdate)}>
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

          <Button type="submit" variant="primary" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default QuestionUpdateForm
