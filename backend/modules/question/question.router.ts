import express from "express"
import { createQuestion, deleteQuestion } from "./question.controller"
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/").post(protect, createQuestion)
router.route("/:id").delete(protect, deleteQuestion)

export default router
