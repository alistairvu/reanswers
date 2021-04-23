import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import AppHelmet from "../components/AppHelmet"
import { useForm } from "react-hook-form"
import { useState } from "react"
import MarkdownEditor from "@uiw/react-markdown-editor"
import AskTagsInput from "../components/ask/AskTagsInput"
import axiosClient from "../api"
import { useHistory, useLocation } from "react-router-dom"

interface QuestionDataInterface {
  title: string
  body: string
}

const AskPage: React.FC = () => {
  const [tags, setTags] = useState<string[]>([])
  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get("redirect")
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<QuestionDataInterface>()
  const markdownText = watch("body", "")

  const handleAsk = async (questionData: QuestionDataInterface) => {
    console.log({ ...questionData, tags })
    try {
    const { data } = await axiosClient.post("/api/questions", { ...questionData, tags })
      if (data.success) {
        console.log(data)
        window.localStorage.setItem("jwt", data.token)
        history.push(redirect ? redirect : "/")
        console.log('success');
        
        reset()
        setTags([])
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <AppHelmet title="Ask" />

      <Container className="mt-3">
        <Row>
          <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
            <h1>Ask</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit(handleAsk)}>
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Title"
                      {...register("title", { required: true })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="body">
                    <MarkdownEditor
                      height={200}
                      value={markdownText}
                      className="mb-2"
                      placeholder="Body..."
                      onChange={(editor: any, data: any, value: string) =>
                        setValue("body", value)
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="tags">
                    <AskTagsInput tags={tags} setTags={setTags} />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Ask
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AskPage
