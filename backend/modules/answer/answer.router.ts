import express from "express";
import { protect, checkUser } from "../../middlewares/auth.middleware"
import { createAnswer, deleteAnswer, getAnswers } from "./answer.controller";

const router = express.Router();

router.route("/question/:id").get(checkUser, getAnswers)
router.route("/").post(protect, createAnswer)
router.route("/:id").delete(protect, deleteAnswer)

export default router;