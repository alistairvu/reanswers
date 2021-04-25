import express from "express"
import { getTopTags, getQuestionsByTag } from "./tag.controller"

const router = express.Router()

router.route("/top").get(getTopTags)
router.route("/:id").get(getQuestionsByTag)

export default router
