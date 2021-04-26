import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"

interface SearchData {
  keyword: string
}

const AppSearchBar: React.FC = () => {
  const history = useHistory()
  const { register, handleSubmit, reset } = useForm<SearchData>()

  const handleSearch = (searchData: SearchData) => {
    console.log(searchData)
    reset()
  }

  return (
    <Form
      className="mt-2 mt-md-0 me-md-4"
      onSubmit={handleSubmit(handleSearch)}
    >
      <InputGroup>
        <FormControl
          type="text"
          placeholder="Search..."
          aria-label="Search"
          {...register("keyword")}
        />
        <Button variant="outline-primary" type="submit">
          Search
        </Button>
      </InputGroup>
    </Form>
  )
}

export default AppSearchBar
