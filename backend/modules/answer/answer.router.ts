import express from "express";
import { protect } from "../../middlewares/auth.middleware"
import { createAnswer, deleteAnswer, getAnswers } from "./answer.controller";

const router = express.Router();

router.route("/question/:id").get(getAnswers)
router.route("/").post(protect, createAnswer)
router.route("/:id").delete(protect, deleteAnswer)

export default router;