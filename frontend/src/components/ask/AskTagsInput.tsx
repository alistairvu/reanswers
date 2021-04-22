import Form from "react-bootstrap/Form"
import React, { useState } from "react"
import Badge from "react-bootstrap/Badge"

interface AskTagsInputProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

const AskTagsInput: React.FC<AskTagsInputProps> = ({ tags, setTags }) => {
  const [currentTag, setCurrentTag] = useState<string>("")

  const addToTags = (tag: string) => {
    if (!tags.includes(tag.trim().toLowerCase())) {
      setTags((prev) => [...prev, tag.trim().toLowerCase()])
    }
  }

  const removeFromTags = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addToTags(currentTag)
      setCurrentTag("")
    }
  }

  return (
    <>
      <Form.Control
        type="text"
        name="hours"
        placeholder="Tags..."
        value={currentTag}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCurrentTag(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />

      {tags.map((tag, index) => (
        <Badge
          bg="primary"
          className="me-1 mt-2"
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() => removeFromTags(tag)}
        >
          #{tag}{" "}
        </Badge>
      ))}
    </>
  )
}

export default AskTagsInput
