import express from "express"
import { protect } from "../../middlewares/auth.middleware"
import { handleBookmark, getBookmarkedQuestions } from "./bookmark.controller"

const router = express.Router()

router.route("/").post(protect, handleBookmark)
router.route("/questions").get(protect, getBookmarkedQuestions)

export default router
