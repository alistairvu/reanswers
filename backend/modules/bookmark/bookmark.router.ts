import express from "express"
import { protect } from "../../middlewares/auth.middleware"
import {
  handleBookmark,
  getBookmarkedQuestions,
  getBookmarkedAnswers,
} from "./bookmark.controller"

const router = express.Router()

router.route("/").post(protect, handleBookmark)
router.route("/questions").get(protect, getBookmarkedQuestions)
router.route("/answers").get(protect, getBookmarkedAnswers)

export default router
