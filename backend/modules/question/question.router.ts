import express from "express";
import { createQuestion, deleteQuestion, getQuestions, showQuestion } from "./question.controller";
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router();

router.route("/:id").delete(protect, deleteQuestion).get(showQuestion)
router.route("/").post(protect, createQuestion).get(getQuestions);

export default router;
