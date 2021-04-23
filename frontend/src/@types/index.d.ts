interface TagInterface {
  _id: string
  title: string
  count: number
}

interface UserInterface {
  _id: string
  username: string
  email: string
}

interface QuestionInterface {
  _id: string
  updates: string
  imageUrl: string
  tags: TagInterface[]
  likedBy: string[]
  title: string
  body: string
  author: UserInterface
  createdAt: string
}
