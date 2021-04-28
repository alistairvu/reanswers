import express from "express"
import {
  searchQuestionsByKeyword,
  searchQuestionsByTag,
  searchAnswersByKeyword,
} from "./search.controller"
import { checkUser } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/questions").get(checkUser, searchQuestionsByKeyword)
router.route("/answers").get(checkUser, searchAnswersByKeyword)
router.route("/tags").get(checkUser, searchQuestionsByTag)

export default router
