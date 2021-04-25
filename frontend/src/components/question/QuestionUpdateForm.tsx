import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import MarkdownEditor from "@uiw/react-markdown-editor"
import axiosClient from "../../api"

interface QuestionUpdateDataInterface {
  content: string
}

const QuestionUpdateForm: React.FC = () => {
    const {
      watch,
      handleSubmit,
      setValue,
      reset,
    } = useForm<QuestionUpdateDataInterface>()
    const markdownContent = watch("content", "")
    const { id: questionId } = useParams<{ id: string }>()
  
    const handleUpdate = async (updateData: QuestionUpdateDataInterface) => {
      try {
        const { data } = await axiosClient.post(`/api/questions/${questionId}`, {
          ...updateData,
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
  
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
  
  export default QuestionUpdateForm
  