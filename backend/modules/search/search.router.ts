import express from "express"
import {
  searchQuestionsByKeyword,
  searchQuestionsByTag,
} from "./search.controller"
import { checkUser } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/questions").get(checkUser, searchQuestionsByKeyword)
router.route("/tags").get(checkUser, searchQuestionsByTag)

export default router
