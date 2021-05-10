import express from "express"
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  getTopQuestions,
  showQuestion,
  updateQuestion,
  getQuestionsByUserId,
} from "./question.controller"
import { protect, checkUser } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/").post(protect, createQuestion).get(checkUser, getQuestions)
router.route("/top").get(checkUser, getTopQuestions)
router.route("/user/:id").get(getQuestionsByUserId)
router
  .route("/:id")
  .get(checkUser, showQuestion)
  .delete(protect, deleteQuestion)
  .post(protect, updateQuestion)

export default router
