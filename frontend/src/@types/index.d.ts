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
  likes: LikeInterface[]
}

interface NotificationInterface {
  _id: string
  title: string
  body: string
  link: string
  createdAt: string
}

interface LikeInterface {
  _id: string
  userId: string
  questionId: string
  answerId: string
}

interface AnswerInterface {
  _id: string
  content: string
  question: string
  author: UserInterface
  createdAt: string
  updatedAt: string
}
