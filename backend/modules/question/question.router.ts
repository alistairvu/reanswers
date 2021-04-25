import express from "express"
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  showQuestion,
} from "./question.controller"
import { protect, checkUser } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/:id").delete(protect, deleteQuestion)
router.route("/").post(protect, createQuestion).get(getQuestions)
router.route("/:id").get(checkUser, showQuestion)

export default router
