import express from "express";
import { createQuestion, deleteQuestion, showQuestion } from "./question.controller";
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router();

router.route("/:id").delete(protect, deleteQuestion).get(showQuestion)
router.route("/create").post(protect, createQuestion);

export default router;
