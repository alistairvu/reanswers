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
  title: string
  body: string
  author: UserInterface
  createdAt: string
  likes: LikeInterface[]
  bookmarks: BookmarkInterface[]
  likeCount: number
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

interface BookmarkInterface {
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
  likes: LikeInterface[]
  bookmarks: BookmarkInterface[]
  likeCount: number
}
